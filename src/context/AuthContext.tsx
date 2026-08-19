import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, BeltRankLevel } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => { success: boolean; message: string };
  register: (data: RegisterFormData) => { success: boolean; message: string; user?: User };
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => { success: boolean; message: string };
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  quickLogin: (type: 'admin' | 'member1' | 'member2') => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  branch: string;
  beltRank: BeltRankLevel;
  emergencyContact?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'pamur_users_db_v1';
const CURRENT_USER_KEY = 'pamur_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback
    }
    // Default logged in as demo member for immediate exploration, or null
    return null;
  });

  // Sync users in localStorage
  useEffect(() => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch (e) {
      console.error('Failed to init users in localStorage', e);
    }
  }, []);

  const getUsersFromStorage = (): User[] => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  };

  const saveUsersToStorage = (users: User[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  const login = (identifier: string, password: string): { success: boolean; message: string } => {
    const users = getUsersFromStorage();
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

  const register = (data: RegisterFormData): { success: boolean; message: string; user?: User } => {
    const users = getUsersFromStorage();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.' };
    }

    // Generate member ID: PMR-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedMemberId = `PMR-${currentYear}-${randomNum}`;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: 'anggota',
      memberId: generatedMemberId,
      phone: data.phone.trim(),
      branch: data.branch || 'Ranting Pusat (Surabaya)',
      beltRank: data.beltRank || 'Putih',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=831843,b91c1c,d97706`,
      status: 'active',
      emergencyContact: data.emergencyContact || '',
      bio: `Anggota baru PAMUR ${data.branch}. Berlatih pencak silat dengan semangat rasio.`
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    
    // Auto login
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { 
      success: true, 
      message: `Pendaftaran berhasil! Nomor Anggota PAMUR Anda: ${generatedMemberId}`,
      user: newUser 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updatedData: Partial<User>): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };

    const users = getUsersFromStorage();
    const updatedUser: User = { ...currentUser, ...updatedData };

    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveUsersToStorage(newUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    return { success: true, message: 'Profil Anda berhasil diperbarui.' };
  };

  const changePassword = (oldPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };
    
    if (currentUser.password !== oldPassword) {
      return { success: false, message: 'Kata sandi lama salah.' };
    }

    if (newPassword.length < 5) {
      return { success: false, message: 'Kata sandi baru minimal 5 karakter.' };
    }

    const users = getUsersFromStorage();
    const updatedUser: User = { ...currentUser, password: newPassword };

    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveUsersToStorage(newUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    return { success: true, message: 'Kata sandi berhasil diubah.' };
  };

  const quickLogin = (type: 'admin' | 'member1' | 'member2') => {
    const users = getUsersFromStorage();
    let targetEmail = 'admin@pamur.id';
    if (type === 'member1') targetEmail = 'budi@pamur.id';
    if (type === 'member2') targetEmail = 'siti@pamur.id';

    const targetUser = users.find(u => u.email === targetEmail) || INITIAL_USERS.find(u => u.email === targetEmail);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(targetUser));
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
        changePassword,
        quickLogin
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
