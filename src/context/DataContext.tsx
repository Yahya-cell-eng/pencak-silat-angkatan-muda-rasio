import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  TrainingSchedule, 
  TrainingRegistration, 
  User, 
  UserRole, 
  BeltRankLevel, 
  RegistrationStatus 
} from '../types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SCHEDULES, 
  INITIAL_REGISTRATIONS, 
  INITIAL_USERS 
} from '../data/initialData';

interface DataContextType {
  articles: Article[];
  schedules: TrainingSchedule[];
  registrations: TrainingRegistration[];
  users: User[];
  
  // Articles CRUD
  createArticle: (articleData: Omit<Article, 'id' | 'createdAt' | 'views'>) => { success: boolean; message: string; article?: Article };
  updateArticle: (id: string, articleData: Partial<Article>) => { success: boolean; message: string };
  deleteArticle: (id: string) => { success: boolean; message: string };
  incrementArticleViews: (id: string) => void;

  // Schedules CRUD
  createSchedule: (scheduleData: Omit<TrainingSchedule, 'id' | 'currentEnrolled'>) => { success: boolean; message: string; schedule?: TrainingSchedule };
  updateSchedule: (id: string, scheduleData: Partial<TrainingSchedule>) => { success: boolean; message: string };
  deleteSchedule: (id: string) => { success: boolean; message: string };

  // Training Online Registration
  registerForTraining: (scheduleId: string, user: User, notes?: string) => { success: boolean; message: string; registration?: TrainingRegistration };
  cancelRegistration: (registrationId: string) => { success: boolean; message: string };
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => { success: boolean; message: string };
  getUserRegistrations: (userId: string) => TrainingRegistration[];

  // Admin User & Password Management
  adminUpdateUser: (userId: string, updatedData: Partial<User>) => { success: boolean; message: string };
  adminResetPassword: (userId: string, newPassword: string) => { success: boolean; message: string };
  adminCreateUser: (userData: Omit<User, 'id'>) => { success: boolean; message: string; user?: User };
  adminDeleteUser: (userId: string) => { success: boolean; message: string };

  // System Helpers
  resetAllDataToDefault: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ARTICLES_KEY = 'pamur_articles_db_v1';
const SCHEDULES_KEY = 'pamur_schedules_db_v1';
const REGISTRATIONS_KEY = 'pamur_registrations_db_v1';
const USERS_KEY = 'pamur_users_db_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const data = localStorage.getItem(ARTICLES_KEY);
      return data ? JSON.parse(data) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [schedules, setSchedules] = useState<TrainingSchedule[]>(() => {
    try {
      const data = localStorage.getItem(SCHEDULES_KEY);
      return data ? JSON.parse(data) : INITIAL_SCHEDULES;
    } catch {
      return INITIAL_SCHEDULES;
    }
  });

  const [registrations, setRegistrations] = useState<TrainingRegistration[]>(() => {
    try {
      const data = localStorage.getItem(REGISTRATIONS_KEY);
      return data ? JSON.parse(data) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to sync articles', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
    } catch (e) {
      console.error('Failed to sync schedules', e);
    }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to sync registrations', e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to sync users', e);
    }
  }, [users]);

  // Article Actions
  const createArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'views'>) => {
    const newArticle: Article = {
      ...articleData,
      id: `art_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1
    };
    setArticles(prev => [newArticle, ...prev]);
    return { success: true, message: 'Artikel berhasil diterbitkan!', article: newArticle };
  };

  const updateArticle = (id: string, articleData: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...articleData, updatedAt: new Date().toISOString().split('T')[0] } : a));
    return { success: true, message: 'Artikel berhasil diperbarui.' };
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    return { success: true, message: 'Artikel berhasil dihapus.' };
  };

  const incrementArticleViews = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a));
  };

  // Schedule Actions
  const createSchedule = (scheduleData: Omit<TrainingSchedule, 'id' | 'currentEnrolled'>) => {
    const newSchedule: TrainingSchedule = {
      ...scheduleData,
      id: `sch_${Date.now()}`,
      currentEnrolled: 0
    };
    setSchedules(prev => [newSchedule, ...prev]);
    return { success: true, message: 'Jadwal latihan baru berhasil ditambahkan!', schedule: newSchedule };
  };

  const updateSchedule = (id: string, scheduleData: Partial<TrainingSchedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...scheduleData } : s));
    return { success: true, message: 'Jadwal latihan berhasil diperbarui.' };
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    return { success: true, message: 'Jadwal latihan berhasil dihapus.' };
  };

  // Online Training Registration
  const registerForTraining = (scheduleId: string, user: User, notes?: string) => {
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

    // Check if user is already registered for this schedule
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

    const newReg: TrainingRegistration = {
      id: `reg_${Date.now()}`,
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

    setRegistrations(prev => [newReg, ...prev]);

    // Increment enrolled count
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, currentEnrolled: s.currentEnrolled + 1 } : s));

    return { 
      success: true, 
      message: `Pendaftaran Latihan Berhasil! Tiket Anda: ${ticketCode}`,
      registration: newReg 
    };
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, message: 'Data pendaftaran tidak ditemukan.' };

    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status: 'Dibatalkan' } : r));

    // Decrement enrolled count
    setSchedules(prev => prev.map(s => s.id === reg.scheduleId ? { ...s, currentEnrolled: Math.max(0, s.currentEnrolled - 1) } : s));

    return { success: true, message: 'Pendaftaran latihan berhasil dibatalkan.' };
  };

  const updateRegistrationStatus = (registrationId: string, status: RegistrationStatus) => {
    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status } : r));
    return { success: true, message: `Status kehadiran diperbarui menjadi ${status}.` };
  };

  const getUserRegistrations = (userId: string) => {
    return registrations.filter(r => r.userId === userId);
  };

  // Admin User & Password Management
  const adminUpdateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    return { success: true, message: 'Data anggota berhasil diperbarui oleh Admin.' };
  };

  const adminResetPassword = (userId: string, newPassword: string) => {
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'Password baru minimal 4 karakter.' };
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword.trim() } : u));
    return { success: true, message: 'Password user berhasil direset.' };
  };

  const adminCreateUser = (userData: Omit<User, 'id'>) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar dalam sistem.' };
    }

    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    setUsers(prev => [newUser, ...prev]);
    return { success: true, message: `Akun ${newUser.role === 'admin' ? 'Admin' : 'Anggota'} berhasil dibuat!`, user: newUser };
  };

  const adminDeleteUser = (userId: string) => {
    // Prevent deleting all admins
    const target = users.find(u => u.id === userId);
    if (target?.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return { success: false, message: 'Tidak dapat menghapus admin utama yang tersisa.' };
      }
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true, message: 'User berhasil dihapus dari sistem.' };
  };

  const resetAllDataToDefault = () => {
    setArticles(INITIAL_ARTICLES);
    setSchedules(INITIAL_SCHEDULES);
    setRegistrations(INITIAL_REGISTRATIONS);
    setUsers(INITIAL_USERS);
    localStorage.removeItem(ARTICLES_KEY);
    localStorage.removeItem(SCHEDULES_KEY);
    localStorage.removeItem(REGISTRATIONS_KEY);
    localStorage.removeItem(USERS_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        articles,
        schedules,
        registrations,
        users,
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
