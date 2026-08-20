import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TrainingRegistration } from '../types';
import { ETicketModal } from './ETicketModal';
import { 
  User as UserIcon, 
  CreditCard, 
  Calendar, 
  Lock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  MapPin, 
  Shield, 
  Edit3, 
  QrCode, 
  XCircle, 
  Eye
} from 'lucide-react';

interface MemberProfileViewProps {
  onGoToSchedules?: () => void;
  onGoToArticles?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onNavigateTab?: (tab: string) => void;
  onViewTicket?: (ticket: TrainingRegistration) => void;
}

export const MemberProfileView: React.FC<MemberProfileViewProps> = ({ 
  onGoToSchedules, 
  onNavigateTab,
  onViewTicket
}) => {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const { getUserRegistrations, cancelRegistration, branches, beltRanks } = useData();

  const [activeTab, setActiveTab] = useState<'kta' | 'registrations' | 'edit_profile' | 'security'>('kta');
  const [selectedTicket, setSelectedTicket] = useState<TrainingRegistration | null>(null);

  // Edit Profile Form
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [branch, setBranch] = useState(currentUser?.branch || branches[0]?.name || 'Ranting Kebomas');
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  // Keep branch state in sync if currentUser updates
  useEffect(() => {
    if (currentUser?.branch) {
      setBranch(currentUser.branch);
    }
  }, [currentUser?.branch]);

  // Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const ktaCardRef = useRef<HTMLDivElement>(null);

  if (!currentUser) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-8 space-y-4 shadow-xs">
        <UserIcon className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Sesi Anggota Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Silakan masuk menggunakan akun anggota atau admin Anda.</p>
      </div>
    );
  }

  const userRegistrations = getUserRegistrations(currentUser.id);
  const currentBeltInfo = beltRanks.find(b => b.level === currentUser.beltRank) || beltRanks[0] || {
    id: 'belt_dasar',
    order: 1,
    level: currentUser.beltRank || 'Dasar',
    colorHex: '#94a3b8',
    bgColor: 'bg-slate-200',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-400',
    meaning: 'Pengenalan adab persilatan',
    stage: 'Tingkat Calon Pesilat'
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const res = await updateProfile({
      name,
      phone,
      branch,
      emergencyContact,
      bio,
      avatar: avatarUrl
    });

    if (res.success) {
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak sesuai.' });
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleCancelReg = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pendaftaran sesi latihan ini?')) {
      const res = await cancelRegistration(id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      }
    }
  };

  const handlePrintKTA = () => {
    window.print();
  };

  const navigateToSchedules = () => {
    if (onNavigateTab) onNavigateTab('schedules');
    else if (onGoToSchedules) onGoToSchedules();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-700 text-white shadow-xs">
              {currentUser.role === 'admin' ? 'ADMIN' : 'ANGGOTA'}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-serif">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-md">
                Sabuk {currentUser.beltRank}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
              <span className="font-mono text-red-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                PMR ID: {currentUser.memberId}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.branch}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Bergabung: {currentUser.joinDate}
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-xl line-clamp-2 pt-1">
              {currentUser.bio || 'Pesilat aktif Perguruan Pencak Silat Angkatan Muda Rasio.'}
            </p>
          </div>

          {/* Quick Action */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={navigateToSchedules}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daftar Latihan Baru</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100">
          <button
            id="profile-tab-kta"
            onClick={() => { setActiveTab('kta'); setMessage(null); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'kta'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Kartu KTA Digital PAMUR</span>
          </button>

          <button
            id="profile-tab-registrations"
            onClick={() => { setActiveTab('registrations'); setMessage(null); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'registrations'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Riwayat & Tiket Latihan ({userRegistrations.length})</span>
          </button>

          <button
            id="profile-tab-edit"
            onClick={() => { setActiveTab('edit_profile'); setMessage(null); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'edit_profile'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah Data Diri</span>
          </button>

          <button
            id="profile-tab-security"
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Keamanan & Password</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab 1: KTA Digital Card */}
      {activeTab === 'kta' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kartu Tanda Anggota (KTA) Digital</h2>
              <p className="text-xs text-slate-500">Identitas resmi keanggotaan Perguruan Pencak Silat PAMUR</p>
            </div>
            <button
              onClick={handlePrintKTA}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak Kartu</span>
            </button>
          </div>

          {/* KTA Card Component */}
          <div className="max-w-md mx-auto" ref={ktaCardRef}>
            <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-slate-100">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center font-bold text-white text-base shadow-sm">
                    P
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-white font-serif">
                      PENCAK SILAT PAMUR
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-slate-300">
                      Angkatan Muda Rasio Indonesia
                    </p>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider">
                  KTA RESMI
                </div>
              </div>

              {/* Card Body */}
              <div className="py-4 grid grid-cols-12 gap-4 relative z-10 items-center">
                <div className="col-span-4 flex flex-col items-center">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-20 h-24 rounded-lg object-cover ring-2 ring-red-500/50 shadow-md"
                  />
                  <span className="mt-1 text-[8px] font-mono text-emerald-400 font-bold uppercase">
                    STATUS: AKTIF
                  </span>
                </div>

                <div className="col-span-8 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[8px] uppercase text-slate-400 tracking-wider">Nama Pesilat:</span>
                    <p className="font-bold text-white text-sm line-clamp-1">{currentUser.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[8px] uppercase text-slate-400 tracking-wider">Nomor Anggota:</span>
                      <p className="font-mono font-bold text-red-300 text-xs">{currentUser.memberId}</p>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase text-slate-400 tracking-wider">Tingkat Sabuk:</span>
                      <p className="font-bold text-emerald-400 text-xs">Sabuk {currentUser.beltRank}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] uppercase text-slate-400 tracking-wider">Ranting Asal:</span>
                    <p className="font-semibold text-slate-200 text-xs">{currentUser.branch}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div>
                      <span className="text-[7px] uppercase text-slate-400">Masa Berlaku:</span>
                      <p className="font-medium text-slate-300">Seumur Hidup</p>
                    </div>
                    <div>
                      <span className="text-[7px] uppercase text-slate-400">Peran:</span>
                      <p className="font-bold text-red-400 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-slate-300" />
                  <div className="text-[8px] text-slate-400 font-mono">
                    <div>VERIFIED MEMBER</div>
                    <div className="text-slate-500">{currentUser.id}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[8px] text-slate-400">Pengurus Pusat PAMUR</div>
                  <div className="text-[9px] font-bold text-white font-serif">Dewan Guru Utama</div>
                </div>
              </div>

            </div>
          </div>

          {/* Belt Progression Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-700" />
              <span>Jenjang Sabuk Anda: Sabuk {currentUser.beltRank}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Makna Filosofi: </strong> {currentBeltInfo.meaning}
            </p>
            <p className="text-xs text-slate-500">
              <strong>Materi Kurikulum: </strong> {currentBeltInfo.stage}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Registrations & Online Tickets */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Riwayat Pendaftaran Latihan Online</h2>
              <p className="text-xs text-slate-500">Daftar sesi latihan yang Anda ikuti beserta tiket resmi.</p>
            </div>
            <button
              onClick={navigateToSchedules}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              + Cari Jadwal Latihan
            </button>
          </div>

          {userRegistrations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Belum ada sesi latihan yang didaftar</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan jelajahi menu Jadwal Latihan untuk mendaftar sesi latihan teknik, tanding, atau seni.
              </p>
              <button
                onClick={navigateToSchedules}
                className="mt-2 px-4 py-2 bg-red-700 text-white font-bold rounded-lg text-xs hover:bg-red-800"
              >
                Lihat Jadwal Latihan Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className={`bg-white border rounded-xl p-5 space-y-3 transition-all shadow-xs ${
                    reg.status === 'Terkonfirmasi'
                      ? 'border-emerald-300'
                      : reg.status === 'Hadir'
                      ? 'border-blue-300'
                      : 'border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-red-700 font-bold">
                        Tiket: {reg.ticketCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {reg.scheduleTitle}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      reg.status === 'Terkonfirmasi'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : reg.status === 'Hadir'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {reg.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Waktu:</span>
                      <span className="font-semibold">{reg.scheduleDate} ({reg.scheduleTime} WIB)</span>
                    </div>
                    <div className="flex items-start justify-between text-slate-700 gap-2">
                      <span className="text-slate-500 shrink-0">Lokasi:</span>
                      <span className="text-right font-medium text-slate-800">{reg.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Ranting:</span>
                      <span className="font-medium text-red-700">{reg.branch}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => {
                        if (onViewTicket) onViewTicket(reg);
                        else setSelectedTicket(reg);
                      }}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Buka E-Tiket</span>
                    </button>

                    {reg.status === 'Terkonfirmasi' && (
                      <button
                        onClick={() => handleCancelReg(reg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                        title="Batalkan Pendaftaran"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Edit Profile */}
      {activeTab === 'edit_profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Ubah Informasi Data Diri</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ranting Latihan</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak Darurat (Wali/Keluarga)</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="misal: 0812-xxxx (Bapak Joko / Orang Tua)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Profil (Avatar)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Profil / Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tuliskan motivasi, spesialisasi tanding/seni..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
            </div>

            <button
              id="save-profile-btn"
              type="submit"
              className="py-2 px-5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Ganti Kata Sandi</h2>
          <p className="text-xs text-slate-500 mb-4">Pastikan kata sandi Anda kuat untuk menjaga keamanan akun portal PAMUR.</p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Lama</label>
              <input
                id="old-password-input"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru (Min. 5 karakter)</label>
              <input
                id="new-password-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                required
              />
            </div>

            <button
              id="submit-change-password-btn"
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      )}

      {/* ETicket Modal */}
      {selectedTicket && (
        <ETicketModal
          registration={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
