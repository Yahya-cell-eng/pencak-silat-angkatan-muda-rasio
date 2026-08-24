import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
  Target,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Compass
} from 'lucide-react';
import { openWhatsAppChat } from './WhatsAppContact';

interface HomeViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  const { schedules, articles, config, beltRanks, branches } = useData();
  const { isAuthenticated, currentUser } = useAuth();

  const upcomingSchedules = schedules.slice(0, 3);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-10 pb-16">
      {/* ======================================================== */}
      {/* 1. ULTRA-MODERN HERO SECTION                             */}
      {/* ======================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-zinc-900 to-red-950 border border-slate-800/80 shadow-xl p-6 sm:p-10 lg:p-12 text-white">
        {/* Modern Ambient Mesh Glow Backgrounds */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-bl from-red-600/20 via-red-800/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-950/40 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Shimmering Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-red-200 text-xs font-semibold backdrop-blur-md shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>{config.heroBadgeText || 'Pencak Silat Angkatan Muda Rasio • PAMUR'}</span>
            </div>

            {/* Display Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-serif leading-[1.15]">
              {config.heroTitle ? (
                config.heroHighlightText && config.heroTitle.includes(config.heroHighlightText) ? (
                  <>
                    {config.heroTitle.split(config.heroHighlightText)[0]}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-amber-200">
                      {config.heroHighlightText}
                    </span>
                    {config.heroTitle.split(config.heroHighlightText)[1]}
                  </>
                ) : (
                  config.heroTitle
                )
              ) : (
                <>
                  Kekuatan Fisik, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-amber-200">
                    Ketajaman Rasio
                  </span> & Budi Pekerti Luhur.
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              {config.heroSubtitle || config.description || 'Perguruan Pencak Silat PAMUR memadukan tradisi bela diri warisan leluhur Nusantara dengan prinsip rasionalitas gerak ilmiah, ketangkasan tanding sportif, dan pembinaan integritas karakter.'}
            </p>

            {/* Call to Actions (CTAs) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-schedules-cta"
                onClick={() => onNavigateTab('schedules')}
                className="px-5 py-3 bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all text-xs sm:text-sm flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4 text-red-200" />
                <span>Daftar Latihan Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {!isAuthenticated ? (
                <button
                  id="hero-register-cta"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-3 bg-white/95 hover:bg-white text-slate-900 font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <Users className="w-4 h-4 text-red-700" />
                  <span>Daftar Anggota Baru</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="px-5 py-3 bg-white/95 hover:bg-white text-slate-900 font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>KTA Digital ({currentUser?.name})</span>
                </button>
              )}

              <button
                onClick={() => openWhatsAppChat(
                  config.phone || config.contactPhone || '0812-3456-7890', 
                  `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin konsultasi pendaftaran & latihan PAMUR Gresik.`
                )}
                className="px-4 py-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all border border-emerald-500/40 shadow-sm cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>WhatsApp Admin</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-center lg:text-left">
              <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
                  {config.heroEstablishedYear || '1951'}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Tahun Berdiri</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
                  {branches.length > 0 ? `${branches.length}+ Ranting` : '5+ Ranting'}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Cabang Gresik</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-serif tracking-tight">
                  {beltRanks.length} Sabuk
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Jenjang UKT</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Card (Right Column) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80"
                alt="Pesilat PAMUR"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Floating Quote Badge in Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 text-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    Filosofi Gerak Rasio
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    EST. {config.heroEstablishedYear || '1951'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {config.heroQuoteText || '"Setiap serangan dan elakan bertumpu pada hukum mekanika gerak, momentum tepat, dan ketenangan jiwa."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. JADWAL LATIHAN & PENDAFTARAN ONLINE (Interactive Cards) */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60 mb-1">
              <Clock className="w-3 h-3" />
              Sesi Latihan Terdekat
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-serif">
              Jadwal Latihan & Tiket Online
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('schedules')}
            className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>Semua Jadwal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingSchedules.map((schedule) => {
            const isFull = schedule.currentEnrolled >= schedule.maxQuota;
            const quotaPercent = Math.min(100, Math.round((schedule.currentEnrolled / schedule.maxQuota) * 100));

            return (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-red-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-100/80">
                      {schedule.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100">
                      {schedule.day}, {schedule.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-red-700 transition-colors">
                    {schedule.title}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{schedule.timeStart} - {schedule.timeEnd} WIB</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{schedule.location}</span>
                    </div>
                  </div>

                  {/* Quota Progress Indicator */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-semibold">
                      <span className="text-slate-500">Kapasitas Sesi</span>
                      <span className={isFull ? 'text-red-700 font-bold' : 'text-slate-700'}>
                        {schedule.currentEnrolled} / {schedule.maxQuota} Peserta ({quotaPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? 'bg-red-600' : quotaPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${quotaPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab('schedules')}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-red-700 hover:bg-red-800 text-white shadow-red-700/20'
                    }`}
                  >
                    <span>{isFull ? 'Kuota Penuh' : 'Daftar Sesi Latihan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ARTIKEL & WARTA TERBARU                               */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60 mb-1">
              <BookOpen className="w-3 h-3" />
              Khazanah & Warta
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-serif">
              Artikel & Warta Silat Terbaru
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('articles')}
            className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>Semua Artikel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigateTab('articles')}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-red-200"
            >
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase bg-red-700 px-2.5 py-0.5 rounded-md shadow-sm">
                  {article.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-1.5">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                  <span>{article.createdAt}</span>
                  <span className="font-bold text-slate-700">Oleh {article.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. TINGKATAN SABUK (Curriculum Preview)                    */}
      {/* ======================================================== */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60 mb-1">
              <Award className="w-3 h-3" />
              Kurikulum Silat
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Jenjang Sabuk & Filosofi Rasio
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('belts')}
            className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>Panduan Lengkap UKT</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
          {beltRanks.map((belt, idx) => (
            <div
              key={belt.id || belt.level}
              className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-red-300 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all text-center hover:shadow-xs group cursor-pointer"
              onClick={() => onNavigateTab('belts')}
            >
              <div>
                <div 
                  className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-bold text-xs shadow-2xs border mb-2.5 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: belt.colorHex, color: belt.textColor?.includes('slate-800') || belt.colorHex === '#f8fafc' ? '#0f172a' : '#ffffff', borderColor: '#cbd5e1' }}
                >
                  {belt.order || idx + 1}
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-red-700 transition-colors">
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
      {/* 5. EMPAT PILAR KEHORMATAN                                 */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60 mb-1">
            <Shield className="w-3 h-3" />
            Trilogi Etika
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Empat Karakter Kehormatan PAMUR
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 hover:shadow-xs transition-all">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm border border-red-100">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Asas Rasionalitas</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Setiap gerakan dapat dipertanggungjawabkan secara logis, anatomis, dan taktis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 hover:shadow-xs transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-100">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Budi Pekerti Luhur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kekuatan beladiri hanya digunakan untuk membela kebenaran dan melindungi sesama.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 hover:shadow-xs transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Persaudaraan Sejati</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saling mendukung antar ranting, memupuk persatuan tanpa membedakan latar belakang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 hover:shadow-xs transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-100">
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
      {/* 6. CALL TO ACTION BANNER                                  */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1.5 text-center sm:text-left relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Bergabung dengan Perguruan PAMUR
          </h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Daftarkan diri Anda untuk mengikuti sesi latihan di ranting terdekat di Kabupaten Gresik atau masuk ke portal pesilat.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin menanyakan informasi pendaftaran anggota silat PAMUR.`)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Admin</span>
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              Daftar Anggota Baru
            </button>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20 transition-all cursor-pointer active:scale-95"
            >
              Masuk Akun
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
