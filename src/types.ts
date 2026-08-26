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
  joinYear?: string; // Tahun Masuk Perguruan (misal: 2024, 2026, dll)
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  emergencyContact?: string;
  bio?: string;
  gender?: string; // 'Laki-laki' | 'Perempuan'
  address?: string;
  bloodType?: string; // 'A' | 'B' | 'AB' | 'O'
  occupationOrSchool?: string;
  uniformSize?: string;
  healthNotes?: string;
  motivation?: string;
  paymentProof?: string;
  registrationFeePaid?: boolean;
  customAnswers?: Record<string, string>;
}

export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
  options?: string[]; // for select dropdown
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  helpText?: string;
}

export interface RegistrationFieldsVisibility {
  nik: { enabled: boolean; required: boolean };
  phone: { enabled: boolean; required: boolean };
  birthDate: { enabled: boolean; required: boolean };
  birthPlace: { enabled: boolean; required: boolean };
  gender: { enabled: boolean; required: boolean };
  address: { enabled: boolean; required: boolean };
  joinYear: { enabled: boolean; required: boolean };
  emergencyContact: { enabled: boolean; required: boolean };
  bloodType: { enabled: boolean; required: boolean };
  occupationOrSchool: { enabled: boolean; required: boolean };
  uniformSize: { enabled: boolean; required: boolean };
  healthNotes: { enabled: boolean; required: boolean };
  motivation: { enabled: boolean; required: boolean };
}

export interface RegistrationFormConfig {
  isOpen: boolean;
  closedMessage: string;
  title: string;
  subtitle: string;
  instructions: string;
  formTitle?: string;
  formSubtitle?: string;
  formInstructions?: string;
  requireAdminApproval: boolean; // Jika true: pendaftar masuk status 'pending', jika false: langsung 'active'
  registrationFee: number; // 0 = gratis
  paymentInfo: string;
  requirePaymentProof: boolean;
  termsAndConditions: string;
  successMessage: string;
  whatsappConfirmationPhone: string;
  defaultBeltRank: string;
  allowSelectBelt: boolean;
  allowSelectBranch: boolean;
  defaultBranch: string;
  fields: RegistrationFieldsVisibility;
  customFields: CustomFormField[];
}

export interface AppConfig {
  appName: string;
  shortName?: string;
  orgSubtitle: string;
  logoUrl: string;
  slogan: string;
  description: string;
  secretariatAddress: string;
  address?: string;
  contactAddress?: string;
  email: string;
  phone: string;
  contactPhone?: string;
  contactEmail?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  ketuaUmum: string;
  ktaSignatureTitle: string;
  announcementText: string;
  showAnnouncement: boolean;
  enablePublicRegistration: boolean;
  enableOnlineTraining: boolean;
  enableTrainingRegistration?: boolean;
  enableDigitalKTA?: boolean;
  enableETicket?: boolean;
  enableArticles?: boolean;
  defaultPasswordPrefix: string;

  // Hero & Home Section Customization
  heroBadgeText?: string;
  heroTitle?: string;
  heroHighlightText?: string;
  heroSubtitle?: string;
  heroEstablishedYear?: string;
  heroQuoteText?: string;

  // Footer & About Section Customization
  footerAboutText?: string;
  footerTagline?: string;
  copyrightText?: string;
}

export type ArticleCategory = 
  | 'Berita & Kegiatan' 
  | 'Jurus & Teknik' 
  | 'Filosofi & Sejarah' 
  | 'Prestasi & Kejuaraan' 
  | 'Pengumuman Resmi';

export type GalleryPhotoCategory =
  | 'Kegiatan & Latihan'
  | 'Kejuaraan & Prestasi'
  | 'Ujian Kenaikan Tingkat (UKT)'
  | 'Tradisi & Seremonial'
  | 'Latihan Gabungan'
  | 'Lainnya';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryPhotoCategory;
  imageUrl: string;
  description?: string;
  date: string; // e.g. '24 Agustus 2026'
  location?: string; // e.g. 'Padepokan PAMUR Gresik'
  uploadedBy?: string;
  createdAt: string;
  createdAtTimestamp?: number;
  likes?: number;
  tags?: string[];
}

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

export type KTAPresetTheme = 
  | 'dark_crimson' 
  | 'classic_red' 
  | 'navy_gold' 
  | 'emerald_warrior' 
  | 'obsidian_gold' 
  | 'clean_white';

export interface KTACardConfig {
  themePreset: KTAPresetTheme;
  logoUrl?: string;
  primaryColor: string; // e.g. '#991b1b'
  secondaryColor: string; // e.g. '#0f172a'
  accentColor: string; // e.g. '#d97706'
  textColor: string; // e.g. '#ffffff'
  orientation: 'horizontal' | 'vertical';
  cardTitle: string; // e.g. 'KARTU TANDA ANGGOTA'
  orgName: string; // e.g. 'PENCAK SILAT PAMUR'
  orgSubtitle: string; // e.g. 'Angkatan Muda Rasio Indonesia'
  branchSubtitle: string; // e.g. 'Pengurus Cabang Kabupaten Gresik'
  badgeText: string; // e.g. 'KTA RESMI'
  showWatermark: boolean;
  watermarkOpacity: number; // 0.05 to 0.3
  showQrCode: boolean;
  showBarcode: boolean;
  showBeltColorBar: boolean;
  showBloodType: boolean;
  showJoinDate: boolean;
  showJoinYear?: boolean;
  showValidity: boolean;
  validityText: string; // e.g. 'Seumur Hidup'
  
  // Signatures & Stamp Configuration
  showSignatures: boolean;
  signatureCount?: 1 | 2; // 1 = Hanya Ketua Cabang (Official standard), 2 = Dual signatures
  signatureLocation?: 'front' | 'back' | 'both';
  signatureTitle1: string; // e.g. 'Ketua Pengurus Cabang'
  signatureName1: string; // e.g. 'Dewan Guru Bambang Sutrisno'
  signatureImg1?: string; // Uploaded Signature 1 (Data URL or image URL)
  signatureTitle2?: string; // Optional Secondary e.g. 'Dewan Guru Utama'
  signatureName2?: string; // Optional Secondary e.g. 'Pelatih Bambang S.'
  signatureImg2?: string; // Uploaded Signature 2 (Data URL or image URL)
  stampImg?: string; // Uploaded Official Perguruan / Cabang Stamp
  showStamp?: boolean; // Toggle display of official stamp overlay
  
  footerNote: string; // e.g. 'Kartu ini adalah tanda bukti sah keanggotaan resmi Perguruan Silat PAMUR.'
  cardBackgroundPattern: 'gradient' | 'geometric' | 'batik' | 'minimal';
  
  // Back Side Detailed Customization
  showBackSide: boolean;
  backTitle?: string; // e.g. 'PANCA PRASETYA & KETENTUAN KTA'
  backSubtitle?: string; // e.g. 'Ikrar Pesilat PAMUR:'
  backRulesText: string; // The list of pledge/rules or bullet points
  backTermsHeading?: string; // e.g. 'Tata Tertib Pemegang Kartu:'
  backTermsText?: string; // Additional terms & rules
  backContactInfo?: string; // e.g. 'Pusat Informasi: 0812-3456-7890 | Sekretariat: Gresik, Jawa Timur'
  backOrgName?: string; // e.g. 'Pencak Silat PAMUR Indonesia'
  showBackQr?: boolean;
  showBackBarcode?: boolean;
  showBackSignatures?: boolean;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  userId?: string;
  userName: string;
  userRole?: UserRole;
  userBelt?: string;
  avatar?: string;
  content: string;
  createdAt: string; // e.g. '25 Agu 2026, 19:30'
  createdAtTimestamp?: number;
}

export interface PasswordResetRequest {
  id: string;
  userId?: string;
  userMemberId?: string;
  userName?: string;
  name?: string;
  userEmail?: string;
  email: string;
  userPhone?: string;
  phone?: string;
  contactPhone?: string;
  nik?: string;
  userBranch?: string;
  userBelt?: string;
  proposedPassword?: string;
  newTemporaryPassword?: string;
  reason?: string;
  createdAt: string;
  requestedAt?: string;
  requestedAtTimestamp?: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedAt?: string;
  processedAtTimestamp?: number;
  processedBy?: string;
}
