import React, { useState } from 'react';
import { TrainingSchedule, TrainingRegistration } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TrainingRegistrationModal } from './TrainingRegistrationModal';
import { ETicketModal } from './ETicketModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Award, 
  CheckCircle2, 
  Search,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface SchedulesViewProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onRegisterClick?: (schedule: TrainingSchedule) => void;
  onViewTicketClick?: (ticket: TrainingRegistration) => void;
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({ 
  onOpenAuth, 
  onRegisterClick,
  onViewTicketClick 
}) => {
  const { schedules, branches: dynamicBranches, getUserRegistrations } = useData();
  const { currentUser } = useAuth();

  const [selectedBranch, setSelectedBranch] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedScheduleForReg, setSelectedScheduleForReg] = useState<TrainingSchedule | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<TrainingRegistration | null>(null);

  const categories = [
    'Semua',
    'Latihan Reguler',
    'Tanding / Prestasi',
    'Seni & Kembangan',
    'Ujian Kenaikan Tingkat (UKT)'
  ];

  const branches = ['Semua', ...dynamicBranches.map(b => b.name)];

  const userRegistrations = currentUser ? getUserRegistrations(currentUser.id) : [];

  const filteredSchedules = schedules.filter(schedule => {
    const matchesBranch = selectedBranch === 'Semua' || schedule.branch === selectedBranch;
    const matchesCategory = selectedCategory === 'Semua' || schedule.category === selectedCategory;
    const matchesSearch = 
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.coach.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesCategory && matchesSearch;
  });

  const handleStartRegister = (schedule: TrainingSchedule) => {
    if (onRegisterClick) {
      onRegisterClick(schedule);
    } else {
      setSelectedScheduleForReg(schedule);
    }
  };

  const handleRegistrationSuccess = (reg: TrainingRegistration) => {
    setSelectedScheduleForReg(null);
    if (onViewTicketClick) {
      onViewTicketClick(reg);
    } else {
      setGeneratedTicket(reg);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Pendaftaran Latihan & Sesi Terjadwal PAMUR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
            Jadwal Latihan Pencak Silat
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Daftarkan diri Anda secara online untuk mengikuti sesi latihan teknik dasar, drill tanding, seni kembangan, dan persiapan UKT di seluruh ranting.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <Info className="w-4 h-4 shrink-0 text-red-700" />
            <span>
              Anggota PAMUR dapat mendaftar langsung untuk mengamankan kuota dan mendapatkan e-tiket kehadiran resmi.
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="schedule-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul latihan, lokasi, pelatih..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
            />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              id="filter-schedule-branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
            >
              {branches.map(b => (
                <option key={b} value={b}>Ranting: {b}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              id="filter-schedule-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
            >
              {categories.map(c => (
                <option key={c} value={c}>Kategori: {c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Sesi Latihan Tersedia ({filteredSchedules.length})
          </h2>
          <span className="text-xs text-slate-500">
            Pilih sesi untuk mendaftar online
          </span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada jadwal yang sesuai filter</h3>
            <p className="text-xs text-slate-400 mt-1">Silakan ubah pilihan ranting atau kategori latihan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSchedules.map((schedule) => {
              const isEnrolled = userRegistrations.some(
                r => r.scheduleId === schedule.id && r.status !== 'Dibatalkan'
              );
              const isFull = schedule.currentEnrolled >= schedule.maxQuota;
              const quotaPercentage = Math.min(100, Math.round((schedule.currentEnrolled / schedule.maxQuota) * 100));

              return (
                <div
                  key={schedule.id}
                  id={`schedule-card-${schedule.id}`}
                  className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
                    isEnrolled
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                          {schedule.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {schedule.branch}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">
                        {schedule.title}
                      </h3>
                    </div>

                    {/* Status Pill */}
                    {isEnrolled ? (
                      <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Terdaftar
                      </span>
                    ) : isFull ? (
                      <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-500">
                        Penuh
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                        Buka
                      </span>
                    )}
                  </div>

                  {/* Schedule Details */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Hari / Tanggal:
                      </span>
                      <span className="font-bold text-slate-800">
                        {schedule.day}, {schedule.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Waktu:
                      </span>
                      <span className="font-bold text-slate-800">
                        {schedule.timeStart} - {schedule.timeEnd} WIB
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-red-700" />
                        Lokasi:
                      </span>
                      <span className="text-right text-slate-700 font-medium">
                        {schedule.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Pelatih:
                      </span>
                      <span className="font-bold text-red-700">
                        {schedule.coach}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        Peserta:
                      </span>
                      <span className="text-slate-700 font-semibold">
                        {schedule.targetBelt}
                      </span>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Kapasitas Peserta:
                      </span>
                      <span className="font-semibold text-slate-700">
                        {schedule.currentEnrolled} / {schedule.maxQuota} Orang ({schedule.maxQuota - schedule.currentEnrolled} sisa)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          quotaPercentage > 85 ? 'bg-red-600' : quotaPercentage > 60 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${quotaPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Registration Action Button */}
                  <div className="pt-1">
                    {isEnrolled ? (
                      <button
                        onClick={() => {
                          const existing = userRegistrations.find(r => r.scheduleId === schedule.id);
                          if (existing) {
                            if (onViewTicketClick) {
                              onViewTicketClick(existing);
                            } else {
                              setGeneratedTicket(existing);
                            }
                          }
                        }}
                        className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Lihat E-Tiket Saya</span>
                      </button>
                    ) : (
                      <button
                        id={`register-btn-${schedule.id}`}
                        onClick={() => handleStartRegister(schedule)}
                        disabled={isFull || schedule.status !== 'buka'}
                        className={`w-full py-2 px-4 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
                          isFull || schedule.status !== 'buka'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                        }`}
                      >
                        <span>Daftar Sesi Latihan Online</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Online Registration Modal */}
      {selectedScheduleForReg && (
        <TrainingRegistrationModal
          schedule={selectedScheduleForReg}
          isOpen={!!selectedScheduleForReg}
          onClose={() => setSelectedScheduleForReg(null)}
          onSuccess={handleRegistrationSuccess}
          onRequireLogin={() => {
            setSelectedScheduleForReg(null);
            if (onOpenAuth) onOpenAuth('login');
          }}
        />
      )}

      {/* E-Ticket Display Modal */}
      {generatedTicket && (
        <ETicketModal
          registration={generatedTicket}
          isOpen={!!generatedTicket}
          onClose={() => setGeneratedTicket(null)}
        />
      )}
    </div>
  );
};
