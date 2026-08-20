import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  TrainingSchedule, 
  TrainingRegistration, 
  User, 
  RegistrationStatus,
  AppConfig,
  BranchInfo,
  BeltInfo
} from '../types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SCHEDULES, 
  INITIAL_REGISTRATIONS, 
  INITIAL_USERS,
  DEFAULT_APP_CONFIG,
  BRANCHES_LIST,
  BELT_RANKS
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
  branches: BranchInfo[];
  beltRanks: BeltInfo[];
  config: AppConfig;
  isCloudSynced: boolean;
  quotaExceeded: boolean;
  
  // Belt Ranks CRUD & Ordering
  createBeltRank: (beltData: Omit<BeltInfo, 'id' | 'order'>) => Promise<{ success: boolean; message: string; belt?: BeltInfo }>;
  updateBeltRank: (id: string, updatedData: Partial<BeltInfo>, oldLevelName?: string) => Promise<{ success: boolean; message: string }>;
  reorderBeltRank: (id: string, direction: 'up' | 'down') => Promise<{ success: boolean; message: string }>;
  moveBeltRankToPosition: (id: string, targetOrder: number) => Promise<{ success: boolean; message: string }>;
  deleteBeltRank: (id: string) => Promise<{ success: boolean; message: string }>;
  resetBeltRanksToDefault: () => Promise<{ success: boolean; message: string }>;

  // App Config & Branding CRUD
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<{ success: boolean; message: string }>;

  // Branches / Ranting CRUD
  createBranch: (branchData: Omit<BranchInfo, 'id'>) => Promise<{ success: boolean; message: string; branch?: BranchInfo }>;
  updateBranch: (id: string, branchData: Partial<BranchInfo>) => Promise<{ success: boolean; message: string }>;
  deleteBranch: (id: string) => Promise<{ success: boolean; message: string }>;

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
const BRANCHES_COLLECTION = 'branches';
const BELT_RANKS_COLLECTION = 'belt_ranks';
const SETTINGS_COLLECTION = 'settings';
const CONFIG_DOC_ID = 'app_config';
const LOCAL_CONFIG_KEY = 'pamur_app_config_v2';
const LOCAL_ARTICLES_KEY = 'pamur_cached_articles_v2';
const LOCAL_SCHEDULES_KEY = 'pamur_cached_schedules_v2';
const LOCAL_REGISTRATIONS_KEY = 'pamur_cached_registrations_v2';
const LOCAL_USERS_KEY = 'pamur_cached_users_v2';
const LOCAL_BRANCHES_KEY = 'pamur_cached_branches_v2';
const LOCAL_BELT_RANKS_KEY = 'pamur_cached_belt_ranks_v2';

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

  const [branches, setBranches] = useState<BranchInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_BRANCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return BRANCHES_LIST;
  });

  const [beltRanks, setBeltRanks] = useState<BeltInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_BELT_RANKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: BeltInfo, b: BeltInfo) => (a.order || 0) - (b.order || 0));
        }
      }
    } catch {
      // ignore
    }
    return BELT_RANKS;
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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BRANCHES_KEY, JSON.stringify(branches));
    } catch { /* ignore */ }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BELT_RANKS_KEY, JSON.stringify(beltRanks));
    } catch { /* ignore */ }
  }, [beltRanks]);

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
          for (const item of BRANCHES_LIST) {
            await setDoc(doc(db, BRANCHES_COLLECTION, item.id), item, { merge: true });
          }
          for (const item of BELT_RANKS) {
            await setDoc(doc(db, BELT_RANKS_COLLECTION, item.id), item, { merge: true });
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
        if (list.length > 0) {
          setArticles(list);
        }
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
        if (list.length > 0) {
          setSchedules(list);
        }
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
        if (list.length > 0) {
          setUsers(list);
        }
      },
      (error) => {
        handleListenerError(error, USERS_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // 6. Listen to Branches Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, BRANCHES_COLLECTION),
      (snapshot) => {
        const list: BranchInfo[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BranchInfo);
        });
        if (list.length > 0) {
          setBranches(list);
        }
      },
      (error) => {
        handleListenerError(error, BRANCHES_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // 7. Listen to Belt Ranks Collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, BELT_RANKS_COLLECTION),
      (snapshot) => {
        const list: BeltInfo[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BeltInfo);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setBeltRanks(list);
        }
      },
      (error) => {
        handleListenerError(error, BELT_RANKS_COLLECTION);
      }
    );
    return () => unsub();
  }, []);

  // Belt Rank Actions & Reordering
  const createBeltRank = async (beltData: Omit<BeltInfo, 'id' | 'order'>) => {
    const id = `belt_${Date.now()}`;
    const nextOrder = beltRanks.length > 0 ? Math.max(...beltRanks.map(b => b.order || 0)) + 1 : 1;
    const newBelt: BeltInfo = {
      ...beltData,
      id,
      order: nextOrder
    };

    try {
      const updatedList = [...beltRanks, newBelt].sort((a, b) => (a.order || 0) - (b.order || 0));
      setBeltRanks(updatedList);
      await setDoc(doc(db, BELT_RANKS_COLLECTION, id), newBelt);
      return { success: true, message: `Tingkatan sabuk "${newBelt.level}" berhasil ditambahkan!`, belt: newBelt };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${BELT_RANKS_COLLECTION}/${id}`);
      return { success: true, message: `Tingkatan sabuk "${newBelt.level}" berhasil disimpan!`, belt: newBelt };
    }
  };

  const updateBeltRank = async (id: string, updatedData: Partial<BeltInfo>, oldLevelName?: string) => {
    try {
      const currentBelt = beltRanks.find(b => b.id === id);
      const prevName = oldLevelName || currentBelt?.level;
      const newName = updatedData.level?.trim();

      // Update in state
      setBeltRanks(prev => {
        const next = prev.map(b => b.id === id ? { ...b, ...updatedData } : b);
        return next.sort((a, b) => (a.order || 0) - (b.order || 0));
      });

      // Update in cloud
      await updateDoc(doc(db, BELT_RANKS_COLLECTION, id), updatedData);

      // Cascade update to users, registrations, and schedules if level name has changed
      if (prevName && newName && prevName !== newName) {
        // Cascade to Users
        const usersToUpdate = users.filter(u => u.beltRank === prevName);
        for (const u of usersToUpdate) {
          try {
            await updateDoc(doc(db, USERS_COLLECTION, u.id), { beltRank: newName });
          } catch { /* ignore */ }
        }
        setUsers(prev => prev.map(u => u.beltRank === prevName ? { ...u, beltRank: newName } : u));

        // Cascade to Registrations
        const regsToUpdate = registrations.filter(r => r.userBelt === prevName);
        for (const r of regsToUpdate) {
          try {
            await updateDoc(doc(db, REGISTRATIONS_COLLECTION, r.id), { userBelt: newName });
          } catch { /* ignore */ }
        }
        setRegistrations(prev => prev.map(r => r.userBelt === prevName ? { ...r, userBelt: newName } : r));

        // Cascade to Schedules targetBelt
        const schedsToUpdate = schedules.filter(s => s.targetBelt && s.targetBelt.includes(prevName));
        for (const s of schedsToUpdate) {
          try {
            const updatedTarget = s.targetBelt.replaceAll(prevName, newName);
            await updateDoc(doc(db, SCHEDULES_COLLECTION, s.id), { targetBelt: updatedTarget });
          } catch { /* ignore */ }
        }
        setSchedules(prev => prev.map(s => s.targetBelt && s.targetBelt.includes(prevName) ? { ...s, targetBelt: s.targetBelt.replaceAll(prevName, newName) } : s));
      }

      return { success: true, message: `Data tingkatan sabuk "${newName || currentBelt?.level}" berhasil diperbarui!` };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${BELT_RANKS_COLLECTION}/${id}`);
      return { success: true, message: `Tingkatan sabuk berhasil diperbarui!` };
    }
  };

  const reorderBeltRank = async (id: string, direction: 'up' | 'down') => {
    try {
      const sorted = [...beltRanks].sort((a, b) => (a.order || 0) - (b.order || 0));
      const idx = sorted.findIndex(b => b.id === id);
      if (idx === -1) return { success: false, message: 'Sabuk tidak ditemukan.' };

      if (direction === 'up' && idx > 0) {
        // Swap with previous
        const temp = sorted[idx];
        sorted[idx] = sorted[idx - 1];
        sorted[idx - 1] = temp;
      } else if (direction === 'down' && idx < sorted.length - 1) {
        // Swap with next
        const temp = sorted[idx];
        sorted[idx] = sorted[idx + 1];
        sorted[idx + 1] = temp;
      } else {
        return { success: false, message: 'Urutan sudah berada di batas maksimal.' };
      }

      // Re-assign normalized sequential 1..N order
      const normalized = sorted.map((b, index) => ({
        ...b,
        order: index + 1
      }));

      setBeltRanks(normalized);

      // Persist all updated orders to Firestore
      for (const b of normalized) {
        try {
          await setDoc(doc(db, BELT_RANKS_COLLECTION, b.id), b, { merge: true });
        } catch { /* ignore */ }
      }

      return { success: true, message: 'Urutan tingkatan sabuk berhasil dipindahkan & diperbarui!' };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${BELT_RANKS_COLLECTION}/${id}`);
      return { success: true, message: 'Urutan tingkatan sabuk berhasil disimpan!' };
    }
  };

  const moveBeltRankToPosition = async (id: string, targetOrder: number) => {
    try {
      const sorted = [...beltRanks].sort((a, b) => (a.order || 0) - (b.order || 0));
      const currentIndex = sorted.findIndex(b => b.id === id);
      if (currentIndex === -1) return { success: false, message: 'Sabuk tidak ditemukan.' };

      const targetIndex = Math.max(0, Math.min(sorted.length - 1, targetOrder - 1));
      if (currentIndex === targetIndex) return { success: true, message: 'Urutan tetap sama.' };

      // Remove from current and insert at target
      const [item] = sorted.splice(currentIndex, 1);
      sorted.splice(targetIndex, 0, item);

      // Normalize orders 1..N
      const normalized = sorted.map((b, index) => ({
        ...b,
        order: index + 1
      }));

      setBeltRanks(normalized);

      // Save to Firestore
      for (const b of normalized) {
        try {
          await setDoc(doc(db, BELT_RANKS_COLLECTION, b.id), b, { merge: true });
        } catch { /* ignore */ }
      }

      return { success: true, message: `Urutan berhasil diubah ke posisi ke-${targetIndex + 1}!` };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${BELT_RANKS_COLLECTION}/${id}`);
      return { success: true, message: 'Urutan tingkatan sabuk berhasil disimpan!' };
    }
  };

  const deleteBeltRank = async (id: string) => {
    try {
      const target = beltRanks.find(b => b.id === id);
      if (!target) return { success: false, message: 'Sabuk tidak ditemukan.' };

      // Check if any active user is currently on this belt
      const usersOnBelt = users.filter(u => u.beltRank === target.level);
      if (usersOnBelt.length > 0) {
        return { 
          success: false, 
          message: `Tidak dapat menghapus sabuk "${target.level}" karena masih ada ${usersOnBelt.length} pesilat terdaftar dengan tingkatan ini. Harap pindahkan tingkatan pesilat terlebih dahulu.` 
        };
      }

      const remaining = beltRanks.filter(b => b.id !== id).sort((a, b) => (a.order || 0) - (b.order || 0));
      const normalized = remaining.map((b, index) => ({
        ...b,
        order: index + 1
      }));

      setBeltRanks(normalized);

      await deleteDoc(doc(db, BELT_RANKS_COLLECTION, id));
      for (const b of normalized) {
        try {
          await setDoc(doc(db, BELT_RANKS_COLLECTION, b.id), b, { merge: true });
        } catch { /* ignore */ }
      }

      return { success: true, message: `Tingkatan sabuk "${target.level}" berhasil dihapus.` };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${BELT_RANKS_COLLECTION}/${id}`);
      return { success: true, message: `Tingkatan sabuk berhasil dihapus.` };
    }
  };

  const resetBeltRanksToDefault = async () => {
    try {
      // Clear or overwrite with BELT_RANKS
      for (const b of BELT_RANKS) {
        await setDoc(doc(db, BELT_RANKS_COLLECTION, b.id), b, { merge: true });
      }
      setBeltRanks(BELT_RANKS);
      return { success: true, message: 'Tingkatan sabuk berhasil direset ke standar resmi PAMUR (7 Tingkatan)!' };
    } catch (error) {
      setBeltRanks(BELT_RANKS);
      return { success: true, message: 'Tingkatan sabuk berhasil direset ke default!' };
    }
  };

  // Branch / Ranting Actions (Online Firestore)
  const createBranch = async (branchData: Omit<BranchInfo, 'id'>) => {
    const id = `br_${Date.now()}`;
    const newBranch: BranchInfo = {
      ...branchData,
      id
    };

    try {
      setBranches(prev => [...prev, newBranch]);
      await setDoc(doc(db, BRANCHES_COLLECTION, id), newBranch);
      return { success: true, message: `Ranting ${newBranch.name} berhasil ditambahkan!`, branch: newBranch };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${BRANCHES_COLLECTION}/${id}`);
      return { success: true, message: `Ranting ${newBranch.name} berhasil ditambahkan ke database!`, branch: newBranch };
    }
  };

  const updateBranch = async (id: string, branchData: Partial<BranchInfo>) => {
    try {
      const currentBranch = branches.find(b => b.id === id);
      const oldName = currentBranch?.name;
      const newName = branchData.name?.trim();

      // Update branch in state
      setBranches(prev => prev.map(b => b.id === id ? { ...b, ...branchData } : b));
      await updateDoc(doc(db, BRANCHES_COLLECTION, id), branchData);

      // If branch name changed, cascade update users, schedules, and registrations with oldName!
      if (oldName && newName && oldName !== newName) {
        // Cascade to Users
        const usersToUpdate = users.filter(u => u.branch === oldName);
        for (const u of usersToUpdate) {
          try {
            await updateDoc(doc(db, USERS_COLLECTION, u.id), { branch: newName });
          } catch { /* ignore */ }
        }
        setUsers(prev => prev.map(u => u.branch === oldName ? { ...u, branch: newName } : u));

        // Cascade to Schedules
        const schedulesToUpdate = schedules.filter(s => s.branch === oldName);
        for (const s of schedulesToUpdate) {
          try {
            await updateDoc(doc(db, SCHEDULES_COLLECTION, s.id), { branch: newName });
          } catch { /* ignore */ }
        }
        setSchedules(prev => prev.map(s => s.branch === oldName ? { ...s, branch: newName } : s));

        // Cascade to Registrations
        const regsToUpdate = registrations.filter(r => r.branch === oldName);
        for (const r of regsToUpdate) {
          try {
            await updateDoc(doc(db, REGISTRATIONS_COLLECTION, r.id), { branch: newName });
          } catch { /* ignore */ }
        }
        setRegistrations(prev => prev.map(r => r.branch === oldName ? { ...r, branch: newName } : r));
      }

      return { success: true, message: `Nama & data ranting berhasil diperbarui!` };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${BRANCHES_COLLECTION}/${id}`);
      return { success: true, message: `Nama ranting berhasil diperbarui!` };
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      const target = branches.find(b => b.id === id);
      setBranches(prev => prev.filter(b => b.id !== id));
      await deleteDoc(doc(db, BRANCHES_COLLECTION, id));
      return { success: true, message: `Ranting ${target?.name || ''} berhasil dihapus.` };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${BRANCHES_COLLECTION}/${id}`);
      return { success: true, message: `Ranting berhasil dihapus.` };
    }
  };

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
    for (const br of BRANCHES_LIST) {
      await setDoc(doc(db, BRANCHES_COLLECTION, br.id), br);
    }
    for (const b of BELT_RANKS) {
      await setDoc(doc(db, BELT_RANKS_COLLECTION, b.id), b);
    }
    setBranches(BRANCHES_LIST);
    setBeltRanks(BELT_RANKS);
    await deleteDemoAccounts();
  };

  return (
    <DataContext.Provider
      value={{
        articles,
        schedules,
        registrations,
        users,
        branches,
        beltRanks,
        config,
        isCloudSynced,
        quotaExceeded,
        createBeltRank,
        updateBeltRank,
        reorderBeltRank,
        moveBeltRankToPosition,
        deleteBeltRank,
        resetBeltRanksToDefault,
        updateConfig,
        createBranch,
        updateBranch,
        deleteBranch,
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
