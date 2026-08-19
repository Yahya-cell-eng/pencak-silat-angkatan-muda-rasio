import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BELT_RANKS, BRANCHES_LIST } from '../data/initialData';
import { 
  Shield, 
  Calendar, 
  BookOpen, 
  Award, 
  ArrowRight, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Flame,
  Zap,
  Target
} from 'lucide-react';

interface HomeViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  const { schedules, articles } = useData();
  const { isAuthenticated, currentUser } = useAuth();

  const upcomingSchedules = schedules.slice(0, 3);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 border border-slate-800 shadow-md p-6 sm:p-10 lg:p-12 text-white">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-red-200 text-xs font-semibold backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Pencak Silat Angkatan Muda Rasio &bull; PAMUR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-serif leading-tight">
              Kekuatan Fisik, <br />
              <span className="text-red-400">
                Ketajaman Rasio
              </span> & Budi Pekerti Luhur.
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
              Perguruan Pencak Silat PAMUR memadukan tradisi bela diri warisan leluhur Nusantara dengan prinsip rasionalitas gerak ilmiah, ketangkasan tanding sportif, dan pembinaan integritas karakter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                id="hero-schedules-cta"
                onClick={() => onNavigateTab('schedules')}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs sm:text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Daftar Latihan Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isAuthenticated ? (
                <button
                  id="hero-register-cta"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <Users className="w-4 h-4 text-red-700" />
                  <span>Daftar Anggota Baru</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>KTA Digital ({currentUser?.name})</span>
                </button>
              )}

              <button
                onClick={() => onNavigateTab('articles')}
                className="px-3 py-2 text-xs text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Baca Warta &rarr;
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/10 text-center lg:text-left">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-serif">1951</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tahun Berdiri</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-serif">5+ Ranting</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cabang Aktif</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-emerald-400 font-serif">6 Tingkat</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Jenjang Sabuk</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950/60 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80"
                alt="Pesilat PAMUR"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Floating Badge in Image */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 text-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Filosofi Gerak Rasio
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">EST. 1951</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  "Setiap serangan dan elakan bertumpu pada hukum mekanika gerak, momentum tepat, dan ketenangan jiwa."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* JADWAL LATIHAN & PENDAFTARAN ONLINE (Highlight) */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Sesi Latihan Mendatang
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Jadwal Latihan & Pendaftaran Online
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('schedules')}
            className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Jadwal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingSchedules.map((schedule) => {
            const isFull = schedule.currentEnrolled >= schedule.maxQuota;
            return (
              <div
                key={schedule.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                      {schedule.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {schedule.day}, {schedule.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {schedule.title}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{schedule.timeStart} - {schedule.timeEnd} WIB</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{schedule.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quota Stats Box */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Sisa Kuota</p>
                      <p className="text-sm font-black text-slate-900">
                        {schedule.maxQuota - schedule.currentEnrolled}
                      </p>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <p className="text-[9px] text-emerald-700 uppercase font-bold">Terdaftar</p>
                      <p className="text-sm font-black text-emerald-900">{schedule.currentEnrolled}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('schedules')}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-red-700 text-white hover:bg-red-800 shadow-xs'
                    }`}
                  >
                    <span>Daftar Sesi Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* ARTIKEL & WARTA SILAT TERBARU */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Publikasi & Liputan
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Artikel & Berita Terbaru
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('articles')}
            className="text-xs font-bold text-red-700 hover:underline"
          >
            Lihat Semua Artikel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigateTab('articles')}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-36 bg-slate-200 relative overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute bottom-2.5 left-2.5 text-white text-[10px] font-bold uppercase bg-red-700 px-2 py-0.5 rounded shadow-xs">
                  {article.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                  <span>{article.createdAt}</span>
                  <span className="font-bold text-slate-700">Oleh {article.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* TINGKATAN SABUK (Curriculum Grid) */}
      {/* ======================================================== */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Kurikulum Keilmuan
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Jenjang Sabuk & Filosofi PAMUR
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('belts')}
            className="text-xs font-bold text-red-700 hover:underline"
          >
            Panduan Lengkap UKT &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BELT_RANKS.map((belt, idx) => (
            <div
              key={belt.level}
              className="bg-slate-50 border border-slate-200 hover:border-red-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 transition-colors text-center"
            >
              <div>
                <div 
                  className="w-9 h-9 rounded-lg mx-auto flex items-center justify-center font-bold text-xs shadow-xs border mb-2"
                  style={{ backgroundColor: belt.colorHex, color: belt.level === 'Putih' ? '#0f172a' : '#ffffff', borderColor: '#cbd5e1' }}
                >
                  {idx + 1}
                </div>
                <div className="font-bold text-slate-900 text-xs">
                  Sabuk {belt.level}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                {belt.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* EMPAT NILAI KARAKTER PESILAT */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Empat Karakter Kehormatan PAMUR
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Asas Rasionalitas</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Setiap gerakan dapat dipertanggungjawabkan secara logis, anatomis, dan taktis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Budi Pekerti Luhur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kekuatan beladiri hanya digunakan untuk membela kebenaran dan melindungi sesama.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Persaudaraan Sejati</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saling mendukung antar ranting, memupuk persatuan tanpa membedakan latar belakang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Disiplin & Prestasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mengejar keunggulan tanding sportif di kejuaraan daerah, nasional, dan internasional.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* CALL TO ACTION CARD */}
      {/* ======================================================== */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-slate-900">
            Bergabung dengan Perguruan PAMUR Sekarang
          </h2>
          <p className="text-xs text-slate-500">
            Daftarkan diri Anda untuk mengikuti sesi latihan di ranting terdekat atau masuk ke portal anggota.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenAuth('register')}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
          >
            Daftar Anggota
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs border border-slate-200 transition-colors"
          >
            Masuk Akun
          </button>
        </div>
      </section>
    </div>
  );
};
