import { User, Article, TrainingSchedule, TrainingRegistration, BeltInfo, BranchInfo } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Dewan Guru Bambang Sutrisno',
    email: 'admin@pamur.id',
    password: 'admin123',
    role: 'admin',
    memberId: 'PMR-1998-0001',
    phone: '0812-3456-7890',
    branch: 'Ranting Pusat (Surabaya)',
    beltRank: 'Hitam (Pendekar)',
    joinDate: '1998-05-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0811-2233-4455 (Ibu Ratna)',
    bio: 'Ketua Dewan Pelatih Perguruan Pencak Silat PAMUR Pusat. Pelatih Nasional Tingkat Utama.'
  },
  {
    id: 'usr_member_01',
    name: 'Budi Santoso',
    email: 'budi@pamur.id',
    password: 'user123',
    role: 'anggota',
    memberId: 'PMR-2023-0142',
    phone: '0857-1122-3344',
    branch: 'Ranting Surabaya Timur',
    beltRank: 'Hijau',
    joinDate: '2023-02-10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0857-9988-7766 (Pak Joko)',
    bio: 'Atlet Tanding Kelas C Dewasa PAMUR Cabang Surabaya. Mengikuti kejuaraan daerah.'
  },
  {
    id: 'usr_member_02',
    name: 'Siti Rahmawati',
    email: 'siti@pamur.id',
    password: 'user123',
    role: 'anggota',
    memberId: 'PMR-2024-0088',
    phone: '0813-8899-0011',
    branch: 'Ranting Pamekasan (Madura)',
    beltRank: 'Kuning',
    joinDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0813-7766-5544 (Ibu Aminah)',
    bio: 'Pesilat kategori Seni Tunggal Putri. Bersemangat memperdalam jurus dasar rasio PAMUR.'
  },
  {
    id: 'usr_member_03',
    name: 'Ahmad Fauzi',
    email: 'fauzi@pamur.id',
    password: 'user123',
    role: 'anggota',
    memberId: 'PMR-2022-0310',
    phone: '0878-5544-3322',
    branch: 'Ranting Malang Kota',
    beltRank: 'Biru',
    joinDate: '2022-08-20',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0878-1122-4455 (Kakak)',
    bio: 'Anggota senior ranting Malang, asisten pelatih sabuk dasar.'
  },
  {
    id: 'usr_member_04',
    name: 'Reza Pratama',
    email: 'reza@pamur.id',
    password: 'user123',
    role: 'anggota',
    memberId: 'PMR-2024-0215',
    phone: '0896-1234-5678',
    branch: 'Ranting Jakarta Selatan',
    beltRank: 'Putih',
    joinDate: '2024-06-01',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    emergencyContact: '0896-8765-4321 (Orang Tua)',
    bio: 'Anggota baru sabuk putih, berlatih untuk kebugaran dan bela diri praktis.'
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
    title: 'Latihan Reguler Teknik Dasar & Fisik',
    day: 'Sabtu',
    date: '2026-08-22',
    timeStart: '15:30',
    timeEnd: '17:45',
    location: 'Padepokan Silat PAMUR Pusat, Jl. Kertajaya Indah No. 45',
    branch: 'Ranting Pusat (Surabaya)',
    coach: 'Dewan Guru Bambang Sutrisno & Pelatih Ridwan',
    targetBelt: 'Semua Tingkatan (Putih - Cokelat)',
    category: 'Latihan Reguler',
    maxQuota: 35,
    currentEnrolled: 22,
    status: 'buka',
    requirements: 'Seragam Silat PAMUR lengkap + Sabuk + Air Minum',
    description: 'Fokus pada penguatan kuda-kuda, pukulan lurus, tendangan sabit, dan kombinasi tangkisan dasar.'
  },
  {
    id: 'sch_02',
    title: 'Sesi Khusus Drill Tanding & Sambut Bebas',
    day: 'Minggu',
    date: '2026-08-23',
    timeStart: '08:00',
    timeEnd: '10:30',
    location: 'Gelanggang Remaja Ranting Surabaya Timur, Jl. Dharmahusada',
    branch: 'Ranting Surabaya Timur',
    coach: 'Pelatih Hendra Kusuma (Mantan Atlet PON)',
    targetBelt: 'Sabuk Kuning ke Atas',
    category: 'Tanding / Prestasi',
    maxQuota: 25,
    currentEnrolled: 18,
    status: 'buka',
    requirements: 'Wajib membawa Body Protector, Gumshield, dan Shin Guard pribadi.',
    description: 'Simulasi pertandingan dengan peraturan IPSI terbaru, latihan counter attack, dan bantingan.'
  },
  {
    id: 'sch_03',
    title: 'Pendalaman Jurus Seni Tunggal & Ganda PAMUR',
    day: 'Selasa',
    date: '2026-08-25',
    timeStart: '19:00',
    timeEnd: '21:00',
    location: 'Sasana Warga Madura, Jl. Trunojoyo No. 12',
    branch: 'Ranting Pamekasan (Madura)',
    coach: 'Pelatih Achmad Zaini',
    targetBelt: 'Sabuk Hijau, Biru & Cokelat',
    category: 'Seni & Kembangan',
    maxQuota: 20,
    currentEnrolled: 11,
    status: 'buka',
    requirements: 'Seragam hitam PAMUR, kain samping, dan golok latih kayu.',
    description: 'Pematangan irama, penjiwaan gerak kembangan khas PAMUR, serta ketepatan sinkronisasi ganda.'
  },
  {
    id: 'sch_04',
    title: 'Latihan Gabungan & Pemantapan UKT Periode III',
    day: 'Minggu',
    date: '2026-08-30',
    timeStart: '07:00',
    timeEnd: '12:00',
    location: 'Kompleks Olahraga Ranting Malang, Jl. Ijen No. 8',
    branch: 'Ranting Malang Kota',
    coach: 'Tim Penguji Dewan Pendekar PAMUR',
    targetBelt: 'Calon Peserta Ujian (Semua Sabuk)',
    category: 'Ujian Kenaikan Tingkat (UKT)',
    maxQuota: 50,
    currentEnrolled: 44,
    status: 'buka',
    requirements: 'Buku saku anggota, Kartu Tanda Anggota (KTA), dan perlengkapan ujian.',
    description: 'Evaluasi kesiapan fisik, materi jurus tangan kosong, senjata, dan wawasan keorganisasian.'
  },
  {
    id: 'sch_05',
    title: 'Latihan Kebugaran & Self-Defense Praktis',
    day: 'Kamis',
    date: '2026-08-27',
    timeStart: '19:30',
    timeEnd: '21:00',
    location: 'GOR Cilandak, Jl. TB Simatupang',
    branch: 'Ranting Jakarta Selatan',
    coach: 'Pelatih Donny Andika',
    targetBelt: 'Semua Tingkatan & Pemula',
    category: 'Latihan Reguler',
    maxQuota: 20,
    currentEnrolled: 9,
    status: 'buka',
    requirements: 'Pakaian olahraga / seragam silat PAMUR.',
    description: 'Teknik melepaskan diri dari cengkeraman, kuncian sendi, dan peningkatan refleks bela diri perkotaan.'
  }
];

export const INITIAL_REGISTRATIONS: TrainingRegistration[] = [
  {
    id: 'reg_01',
    scheduleId: 'sch_01',
    scheduleTitle: 'Latihan Reguler Teknik Dasar & Fisik',
    scheduleDate: '2026-08-22',
    scheduleTime: '15:30 - 17:45',
    location: 'Padepokan Silat PAMUR Pusat, Jl. Kertajaya Indah No. 45',
    branch: 'Ranting Pusat (Surabaya)',
    userId: 'usr_member_01',
    userName: 'Budi Santoso',
    userMemberId: 'PMR-2023-0142',
    userBelt: 'Hijau',
    userPhone: '0857-1122-3344',
    registeredAt: '2026-08-16 10:15',
    status: 'Terkonfirmasi',
    ticketCode: 'PMR-REG-9012',
    notes: 'Siap hadir tepat waktu dan membawa perlengkapan lengkap.'
  },
  {
    id: 'reg_02',
    scheduleId: 'sch_03',
    scheduleTitle: 'Pendalaman Jurus Seni Tunggal & Ganda PAMUR',
    scheduleDate: '2026-08-25',
    scheduleTime: '19:00 - 21:00',
    location: 'Sasana Warga Madura, Jl. Trunojoyo No. 12',
    branch: 'Ranting Pamekasan (Madura)',
    userId: 'usr_member_02',
    userName: 'Siti Rahmawati',
    userMemberId: 'PMR-2024-0088',
    userBelt: 'Kuning',
    userPhone: '0813-8899-0011',
    registeredAt: '2026-08-17 14:20',
    status: 'Terkonfirmasi',
    ticketCode: 'PMR-REG-9013',
    notes: 'Mengikuti pemantapan seni tunggal putri.'
  }
];

export const BELT_RANKS: BeltInfo[] = [
  {
    level: 'Putih',
    colorHex: '#f8fafc',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    meaning: 'Kesucian hati, keterbukaan pikiran menerima ilmu dasar, dan ketulusan niat.',
    stage: 'Tingkat Dasar I (Pengenalan Kuda-kuda & Sikap Pasang)'
  },
  {
    level: 'Kuning',
    colorHex: '#eab308',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-400',
    meaning: 'Fajar semangat, penerangan akal rasio, dan ketekunan mempelajari jurus kombinasi.',
    stage: 'Tingkat Dasar II (Pukulan, Tendangan & Elakan Rasio)'
  },
  {
    level: 'Hijau',
    colorHex: '#22c55e',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-400',
    meaning: 'Kesuburan ilmu, ketenangan batin, dan kecekatan dalam aplikasi sambut beladiri.',
    stage: 'Tingkat Menengah I (Bantingan, Kuncian & Sambut Berpasangan)'
  },
  {
    level: 'Biru',
    colorHex: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-400',
    meaning: 'Keluasan wawasan bak samudera, kematangan emosi, dan keteguhan pendirian.',
    stage: 'Tingkat Menengah II (Jurus Senjata Tradisional & Tanding Prestasi)'
  },
  {
    level: 'Cokelat',
    colorHex: '#78350f',
    bgColor: 'bg-amber-900/10',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-800',
    meaning: 'Kerendahan hati seperti bumi yang membumi, penguasaan rasa dan asisten pelatih.',
    stage: 'Tingkat Madya / Calon Pendekar (Metodologi Kepelatihan & Asas Rasio)'
  },
  {
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
    name: 'Ranting Pusat (Surabaya)',
    city: 'Surabaya',
    address: 'Padepokan PAMUR Pusat, Jl. Kertajaya Indah No. 45',
    headCoach: 'Dewan Guru Bambang Sutrisno',
    contact: '0812-3456-7890',
    memberCount: 145
  },
  {
    id: 'br_02',
    name: 'Ranting Surabaya Timur',
    city: 'Surabaya',
    address: 'Gelanggang Remaja Dharmahusada No. 88',
    headCoach: 'Pelatih Hendra Kusuma',
    contact: '0857-1122-3344',
    memberCount: 88
  },
  {
    id: 'br_03',
    name: 'Ranting Pamekasan (Madura)',
    city: 'Pamekasan',
    address: 'Sasana Warga Madura, Jl. Trunojoyo No. 12',
    headCoach: 'Pelatih Achmad Zaini',
    contact: '0813-8899-0011',
    memberCount: 120
  },
  {
    id: 'br_04',
    name: 'Ranting Malang Kota',
    city: 'Malang',
    address: 'Kompleks Olahraga Ranting Malang, Jl. Ijen No. 8',
    headCoach: 'Pelatih Agus Setiawan',
    contact: '0878-5544-3322',
    memberCount: 75
  },
  {
    id: 'br_05',
    name: 'Ranting Jakarta Selatan',
    city: 'Jakarta',
    address: 'GOR Cilandak, Jl. TB Simatupang No. 20',
    headCoach: 'Pelatih Donny Andika',
    contact: '0896-1234-5678',
    memberCount: 62
  }
];
