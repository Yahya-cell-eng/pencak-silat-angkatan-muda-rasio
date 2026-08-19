import React, { useState } from 'react';
import { TrainingSchedule, TrainingRegistration } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  LogIn
} from 'lucide-react';

interface TrainingRegistrationModalProps {
  schedule: TrainingSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: TrainingRegistration) => void;
  onRequireLogin: () => void;
}

export const TrainingRegistrationModal: React.FC<TrainingRegistrationModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onSuccess,
  onRequireLogin
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { registerForTraining } = useData();
  const [notes, setNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !schedule) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated || !currentUser) {
      onRequireLogin();
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui komitmen kehadiran dan tata tertib latihan.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerForTraining(schedule.id, currentUser, notes);
    setIsSubmitting(false);

    if (res.success && res.registration) {
      onSuccess(res.registration);
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-slate-900 my-6">
        
        {/* Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-red-700 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-50 border border-red-100 font-bold">
              {schedule.category}
            </span>
            <span>&bull; Pendaftaran Online</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 font-serif">
            {schedule.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {schedule.branch} &bull; Kuota Tersisa: {schedule.maxQuota - schedule.registeredCount} slot
          </p>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sesi Detail Overview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-700" />
                Hari & Tanggal:
              </span>
              <span className="font-bold text-slate-900">{schedule.day}, {schedule.date}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-700" />
                Waktu Pelaksanaan:
              </span>
              <span className="font-bold text-slate-900">{schedule.timeStart} - {schedule.timeEnd} WIB</span>
            </div>

            <div className="flex items-start justify-between pb-2 border-b border-slate-200 gap-3">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                Lokasi Sasana:
              </span>
              <span className="font-semibold text-slate-800 text-right">{schedule.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-700" />
                Pelatih Pengampu:
              </span>
              <span className="font-bold text-slate-900">{schedule.coach}</span>
            </div>
          </div>

          {schedule.requirements && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-900">
              <div className="font-bold text-red-800 flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Perlengkapan yang Wajib Dibawa:
              </div>
              <p>{schedule.requirements}</p>
            </div>
          )}

          {/* User Confirmation Box */}
          {isAuthenticated && currentUser ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-2">Data Anggota Pendaftar:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500">Nama Pesilat</span>
                    <p className="font-semibold text-slate-900">{currentUser.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Nomor Anggota</span>
                    <p className="font-mono font-bold text-red-700">{currentUser.memberId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Tingkat Sabuk</span>
                    <p className="font-semibold text-slate-900">Sabuk {currentUser.beltRank}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Ranting Asal</span>
                    <p className="font-semibold text-slate-900">{currentUser.branch}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan / Kondisi Fisik (Opsional)
                </label>
                <textarea
                  id="training-reg-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Sedang pemulihan pergelangan kaki ringan, fokus peragaan jurus seni..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 border-slate-300 focus:ring-0"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 cursor-pointer">
                  Saya berkomitmen hadir tepat waktu 15 menit sebelum latihan dimulai dengan seragam silat PAMUR lengkap.
                </label>
              </div>

              <button
                id="confirm-training-reg-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-xs text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi & Terbitkan Tiket Latihan</span>
              </button>
            </form>
          ) : (
            /* Visitor prompt to login */
            <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 mx-auto flex items-center justify-center text-red-700">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Diperlukan Akun Anggota PAMUR</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Untuk mendaftar sesi latihan online, silakan masuk ke akun anggota Anda atau daftar akun baru sekarang.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-1">
                <button
                  id="prompt-login-btn"
                  onClick={() => {
                    onClose();
                    onRequireLogin();
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  Masuk / Daftar Akun
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
