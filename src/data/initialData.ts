import { User, Article, TrainingSchedule, TrainingRegistration, BeltInfo, BranchInfo, AppConfig, RegistrationFormConfig, KTACardConfig } from '../types';

export const DEFAULT_KTA_CONFIG: KTACardConfig = {
  themePreset: 'dark_crimson',
  logoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300&auto=format&fit=crop&q=80',
  primaryColor: '#991b1b', // Red-800 PAMUR
  secondaryColor: '#0f172a', // Slate-900 Luxury
  accentColor: '#f59e0b', // Amber Gold
  textColor: '#ffffff',
  orientation: 'horizontal',
  cardTitle: 'KARTU TANDA ANGGOTA',
  orgName: 'PENCAK SILAT PAMUR',
  orgSubtitle: 'Angkatan Muda Rasio Indonesia',
  branchSubtitle: 'Pengurus Cabang Kabupaten Gresik',
  badgeText: 'KTA RESMI',
  showWatermark: true,
  watermarkOpacity: 0.12,
  showQrCode: true,
  showBarcode: true,
  showBeltColorBar: true,
  showBloodType: true,
  showJoinDate: true,
  showValidity: true,
  validityText: 'Seumur Hidup',
  showSignatures: true,
  signatureLocation: 'both',
  signatureTitle1: 'Ketua Pengcab Gresik',
  signatureName1: 'Dewan Guru Bambang Sutrisno',
  signatureImg1: '',
  signatureTitle2: 'Dewan Guru Utama',
  signatureName2: 'Hendra Sahroni',
  signatureImg2: '',
  stampImg: '',
  showStamp: true,
  footerNote: 'Kartu ini adalah bukti sah keanggotaan resmi Perguruan Pencak Silat PAMUR.',
  cardBackgroundPattern: 'gradient',
  showBackSide: true,
  backTitle: 'PANCA PRASETYA & KETENTUAN KTA',
  backSubtitle: 'Ikrar Pesilat PAMUR:',
  backRulesText: '1. Bertaqwa kepada Tuhan Yang Maha Esa.\n2. Berbakti kepada orang tua, guru, dan tanah air Indonesia.\n3. Menjunjung tinggi budi pekerti luhur dan persaudaraan.\n4. Mengutamakan akal pikiran sehat (rasio) dan kesabaran.\n5. Pantang menyerah dan membela kebenaran serta keadilan.',
  backTermsHeading: 'Tata Tertib Pemegang Kartu:',
  backTermsText: '1. Kartu ini adalah hak milik Perguruan Silat PAMUR dan hanya berlaku bagi nama yang tertera.\n2. Wajib dibawa saat latihan gabungan, ujian kenaikan tingkat, dan kejuaraan resmi.\n3. Apabila kartu ini ditemukan, harap mengembalikan ke Sekretariat Cabang PAMUR terdekat.',
  backContactInfo: 'Pusat Informasi: 0812-3456-7890 | Sekretariat Cabang Gresik',
  backOrgName: 'Pencak Silat PAMUR Indonesia',
  showBackQr: true,
  showBackSignatures: true,
};

export const DEFAULT_REGISTRATION_CONFIG: RegistrationFormConfig = {
  isOpen: true,
  closedMessage: 'Pendaftaran anggota baru silat PAMUR saat ini sedang ditutup sementara. Nantikan gelombang penerimaan berikutnya atau hubungi pengurus ranting terdekat.',
  title: 'Formulir Pendaftaran Anggota Baru PAMUR',
  subtitle: 'Perguruan Pencak Silat Angkatan Muda Rasio Cabang Kabupaten Gresik',
  instructions: 'Lengkapi biodata resmi calon pesilat PAMUR di bawah ini dengan teliti. Data akan diverifikasi untuk penerbitan Kartu Tanda Anggota (KTA) resmi dan penempatan jadwal latihan.',
  requireAdminApproval: true,
  registrationFee: 0,
  paymentInfo: 'Transfer Biaya Pendaftaran / Seragam ke: Bank Jatim / BCA No. Rek: 0123-4567-89 a.n. PAMUR Cabang Gresik (Konfirmasi bukti via WA panitia)',
  requirePaymentProof: false,
  termsAndConditions: '1. Bersedia mentaati Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) Perguruan Silat PAMUR.\n2. Bersedia mengikuti jadwal latihan rutin secara disiplin dan menjaga etika budi luhur pesilat.\n3. Menggunakan keilmuan beladiri semata-mata untuk membela kebenaran, membela diri, dan kemaslahatan masyarakat.',
  successMessage: 'Pendaftaran Anda berhasil dikirim! Silakan menunggu konfirmasi & verifikasi admin atau hubungi narahubung WhatsApp pengurus.',
  whatsappConfirmationPhone: '0812-3456-7890',
  defaultBeltRank: 'Dasar',
  allowSelectBelt: true,
  allowSelectBranch: true,
  defaultBranch: 'Cabang Gresik',
  fields: {
    nik: { enabled: true, required: false },
    phone: { enabled: true, required: true },
    birthDate: { enabled: true, required: true },
    birthPlace: { enabled: true, required: true },
    gender: { enabled: true, required: true },
    address: { enabled: true, required: true },
    emergencyContact: { enabled: true, required: false },
    bloodType: { enabled: true, required: false },
    occupationOrSchool: { enabled: true, required: false },
    uniformSize: { enabled: true, required: false },
    healthNotes: { enabled: true, required: false },
    motivation: { enabled: true, required: false }
  },
  customFields: [
    {
      id: 'fld_pengalaman',
      label: 'Pengalaman / Riwayat Bela Diri Sebelumnya',
      type: 'select',
      options: ['Belum Pernah (Pemula)', 'Pernah di Ranting PAMUR Lain', 'Pernah di Perguruan IPSI Lain', 'Bela Diri Non-Silat (Karate/Taekwondo/dll)'],
      placeholder: 'Pilih riwayat bela diri',
      required: false,
      enabled: true,
      helpText: 'Membantu pelatih ranting dalam pengelompokan materi awal.'
    },
    {
      id: 'fld_izin_ortu',
      label: 'Pernyataan Izin Orang Tua / Wali',
      type: 'checkbox',
      placeholder: 'Saya menyatakan telah mendapatkan izin orang tua/wali untuk berlatih resmi di Perguruan PAMUR.',
      required: false,
      enabled: true,
      helpText: 'Disarankan dicentang untuk calon pesilat usia di bawah 18 tahun.'
    }
  ]
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'PAMUR Pengcab Gresik',
  orgSubtitle: 'Perguruan Pencak Silat Angkatan Muda Rasio • Cabang Kabupaten Gresik',
  logoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300&auto=format&fit=crop&q=80',
  slogan: 'Kekuatan Fisik, Ketajaman Rasio & Budi Pekerti Luhur',
  description: 'Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) Cabang Gresik membina generasi muda pesilat yang tangguh, berakhlak mulia, berprestasi dalam kejuaraan, dan berfikir rasional ilmiah.',
  secretariatAddress: 'Padepokan PAMUR Cabang Gresik, Jl. Dr. Wahidin Sudirohusodo No. 112, Kebomas, Kab. Gresik, Jawa Timur 61124',
  email: 'gresik@pamur.id',
  phone: '0812-3456-7890',
  instagram: '@pamur_gresik',
  facebook: 'PAMUR Cabang Gresik',
  youtube: 'PAMUR Gresik TV',
  ketuaUmum: 'Dewan Guru Bambang Sutrisno',
  ktaSignatureTitle: 'Ketua Pengurus Cabang PAMUR Gresik',
  announcementText: 'Pendaftaran Kejuaraan Pencak Silat Antar Ranting Se-Kabupaten Gresik 2026 resmi dibuka! Segera daftarkan kontingen ranting Anda.',
  showAnnouncement: true,
  enablePublicRegistration: true,
  enableOnlineTraining: true,
  defaultPasswordPrefix: 'pamur'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Dewan Guru Bambang Sutrisno',
    email: 'admin@pamur.id',
    password: 'admin123',
    role: 'admin',
    memberId: '51026001',
    phone: '0812-3456-7890',
    birthDate: '1975-06-15',
    birthPlace: 'Gresik',
    nik: '3525011506750001',
    branch: 'Cabang Gresik',
    beltRank: 'Hitam (Pendekar)',
    joinDate: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0811-2233-4455 (Ibu Ratna)',
    bio: 'Ketua Dewan Pelatih Perguruan Pencak Silat PAMUR Cabang Gresik. Pelatih Nasional Tingkat Utama.'
  },
  {
    id: 'usr_admin_02',
    name: 'Yhendra Sahroni (Admin Utama)',
    email: 'yhendrasahroni@gmail.com',
    password: 'admin123',
    role: 'admin',
    memberId: '51026002',
    phone: '0812-3456-7890',
    birthDate: '1985-01-01',
    birthPlace: 'Gresik',
    nik: '3525010101850001',
    branch: 'Cabang Gresik',
    beltRank: 'Hitam (Pendekar)',
    joinDate: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0812-3456-7890',
    bio: 'Administrator Utama Portal PAMUR Pengcab Gresik.'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_01',
    title: 'Sejarah & Filosofi Rasio dalam Perguruan Pencak Silat PAMUR',
    excerpt: 'Mengenal asas keilmuan dan filosofi rasionalisme gerak yang mendasari kelahiran Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR).',
    content: `Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) merupakan salah satu perguruan pencak silat historis di Indonesia yang memadukan kekayaan tradisi silat Nusantara dengan pendekatan ilmiah dan rasionalitas gerak beladiri.

### Asas Rasio & Keilmuan
Nama "Rasio" merefleksikan prinsip bahwa setiap gerak langkah, tangkisan, elakan, dan serangan dalam silat tidak didasarkan pada mistisisme melainkan pada efisiensi biomekanika, kecepatan reaksi, dan ketepatan momentum.

> "Seorang pesilat PAMUR tidak hanya tangguh fisiknya, namun juga tajam akal budinya dan luhur budi pekertinya."

### Tiga Pilar Karakter Pesilat PAMUR
1. **Keimanan & Ketakwaan**: Menjadikan nilai spiritual sebagai kompas moral dalam menggunakan ilmu beladiri.
2. **Kecerdasan Rasio**: Mampu membaca situasi, mengendalikan emosi, dan mengambil keputusan cepat saat terancam.
3. **Jiwa Kesatria**: Pantang menyerah, membela yang lemah, dan senantiasa menjunjung tinggi persaudaraan sesama anggota.`,
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    category: 'Filosofi & Sejarah',
    author: 'Dewan Guru Bambang Sutrisno',
    createdAt: '2026-08-10',
    views: 428,
    status: 'published',
    tags: ['Filosofi', 'Sejarah', 'Asas Rasio', 'Karakter']
  },
  {
    id: 'art_02',
    title: 'Tips Mempersiapkan Diri Menghadapi Ujian Kenaikan Tingkat (UKT) Sabuk',
    excerpt: 'Panduan lengkap bagi anggota sabuk Putih, Kuning, dan Hijau untuk menguasai materi fisik, jurus wajib, dan ketahanan mental.',
    content: `Ujian Kenaikan Tingkat (UKT) bukan sekadar seremonial pergantian warna sabuk, melainkan tolok ukur kesiapan mental, kedisiplinan, dan penguasaan teknik dasar.

### 1. Penguasaan Kuda-kuda dan Pola Langkah
Kuda-kuda yang kokoh adalah fondasi semua jurus PAMUR. Latihlah kuda-kuda tengah, depan, dan silang secara konsisten setiap hari minimal 15 menit.

### 2. Kelenturan dan Stamina Kardio
Peserta UKT akan diuji dengan lari ketahanan, variasi push-up silat, sit-up, serta peragaan sambut (aplikasi gerak) selama berjam-jam. Pastikan tidur cukup dan hidrasi optimal.

### 3. Pemahaman Makna Warna Sabuk
Penguji tidak hanya menilai fisik, tetapi juga wawancara mengenai kode etik dan filosofi tingkatan sabuk yang akan disandang.`,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    category: 'Jurus & Teknik',
    author: 'Pelatih Ridwan Hakim',
    createdAt: '2026-08-14',
    views: 290,
    status: 'published',
    tags: ['UKT', 'Latihan Fisik', 'Kenaikan Sabuk', 'Tips']
  },
  {
    id: 'art_03',
    title: 'Kontingen PAMUR Raih 5 Emas di Kejuaraan Pencak Silat Antar Paguyuban 2026',
    excerpt: 'Prestasi gemilang diraih pesilat muda PAMUR cabang Jawa Timur dan Madura dalam kategori tanding dan seni ganda.',
    content: `Kontingen Perguruan Pencak Silat PAMUR kembali menorehkan prestasi membanggakan pada Kejuaraan Terbuka Pencak Silat Nasional yang berlangsung akhir pekan lalu.

Pesilat-pesilat muda PAMUR berhasil mendominasi di nomor Tanding Putra Kelas C Dewasa, Kelas D Remaja, serta Kategori Seni Tunggal Baku IPSI.

"Ini adalah bukti nyata kerja keras para atlet dan pelatih ranting yang terus berlatih disiplin sesuai program rasio intensif," tutur Ketua Kontingen.

Perguruan memberikan apresiasi beasiswa pembinaan bagi para peraih medali untuk terus berlatih menuju jenjang Pekan Olahraga Nasional.`,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    category: 'Prestasi & Kejuaraan',
    author: 'Humas PAMUR Pusat',
    createdAt: '2026-08-16',
    views: 615,
    status: 'published',
    tags: ['Prestasi', 'Kejuaraan', 'Medali Emas', 'IPSI']
  },
  {
    id: 'art_04',
    title: 'Pendaftaran Program Pemusatan Latihan Atlet Tanding Periode Semester II',
    excerpt: 'Pengumuman resmi pembukaan seleksi atlet tanding dan pembinaan khusus bagi pesilat berprestasi usia 15-24 tahun.',
    content: `Pengurus Pusat PAMUR membuka seleksi pemusatan latihan atlet (Training Camp) untuk persiapan turnamen piala bergilir dan kejuaraan terbuka tingkat provinsi.

### Persyaratan Peserta:
- Anggota aktif PAMUR minimal tingkatan Sabuk Kuning
- Usia 15 - 24 tahun (Kategori Remaja & Dewasa)
- Membawa surat rekomendasi dari Pelatih Ranting
- Sehat jasmani dan rohani

Pendaftaran dapat dilakukan langsung melalui portal resmi PAMUR dengan memilih jadwal khusus "Pemusatan Latihan Atlet".`,
    imageUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&auto=format&fit=crop&q=80',
    category: 'Pengumuman Resmi',
    author: 'Sekretariat PAMUR',
    createdAt: '2026-08-17',
    views: 184,
    status: 'published',
    tags: ['Pengumuman', 'Seleksi Atlet', 'Training Camp']
  }
];

export const INITIAL_SCHEDULES: TrainingSchedule[] = [
  {
    id: 'sch_01',
    title: 'Latihan Reguler Teknik Dasar & Fisik Rasio',
    day: 'Sabtu',
    date: '2026-08-22',
    timeStart: '15:30',
    timeEnd: '17:45',
    location: 'Padepokan PAMUR Cabang Gresik, Jl. Dr. Wahidin No. 112',
    branch: 'Ranting Kebomas (Pusat Cabang)',
    coach: 'Dewan Guru Bambang Sutrisno & Pelatih Ridwan',
    targetBelt: 'Semua Tingkatan (Dasar - Merah)',
    category: 'Latihan Reguler',
    maxQuota: 35,
    currentEnrolled: 22,
    status: 'buka',
    requirements: 'Seragam Silat PAMUR lengkap + Sabuk + Air Minum',
    description: 'Fokus pada penguatan kuda-kuda, pukulan lurus, tendangan sabit, dan kombinasi tangkisan dasar rasio.'
  },
  {
    id: 'sch_02',
    title: 'Sesi Khusus Drill Tanding & Sambut Bebas Prestasi',
    day: 'Minggu',
    date: '2026-08-23',
    timeStart: '08:00',
    timeEnd: '10:30',
    location: 'GOR Tridharma Petrokimia Gresik, Jl. Ahmad Yani',
    branch: 'Ranting Gresik Kota',
    coach: 'Pelatih Hendra Kusuma (Pelatih Prestasi Pengcab)',
    targetBelt: 'Sabuk Kuning ke Atas',
    category: 'Tanding / Prestasi',
    maxQuota: 25,
    currentEnrolled: 18,
    status: 'buka',
    requirements: 'Wajib membawa Body Protector, Gumshield, dan Shin Guard pribadi.',
    description: 'Simulasi pertandingan peraturan IPSI terbaru, latihan counter attack, dan bantingan kecepatan tinggi.'
  },
  {
    id: 'sch_03',
    title: 'Pendalaman Jurus Seni Tunggal & Ganda PAMUR',
    day: 'Selasa',
    date: '2026-08-25',
    timeStart: '19:00',
    timeEnd: '21:00',
    location: 'Sasana Silat Ranting Manyar, Jl. Raya Manyar No. 45',
    branch: 'Ranting Manyar',
    coach: 'Pelatih Achmad Zaini',
    targetBelt: 'Sabuk Hijau, Biru & Merah',
    category: 'Seni & Kembangan',
    maxQuota: 20,
    currentEnrolled: 11,
    status: 'buka',
    requirements: 'Seragam hitam PAMUR, kain samping, dan golok latih kayu.',
    description: 'Pematangan irama, penjiwaan gerak kembangan khas PAMUR, serta ketepatan sinkronisasi ganda.'
  },
  {
    id: 'sch_04',
    title: 'Latihan Gabungan & Pemantapan UKT Se-Kabupaten Gresik',
    day: 'Minggu',
    date: '2026-08-30',
    timeStart: '07:00',
    timeEnd: '12:00',
    location: 'Padepokan PAMUR Cabang Gresik, Jl. Dr. Wahidin No. 112',
    branch: 'Pengcab PAMUR Gresik',
    coach: 'Tim Penguji Dewan Pendekar PAMUR Gresik',
    targetBelt: 'Calon Peserta Ujian (Semua Sabuk)',
    category: 'Ujian Kenaikan Tingkat (UKT)',
    maxQuota: 60,
    currentEnrolled: 44,
    status: 'buka',
    requirements: 'Buku saku anggota, Kartu Tanda Anggota (KTA), dan perlengkapan ujian lengkap.',
    description: 'Evaluasi kesiapan fisik, materi jurus tangan kosong, senjata, dan wawasan keorganisasian rasio.'
  },
  {
    id: 'sch_05',
    title: 'Latihan Kebugaran & Self-Defense Praktis Pelajar & Umum',
    day: 'Kamis',
    date: '2026-08-27',
    timeStart: '19:30',
    timeEnd: '21:00',
    location: 'Sasana Ranting Menganti, Jl. Raya Menganti No. 88',
    branch: 'Ranting Menganti',
    coach: 'Pelatih Donny Andika',
    targetBelt: 'Semua Tingkatan & Pemula',
    category: 'Latihan Reguler',
    maxQuota: 25,
    currentEnrolled: 14,
    status: 'buka',
    requirements: 'Pakaian olahraga / seragam silat PAMUR.',
    description: 'Teknik melepaskan diri dari cengkeraman, kuncian sendi, dan peningkatan refleks bela diri praktis.'
  }
];

export const INITIAL_REGISTRATIONS: TrainingRegistration[] = [];

export const BELT_RANKS: BeltInfo[] = [
  {
    id: 'belt_dasar',
    order: 1,
    level: 'Dasar',
    colorHex: '#94a3b8',
    bgColor: 'bg-slate-200',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-400',
    meaning: 'Pengenalan adab persilatan, pembentukan kedisiplinan mental, dan pemahaman gerak dasar beladiri.',
    stage: 'Tingkat Pra-Dasar / Calon Pesilat (Pengenalan Gerak, Sikap & Fisik Awal)'
  },
  {
    id: 'belt_putih',
    order: 2,
    level: 'Putih',
    colorHex: '#f8fafc',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    meaning: 'Kesucian hati, keterbukaan pikiran menerima ilmu dasar, dan ketulusan niat.',
    stage: 'Tingkat Dasar I (Pengenalan Kuda-kuda & Sikap Pasang)'
  },
  {
    id: 'belt_kuning',
    order: 3,
    level: 'Kuning',
    colorHex: '#eab308',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-400',
    meaning: 'Fajar semangat, penerangan akal rasio, dan ketekunan mempelajari jurus kombinasi.',
    stage: 'Tingkat Dasar II (Pukulan, Tendangan & Elakan Rasio)'
  },
  {
    id: 'belt_hijau',
    order: 4,
    level: 'Hijau',
    colorHex: '#22c55e',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-400',
    meaning: 'Kesuburan ilmu, ketenangan batin, dan kecekatan dalam aplikasi sambut beladiri.',
    stage: 'Tingkat Menengah I (Bantingan, Kuncian & Sambut Berpasangan)'
  },
  {
    id: 'belt_biru',
    order: 5,
    level: 'Biru',
    colorHex: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-400',
    meaning: 'Keluasan wawasan bak samudera, kematangan emosi, dan keteguhan pendirian.',
    stage: 'Tingkat Menengah II (Jurus Senjata Tradisional & Tanding Prestasi)'
  },
  {
    id: 'belt_merah',
    order: 6,
    level: 'Merah',
    colorHex: '#dc2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-900',
    borderColor: 'border-red-500',
    meaning: 'Keberanian kesatria, kematangan rasio bela diri, penguasaan taktik tingkat lanjut, dan peran asisten pelatih.',
    stage: 'Tingkat Madya / Calon Pendekar (Metodologi Kepelatihan, Taktik Tinggi & Asas Rasio)'
  },
  {
    id: 'belt_hitam',
    order: 7,
    level: 'Hitam (Pendekar)',
    colorHex: '#0f172a',
    bgColor: 'bg-slate-900',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    meaning: 'Kematangan paripurna, ketajaman rasio batiniah, kebijaksanaan, dan dedikasi perguruan.',
    stage: 'Tingkat Pendekar / Dewan Guru (Mastery & Pembinaan Ranting)'
  }
];

export const BRANCHES_LIST: BranchInfo[] = [
  {
    id: 'br_01',
    name: 'Ranting Kebomas (Padepokan Cabang)',
    city: 'Gresik',
    address: 'Padepokan PAMUR Gresik, Jl. Dr. Wahidin Sudirohusodo No. 112, Kebomas',
    headCoach: 'Dewan Guru Bambang Sutrisno',
    contact: '0812-3456-7890',
    memberCount: 145
  },
  {
    id: 'br_02',
    name: 'Ranting Gresik Kota',
    city: 'Gresik',
    address: 'Kompleks Olahraga Petrokimia, Jl. Ahmad Yani No. 1, Gresik',
    headCoach: 'Pelatih Hendra Kusuma',
    contact: '0857-1122-3344',
    memberCount: 98
  },
  {
    id: 'br_03',
    name: 'Ranting Manyar',
    city: 'Gresik',
    address: 'Sasana Warga Manyar, Jl. Raya Manyar No. 45, Manyar',
    headCoach: 'Pelatih Achmad Zaini',
    contact: '0813-8899-0011',
    memberCount: 82
  },
  {
    id: 'br_04',
    name: 'Ranting Menganti',
    city: 'Gresik',
    address: 'Balai Latihan Menganti, Jl. Raya Menganti Krajan No. 88',
    headCoach: 'Pelatih Agus Setiawan',
    contact: '0878-5544-3322',
    memberCount: 75
  },
  {
    id: 'br_05',
    name: 'Ranting Driyorejo',
    city: 'Gresik',
    address: 'Gedung Serbaguna Petiken, Jl. Raya Driyorejo No. 20',
    headCoach: 'Pelatih Donny Andika',
    contact: '0896-1234-5678',
    memberCount: 68
  },
  {
    id: 'br_06',
    name: 'Ranting Cerme',
    city: 'Gresik',
    address: 'Sasana Pemuda Cerme Kidul, Jl. Raya Cerme No. 15',
    headCoach: 'Pelatih M. Syaifullah',
    contact: '0812-9988-7766',
    memberCount: 54
  },
  {
    id: 'br_07',
    name: 'Ranting Bungah & Sidayu',
    city: 'Gresik',
    address: 'Lapangan Olahraga Bungah, Jl. Raya Deandles No. 70',
    headCoach: 'Pelatih Choirul Anam',
    contact: '0858-3344-5566',
    memberCount: 60
  }
];
