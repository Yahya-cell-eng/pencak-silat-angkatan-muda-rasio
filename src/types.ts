export type UserRole = 'admin' | 'anggota';

export type BeltRankLevel = 
  | 'Putih' 
  | 'Kuning' 
  | 'Hijau' 
  | 'Biru' 
  | 'Cokelat' 
  | 'Hitam (Pendekar)';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored locally for demo auth & admin password reset
  role: UserRole;
  memberId: string; // e.g. PMR-2024-0012
  phone: string;
  branch: string; // e.g. Ranting Pusat, Ranting Surabaya, etc.
  beltRank: BeltRankLevel;
  joinDate: string;
  avatar?: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
  bio?: string;
}

export type ArticleCategory = 
  | 'Berita & Kegiatan' 
  | 'Jurus & Teknik' 
  | 'Filosofi & Sejarah' 
  | 'Prestasi & Kejuaraan' 
  | 'Pengumuman Resmi';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: ArticleCategory;
  author: string;
  createdAt: string;
  updatedAt?: string;
  views: number;
  status: 'published' | 'draft';
  tags: string[];
}

export type TrainingCategory = 
  | 'Latihan Reguler'
  | 'Tanding / Prestasi'
  | 'Seni & Kembangan'
  | 'Ujian Kenaikan Tingkat (UKT)'
  | 'Latihan Gabungan Antar Ranting';

export interface TrainingSchedule {
  id: string;
  title: string;
  day: string; // e.g. 'Senin', 'Kamis', 'Sabtu', 'Minggu'
  date: string; // YYYY-MM-DD
  timeStart: string; // HH:mm
  timeEnd: string; // HH:mm
  location: string;
  branch: string;
  coach: string;
  targetBelt: string; // e.g. 'Semua Tingkatan', 'Sabuk Hijau ke Atas', 'Sabuk Hitam'
  category: TrainingCategory;
  maxQuota: number;
  currentEnrolled: number;
  status: 'buka' | 'tutup' | 'dibatalkan';
  requirements?: string;
  description?: string;
}

export type RegistrationStatus = 'Terkonfirmasi' | 'Hadir' | 'Dibatalkan';

export interface TrainingRegistration {
  id: string;
  scheduleId: string;
  scheduleTitle: string;
  scheduleDate: string;
  scheduleTime: string;
  location: string;
  branch: string;
  userId: string;
  userName: string;
  userMemberId: string;
  userBelt: BeltRankLevel;
  userPhone: string;
  registeredAt: string;
  status: RegistrationStatus;
  ticketCode: string; // e.g. PMR-REG-8921
  notes?: string;
}

export interface BeltInfo {
  level: BeltRankLevel;
  colorHex: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  meaning: string;
  stage: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  headCoach: string;
  contact: string;
  memberCount: number;
}
