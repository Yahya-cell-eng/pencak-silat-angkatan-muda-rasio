import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  TrainingSchedule, 
  TrainingRegistration, 
  User, 
  RegistrationStatus,
  AppConfig 
} from '../types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SCHEDULES, 
  INITIAL_REGISTRATIONS, 
  INITIAL_USERS,
  DEFAULT_APP_CONFIG 
} from '../data/initialData';
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc,
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

interface DataContextType {
  articles: Article[];
  schedules: TrainingSchedule[];
  registrations: TrainingRegistration[];
  users: User[];
  config: AppConfig;
  isCloudSynced: boolean;
  quotaExceeded: boolean;
  
  // App Config & Branding CRUD
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<{ success: boolean; message: string }>;

  // Articles CRUD
  createArticle: (articleData: Omit<Article, 'id' | 'createdAt' | 'views'>) => Promise<{ success: boolean; message: string; article?: Article }>;
  updateArticle: (id: string, articleData: Partial<Article>) => Promise<{ success: boolean; message: string }>;
  deleteArticle: (id: string) => Promise<{ success: boolean; message: string }>;
  incrementArticleViews: (id: string) => Promise<void>;

  // Schedules CRUD
  createSchedule: (scheduleData: Omit<TrainingSchedule, 'id' | 'currentEnrolled'>) => Promise<{ success: boolean; message: string; schedule?: TrainingSchedule }>;
  updateSchedule: (id: string, scheduleData: Partial<TrainingSchedule>) => Promise<{ success: boolean; message: string }>;
  deleteSchedule: (id: string) => Promise<{ success: boolean; message: string }>;

  // Training Online Registration
  registerForTraining: (scheduleId: string, user: User, notes?: string) => Promise<{ success: boolean; message: string; registration?: TrainingRegistration }>;
  cancelRegistration: (registrationId: string) => Promise<{ success: boolean; message: string }>;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => Promise<{ success: boolean; message: string }>;
  getUserRegistrations: (userId: string) => TrainingRegistration[];

  // Admin User & Password Management
  adminUpdateUser: (userId: string, updatedData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  adminResetPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  adminCreateUser: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; message: string; user?: User }>;
  adminDeleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  adminBulkImportMembers: (membersData: Array<Partial<User> & { name: string; email?: string }>) => Promise<{ success: boolean; count: number; users: User[]; message: string; results?: Array<{ member: User; generatedPassword: string }> }>;
  deleteDemoAccounts: () => Promise<{ success: boolean; count: number; message: string }>;

  // System Helpers
  resetAllDataToDefault: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ARTICLES_COLLECTION = 'articles';
const SCHEDULES_COLLECTION = 'training_schedules';
const REGISTRATIONS_COLLECTION = 'training_registrations';
const USERS_COLLECTION = 'users';
const SETTINGS_COLLECTION = 'settings';
const CONFIG_DOC_ID = 'app_config';
const LOCAL_CONFIG_KEY = 'pamur_app_config_v2';
const LOCAL_ARTICLES_KEY = 'pamur_cached_articles_v2';
const LOCAL_SCHEDULES_KEY = 'pamur_cached_schedules_v2';
const LOCAL_REGISTRATIONS_KEY = 'pamur_cached_registrations_v2';
const LOCAL_USERS_KEY = 'pamur_cached_users_v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ARTICLES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ARTICLES;
  });

  const [schedules, setSchedules] = useState<TrainingSchedule[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SCHEDULES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SCHEDULES;
  });

  const [registrations, setRegistrations] = useState<TrainingRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REGISTRATIONS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CONFIG_KEY);
      if (saved) return { ...DEFAULT_APP_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_APP_CONFIG;
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(articles));
    } catch { /* ignore */ }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_SCHEDULES_KEY, JSON.stringify(schedules));
    } catch { /* ignore */ }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(registrations));
    } catch { /* ignore */ }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch { /* ignore */ }
  }, [users]);

  // Check quota error helper
  const handleListenerError = (error: unknown, path: string) => {
    handleFirestoreError(error, OperationType.GET, path);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Quota') || msg.includes('quota') || msg.includes('resource-exhausted')) {
      setQuotaExceeded(true);
    }
  };

  // 0. Initial Seed Once (Does not re-seed when user deletes items)
  useEffect(() => {
    const checkAndSeedInitialData = async () => {
      try {
        const seedRef = doc(db, SETTINGS_COLLECTION, 'initial_seed');
        const seedSnap = await getDoc(seedRef);
        if (!seedSnap.exists()) {
          // First time database setup: seed initial records
          for (const item of INITIAL_ARTICLES) {
            await setDoc(doc(db, ARTICLES_COLLECTION, item.id), item, { merge: true });
          }
          for (const item of INITIAL_SCHEDULES) {
            await setDoc(doc(db, SCHEDULES_COLLECTION, item.id), item, { merge: true });
          }
          for (const item of INITIAL_REGISTRATIONS) {
            await setDoc(doc(db, REGISTRATIONS_COLLECTION, item.id), item, { merge: true });
          }
          for (const item of INITIAL_USERS) {
            await setDoc(doc(db, USERS_COLLECTION, item.id), item, { merge: true });
          }
          await setDoc(doc(db, SETTINGS_COLLECTION, CONFIG_DOC_ID), DEFAULT_APP_CONFIG, { merge: true });
          await setDoc(seedRef, { seeded: true, timestamp: Date.now() });
        }
      } catch (err) {
        console.warn('Initial seed check error', err);
      }
    };
    checkAndSeedInitialData();
  }, []);

  // 1. Listen to Settings / App Config
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, SETTINGS_COLLECTION, CONFIG_DOC_ID),
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudConfig = docSnap.data() as AppConfig;
          const merged = { ...DEFAULT_APP_CONFIG, ...cloudConfig };
          setConfig(merged);
          try {
            localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        handleListenerError(error, `${SETTINGS_COLLECTION}/${CONFIG_DOC_ID}`);
      }
    );
    return () => unsub();
  }, []);

  // 2. Listen to Articles Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, ARTICLES_COLLECTION),
      (snapshot) => {
        const list: Article[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Article);
        });
        setArticles(list);
        setIsCloudSynced(true);
      },
      (error) => {
        handleListenerError(error, ARTICLES_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // 3. Listen to Training Schedules Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, SCHEDULES_COLLECTION),
      (snapshot) => {
        const list: TrainingSchedule[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingSchedule);
        });
        setSchedules(list);
      },
      (error) => {
        handleListenerError(error, SCHEDULES_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // 4. Listen to Training Registrations Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, REGISTRATIONS_COLLECTION),
      (snapshot) => {
        const list: TrainingRegistration[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingRegistration);
        });
        setRegistrations(list);
      },
      (error) => {
        handleListenerError(error, REGISTRATIONS_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // 5. Listen to Users Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, USERS_COLLECTION),
      (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as User);
        });
        setUsers(list);
      },
      (error) => {
        handleListenerError(error, USERS_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // Article Actions (Online Firestore)
  const createArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'views'>) => {
    const id = `art_${Date.now()}`;
    const newArticle: Article = {
      ...articleData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1
    };

    try {
      await setDoc(doc(db, ARTICLES_COLLECTION, id), newArticle);
      return { success: true, message: 'Artikel berhasil diterbitkan ke database online!', article: newArticle };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${ARTICLES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal menerbitkan artikel ke server.' };
    }
  };

  const updateArticle = async (id: string, articleData: Partial<Article>) => {
    try {
      const payload = {
        ...articleData,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      await updateDoc(doc(db, ARTICLES_COLLECTION, id), payload);
      return { success: true, message: 'Artikel berhasil diperbarui di database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal memperbarui artikel.' };
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      setArticles(prev => prev.filter(a => a.id !== id));
      await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
      return { success: true, message: 'Artikel berhasil dihapus dari database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${ARTICLES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal menghapus artikel.' };
    }
  };

  const incrementArticleViews = async (id: string) => {
    const target = articles.find(a => a.id === id);
    if (!target) return;
    try {
      await updateDoc(doc(db, ARTICLES_COLLECTION, id), { views: (target.views || 0) + 1 });
    } catch (error) {
      console.warn('View count update error', error);
    }
  };

  // Schedule Actions
  const createSchedule = async (scheduleData: Omit<TrainingSchedule, 'id' | 'currentEnrolled'>) => {
    const id = `sch_${Date.now()}`;
    const newSchedule: TrainingSchedule = {
      ...scheduleData,
      id,
      currentEnrolled: 0
    };

    try {
      await setDoc(doc(db, SCHEDULES_COLLECTION, id), newSchedule);
      return { success: true, message: 'Jadwal latihan baru berhasil ditambahkan ke online!', schedule: newSchedule };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${SCHEDULES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal menyimpan jadwal latihan.' };
    }
  };

  const updateSchedule = async (id: string, scheduleData: Partial<TrainingSchedule>) => {
    try {
      await updateDoc(doc(db, SCHEDULES_COLLECTION, id), scheduleData);
      return { success: true, message: 'Jadwal latihan berhasil diperbarui di database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${SCHEDULES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal memperbarui jadwal.' };
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      setSchedules(prev => prev.filter(s => s.id !== id));
      await deleteDoc(doc(db, SCHEDULES_COLLECTION, id));
      return { success: true, message: 'Jadwal latihan berhasil dihapus dari database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${SCHEDULES_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal menghapus jadwal.' };
    }
  };

  // Online Training Registration
  const registerForTraining = async (scheduleId: string, user: User, notes?: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      return { success: false, message: 'Jadwal latihan tidak ditemukan.' };
    }

    if (schedule.status !== 'buka') {
      return { success: false, message: 'Pendaftaran sesi latihan ini sudah ditutup atau dibatalkan.' };
    }

    if (schedule.currentEnrolled >= schedule.maxQuota) {
      return { success: false, message: 'Kuota latihan sudah penuh. Silakan pilih sesi lainnya.' };
    }

    const existing = registrations.find(
      r => r.scheduleId === scheduleId && r.userId === user.id && r.status !== 'Dibatalkan'
    );
    if (existing) {
      return { 
        success: false, 
        message: `Anda sudah terdaftar pada sesi latihan ini (Kode Tiket: ${existing.ticketCode}).` 
      };
    }

    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `PMR-REG-${randomTicketNum}`;
    const regId = `reg_${Date.now()}`;

    const newReg: TrainingRegistration = {
      id: regId,
      scheduleId: schedule.id,
      scheduleTitle: schedule.title,
      scheduleDate: schedule.date,
      scheduleTime: `${schedule.timeStart} - ${schedule.timeEnd}`,
      location: schedule.location,
      branch: schedule.branch,
      userId: user.id,
      userName: user.name,
      userMemberId: user.memberId,
      userBelt: user.beltRank,
      userPhone: user.phone,
      registeredAt: new Date().toLocaleString('id-ID'),
      status: 'Terkonfirmasi',
      ticketCode,
      notes: notes || ''
    };

    try {
      await setDoc(doc(db, REGISTRATIONS_COLLECTION, regId), newReg);
      await updateDoc(doc(db, SCHEDULES_COLLECTION, scheduleId), {
        currentEnrolled: schedule.currentEnrolled + 1
      });

      return { 
        success: true, 
        message: `Pendaftaran Latihan Berhasil! Tiket Anda: ${ticketCode}`,
        registration: newReg 
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${REGISTRATIONS_COLLECTION}/${regId}`);
      return { success: false, message: 'Gagal melakukan pendaftaran online.' };
    }
  };

  const cancelRegistration = async (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, message: 'Data pendaftaran tidak ditemukan.' };

    try {
      await updateDoc(doc(db, REGISTRATIONS_COLLECTION, registrationId), { status: 'Dibatalkan' });
      const targetSchedule = schedules.find(s => s.id === reg.scheduleId);
      if (targetSchedule) {
        await updateDoc(doc(db, SCHEDULES_COLLECTION, reg.scheduleId), {
          currentEnrolled: Math.max(0, targetSchedule.currentEnrolled - 1)
        });
      }
      return { success: true, message: 'Pendaftaran latihan berhasil dibatalkan.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${registrationId}`);
      return { success: false, message: 'Gagal membatalkan pendaftaran.' };
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: RegistrationStatus) => {
    try {
      await updateDoc(doc(db, REGISTRATIONS_COLLECTION, registrationId), { status });
      return { success: true, message: `Status kehadiran diperbarui menjadi ${status}.` };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${registrationId}`);
      return { success: false, message: 'Gagal memperbarui status presensi.' };
    }
  };

  const getUserRegistrations = (userId: string) => {
    return registrations.filter(r => r.userId === userId);
  };

  // Admin User & Password Management
  const adminUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, userId), updatedData);
      return { success: true, message: 'Data anggota berhasil diperbarui secara online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
      return { success: false, message: 'Gagal memperbarui data user.' };
    }
  };

  const adminResetPassword = async (userId: string, newPassword: string) => {
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'Password baru minimal 4 karakter.' };
    }
    try {
      await updateDoc(doc(db, USERS_COLLECTION, userId), { password: newPassword.trim() });
      return { success: true, message: 'Password user berhasil direset di cloud database.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
      return { success: false, message: 'Gagal mereset password.' };
    }
  };

  const adminCreateUser = async (userData: Omit<User, 'id'>) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar dalam sistem.' };
    }

    const id = `usr_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id
    };

    try {
      await setDoc(doc(db, USERS_COLLECTION, id), newUser);
      return { success: true, message: `Akun ${newUser.role === 'admin' ? 'Admin' : 'Anggota'} berhasil disimpan ke database online!`, user: newUser };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${USERS_COLLECTION}/${id}`);
      return { success: false, message: 'Gagal membuat user baru di cloud.' };
    }
  };

  const adminDeleteUser = async (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target?.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return { success: false, message: 'Tidak dapat menghapus admin utama yang tersisa.' };
      }
    }
    try {
      setUsers(prev => prev.filter(u => u.id !== userId));
      await deleteDoc(doc(db, USERS_COLLECTION, userId));
      return { success: true, message: 'User berhasil dihapus dari database online.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${USERS_COLLECTION}/${userId}`);
      return { success: false, message: 'Gagal menghapus user.' };
    }
  };

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    const updated: AppConfig = { ...config, ...newConfig };
    setConfig(updated);
    try {
      localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(updated));
      await setDoc(doc(db, SETTINGS_COLLECTION, CONFIG_DOC_ID), updated, { merge: true });
      return { success: true, message: 'Pengaturan perguruan dan logo berhasil disimpan secara online!' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${SETTINGS_COLLECTION}/${CONFIG_DOC_ID}`);
      return { success: true, message: 'Pengaturan disimpan secara lokal.' };
    }
  };

  const adminBulkImportMembers = async (membersData: Array<Partial<User> & { name: string; email?: string }>) => {
    if (!membersData || membersData.length === 0) {
      return { success: false, count: 0, users: [], message: 'Tidak ada data anggota untuk diimpor.' };
    }

    const createdUsers: User[] = [];
    const timestamp = Date.now();
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < membersData.length; i++) {
      const raw = membersData[i];
      if (!raw.name || !raw.name.trim()) continue;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedMemberId = raw.memberId?.trim() || `PMR-${currentYear}-${randomNum}`;
      
      // Auto-generate safe password: e.g. pamur + random 4 digits (e.g. pamur7821) or custom provided password
      const generatedPassword = raw.password?.trim() || `${config.defaultPasswordPrefix || 'pamur'}${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Clean email or auto-generate based on name slug
      const nameSlug = raw.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
      const generatedEmail = raw.email?.trim() || `${nameSlug || 'anggota'}${randomNum}@pamur.id`;

      const id = `usr_imp_${timestamp}_${i + 1}`;
      const newUser: User = {
        id,
        name: raw.name.trim(),
        email: generatedEmail,
        password: generatedPassword,
        role: raw.role || 'anggota',
        memberId: generatedMemberId,
        phone: raw.phone?.trim() || '-',
        birthDate: raw.birthDate?.trim() || '',
        birthPlace: raw.birthPlace?.trim() || 'Gresik',
        nik: raw.nik?.trim() || '',
        branch: raw.branch?.trim() || 'Cabang Gresik',
        beltRank: raw.beltRank || 'Putih',
        joinDate: raw.joinDate?.trim() || new Date().toISOString().split('T')[0],
        avatar: raw.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(raw.name.trim())}`,
        status: raw.status || 'active',
        emergencyContact: raw.emergencyContact || '-',
        bio: raw.bio || 'Pesilat PAMUR Cabang Gresik.'
      };

      try {
        await setDoc(doc(db, USERS_COLLECTION, id), newUser);
      } catch (err) {
        console.error('Error saving imported user to firestore:', err);
      }
      createdUsers.push(newUser);
    }

    if (createdUsers.length > 0) {
      setUsers(prev => {
        const existingIds = new Set(prev.map(u => u.id));
        const toAdd = createdUsers.filter(u => !existingIds.has(u.id));
        return [...prev, ...toAdd];
      });
    }

    return {
      success: true,
      count: createdUsers.length,
      users: createdUsers,
      message: `Berhasil mengimpor ${createdUsers.length} data anggota dan otomatis tersimpan ke sistem!`
    };
  };

  const deleteDemoAccounts = async () => {
    const demoIds = ['usr_member_01', 'usr_member_02', 'usr_member_03', 'usr_member_04'];
    const demoEmails = ['budi@pamur.id', 'siti@pamur.id', 'fauzi@pamur.id', 'reza@pamur.id'];
    
    const targets = users.filter(u => demoIds.includes(u.id) || demoEmails.includes(u.email.toLowerCase()));
    for (const t of targets) {
      try {
        await deleteDoc(doc(db, USERS_COLLECTION, t.id));
      } catch (err) {
        console.error('Error deleting demo account', err);
      }
    }
    return { success: true, count: targets.length, message: `${targets.length} akun demo berhasil dihapus dari cloud database.` };
  };

  const resetAllDataToDefault = async () => {
    for (const art of INITIAL_ARTICLES) {
      await setDoc(doc(db, ARTICLES_COLLECTION, art.id), art);
    }
    for (const sch of INITIAL_SCHEDULES) {
      await setDoc(doc(db, SCHEDULES_COLLECTION, sch.id), sch);
    }
    for (const reg of INITIAL_REGISTRATIONS) {
      await setDoc(doc(db, REGISTRATIONS_COLLECTION, reg.id), reg);
    }
    for (const usr of INITIAL_USERS) {
      await setDoc(doc(db, USERS_COLLECTION, usr.id), usr);
    }
    await deleteDemoAccounts();
  };

  return (
    <DataContext.Provider
      value={{
        articles,
        schedules,
        registrations,
        users,
        config,
        isCloudSynced,
        quotaExceeded,
        updateConfig,
        createArticle,
        updateArticle,
        deleteArticle,
        incrementArticleViews,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        registerForTraining,
        cancelRegistration,
        updateRegistrationStatus,
        getUserRegistrations,
        adminUpdateUser,
        adminResetPassword,
        adminCreateUser,
        adminDeleteUser,
        adminBulkImportMembers,
        deleteDemoAccounts,
        resetAllDataToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
