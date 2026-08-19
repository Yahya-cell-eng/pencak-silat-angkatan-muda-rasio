import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BeltRankLevel } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => { success: boolean; message: string };
  register: (data: RegisterFormData) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
  nik: string;
  ranting?: string;
  beltRank: BeltRankLevel;
  emergencyContact?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'pamur_current_user_v1';
const USERS_COLLECTION = 'users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Listen to Firestore Users in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, USERS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: User[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as User);
          });
          setUsers(list);

          // Ensure default admin accounts exist
          INITIAL_USERS.forEach(async (adminUser) => {
            if (!list.some(u => u.email.toLowerCase() === adminUser.email.toLowerCase())) {
              try {
                await setDoc(doc(db, USERS_COLLECTION, adminUser.id), adminUser);
              } catch {
                // ignore
              }
            }
          });

          // Update current user if data was changed in cloud
          if (currentUser) {
            const updated = list.find((u) => u.id === currentUser.id);
            if (updated) {
              setCurrentUser(updated);
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
            }
          }
        } else {
          // Initialize default users if collection is empty
          INITIAL_USERS.forEach(async (usr) => {
            try {
              await setDoc(doc(db, USERS_COLLECTION, usr.id), usr);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, USERS_COLLECTION);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, USERS_COLLECTION);
      }
    );

    return () => unsub();
  }, [currentUser?.id]);

  const login = (identifier: string, password: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    
    const matchedUser = users.find(
      u => (u.email.toLowerCase() === cleanId || u.memberId.toLowerCase() === cleanId)
    );

    if (!matchedUser) {
      return { success: false, message: 'Email atau Nomor Anggota tidak ditemukan.' };
    }

    if (matchedUser.status === 'inactive') {
      return { success: false, message: 'Akun Anda sedang dinonaktifkan oleh administrator.' };
    }

    if (matchedUser.password !== password) {
      return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
    }

    setCurrentUser(matchedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
    return { success: true, message: `Selamat datang kembali, ${matchedUser.name}!` };
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.' };
    }

    // Generate member ID: PMR-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedMemberId = `PMR-${currentYear}-${randomNum}`;
    const id = `usr_${Date.now()}`;

    const assignedBranch = data.ranting ? `Ranting ${data.ranting} (Gresik)` : 'Cabang Gresik';

    const newUser: User = {
      id,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: 'anggota',
      memberId: generatedMemberId,
      phone: data.phone.trim(),
      birthDate: data.birthDate?.trim() || '',
      birthPlace: data.birthPlace?.trim() || 'Gresik',
      nik: data.nik?.trim() || '',
      branch: assignedBranch,
      beltRank: data.beltRank || 'Putih',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=831843,b91c1c,d97706`,
      status: 'active',
      emergencyContact: data.emergencyContact || '',
      bio: `Anggota PAMUR ${assignedBranch}. Berlatih pencak silat dengan ketajaman rasio dan budi pekerti luhur.`
    };

    try {
      await setDoc(doc(db, USERS_COLLECTION, id), newUser);
      setCurrentUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return { 
        success: true, 
        message: `Pendaftaran berhasil! Nomor Anggota PAMUR Anda: ${generatedMemberId}`,
        user: newUser 
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${USERS_COLLECTION}/${id}`);
      return {
        success: false,
        message: 'Gagal mendaftar ke server online. Silakan coba lagi.'
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };

    try {
      await updateDoc(doc(db, USERS_COLLECTION, currentUser.id), updatedData);
      const updatedUser: User = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return { success: true, message: 'Profil Anda berhasil diperbarui di database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${currentUser.id}`);
      return { success: false, message: 'Gagal memperbarui profil.' };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };
    
    if (currentUser.password !== oldPassword) {
      return { success: false, message: 'Kata sandi lama salah.' };
    }

    if (newPassword.length < 5) {
      return { success: false, message: 'Kata sandi baru minimal 5 karakter.' };
    }

    try {
      await updateDoc(doc(db, USERS_COLLECTION, currentUser.id), { password: newPassword });
      const updatedUser: User = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return { success: true, message: 'Kata sandi berhasil diubah di database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${currentUser.id}`);
      return { success: false, message: 'Gagal mengubah kata sandi.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
