-- ==============================================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI WEB PAMUR
-- (Perguruan Pencak Silat Angkatan Muda Rasio)
-- ==============================================================================
-- Jalankan query SQL ini di Supabase SQL Editor untuk menyiapkan semua tabel.

-- 1. TABEL PENGGUNA & ANGGOTA (users)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'anggota', -- 'admin' | 'anggota' | 'pelatih'
  belt_rank TEXT NOT NULL DEFAULT 'Putih',
  member_id TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  branch TEXT NOT NULL,
  join_date TEXT NOT NULL,
  avatar TEXT,
  emergency_contact TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL ARTIKEL & BERITA (articles)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  likes INT DEFAULT 0
);

-- 3. TABEL JADWAL LATIHAN (training_schedules)
CREATE TABLE IF NOT EXISTS public.training_schedules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  branch TEXT NOT NULL,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  location TEXT NOT NULL,
  coach TEXT NOT NULL,
  category TEXT NOT NULL,
  target_belts TEXT[] DEFAULT '{}',
  max_quota INT NOT NULL DEFAULT 30,
  current_enrolled INT NOT NULL DEFAULT 0,
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'open' -- 'open' | 'full' | 'completed' | 'cancelled'
);

-- 4. TABEL PENDAFTARAN LATIHAN ONLINE & E-TIKET (training_registrations)
CREATE TABLE IF NOT EXISTS public.training_registrations (
  id TEXT PRIMARY KEY,
  schedule_id TEXT NOT NULL REFERENCES public.training_schedules(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_member_id TEXT NOT NULL,
  user_belt TEXT NOT NULL,
  schedule_title TEXT NOT NULL,
  schedule_date TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  branch TEXT NOT NULL,
  location TEXT NOT NULL,
  registered_at TEXT NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Terkonfirmasi', -- 'Terkonfirmasi' | 'Hadir' | 'Batal'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN AKSES (POLICIES) UNTUK ANON/PUBLIC
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update articles" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete articles" ON public.articles FOR DELETE USING (true);

CREATE POLICY "Allow public read schedules" ON public.training_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert schedules" ON public.training_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update schedules" ON public.training_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete schedules" ON public.training_schedules FOR DELETE USING (true);

CREATE POLICY "Allow public read registrations" ON public.training_registrations FOR SELECT USING (true);
CREATE POLICY "Allow public insert registrations" ON public.training_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update registrations" ON public.training_registrations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete registrations" ON public.training_registrations FOR DELETE USING (true);

-- DATA AWAL AKUN ADMIN & ANGGOTA
INSERT INTO public.users (id, name, email, role, belt_rank, member_id, phone, branch, join_date, password, avatar)
VALUES 
  ('u1', 'Guru Besar & Dewan Pendekar PAMUR', 'admin@pamur.id', 'admin', 'Hitam (Pendekar)', 'PMR-ADMIN-001', '0812-3456-7890', 'Padepokan Pusat Surabaya', '2015-01-15', 'admin123', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
  ('u2', 'Budi Santoso', 'budi@pamur.id', 'anggota', 'Hijau', 'PMR-2023-0142', '0813-9876-5432', 'Ranting Banyuwangi Kota', '2023-03-10', 'user123', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
  ('u3', 'Siti Rahmawati', 'siti@pamur.id', 'anggota', 'Kuning', 'PMR-2024-0089', '0821-4567-8901', 'Ranting Jember Kampus', '2024-01-20', 'user123', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;
