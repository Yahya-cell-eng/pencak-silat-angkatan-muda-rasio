export type UserRole = 'admin' | 'anggota';

export type BeltRankLevel = string;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored for member auth & admin credential management
  role: UserRole;
  memberId: string; // e.g. PMR-2026-0012
  phone: string;
  birthDate?: string; // Tanggal Lahir (YYYY-MM-DD)
  birthPlace?: string; // Tempat Lahir (misal: Gresik)
  nik?: string; // Nomor Induk Kependudukan 16 digit
  branch: string; // Cabang Gresik / Ranting di Gresik
  beltRank: BeltRankLevel;
  joinDate: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  emergencyContact?: string;
  bio?: string;
}

export interface AppConfig {
  appName: string;
  orgSubtitle: string;
  logoUrl: string;
  slogan: string;
  description: string;
  secretariatAddress: string;
  email: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  ketuaUmum: string;
  ktaSignatureTitle: string;
  announcementText: string;
  showAnnouncement: boolean;
  enablePublicRegistration: boolean;
  enableOnlineTraining: boolean;
  defaultPasswordPrefix: string;
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
  id: string;
  level: string; // Nama tingkatan sabuk (misal: Dasar, Putih, Kuning, dsb.)
  order: number; // Urutan tingkatan (1, 2, 3, dst.)
  colorHex: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  meaning: string;
  stage: string;
  description?: string;
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
