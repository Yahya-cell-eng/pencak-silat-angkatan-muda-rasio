import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TrainingRegistration } from '../types';
import { ETicketModal } from './ETicketModal';
import { KTACard } from './KTACard';
import { KTAPrintModal } from './KTAPrintModal';
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
  Eye,
  Sparkles,
  Scissors,
  Camera,
  Building2,
  Phone,
  Heart,
  FileText,
  X
} from 'lucide-react';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

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
  const { getUserRegistrations, cancelRegistration, branches, beltRanks, ktaConfig } = useData();

  const [activeTab, setActiveTab] = useState<'kta' | 'registrations' | 'edit_profile' | 'security'>('kta');
  const [selectedTicket, setSelectedTicket] = useState<TrainingRegistration | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [quickPhotoValue, setQuickPhotoValue] = useState<string>(currentUser?.avatar || '');
  const [isSavingPhoto, setIsSavingPhoto] = useState<boolean>(false);

  // Edit Profile Form Comprehensive States
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [branch, setBranch] = useState(currentUser?.branch || branches[0]?.name || 'Ranting Kebomas');
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');
  const [nik, setNik] = useState(currentUser?.nik || '');
  const [birthPlace, setBirthPlace] = useState(currentUser?.birthPlace || 'Gresik');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '');
  const [gender, setGender] = useState(currentUser?.gender || 'Laki-laki');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [bloodType, setBloodType] = useState(currentUser?.bloodType || 'Belum Tahu');
  const [occupationOrSchool, setOccupationOrSchool] = useState(currentUser?.occupationOrSchool || '');
  const [uniformSize, setUniformSize] = useState(currentUser?.uniformSize || 'M');
  const [healthNotes, setHealthNotes] = useState(currentUser?.healthNotes || '');
  const [motivation, setMotivation] = useState(currentUser?.motivation || '');

  // Keep states in sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      if (currentUser.branch) setBranch(currentUser.branch);
      setEmergencyContact(currentUser.emergencyContact || '');
      setBio(currentUser.bio || '');
      setAvatarUrl(currentUser.avatar || '');
      setQuickPhotoValue(currentUser.avatar || '');
      setNik(currentUser.nik || '');
      setBirthPlace(currentUser.birthPlace || 'Gresik');
      setBirthDate(currentUser.birthDate || '');
      setGender(currentUser.gender || 'Laki-laki');
      setAddress(currentUser.address || '');
      setBloodType(currentUser.bloodType || 'Belum Tahu');
      setOccupationOrSchool(currentUser.occupationOrSchool || '');
      setUniformSize(currentUser.uniformSize || 'M');
      setHealthNotes(currentUser.healthNotes || '');
      setMotivation(currentUser.motivation || '');
    }
  }, [currentUser]);

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

  const handleSaveQuickPhoto = async () => {
    setIsSavingPhoto(true);
    const res = await updateProfile({
      avatar: quickPhotoValue.trim()
    });
    setIsSavingPhoto(false);
    if (res.success) {
      setAvatarUrl(quickPhotoValue.trim());
      setMessage({ type: 'success', text: 'Foto profil dan KTA berhasil diperbarui!' });
      setIsPhotoModalOpen(false);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (nik.trim() && nik.replace(/\D/g, '').length !== 16) {
      setMessage({ type: 'error', text: 'Nomor Induk Kependudukan (NIK) harus terdiri dari 16 digit angka.' });
      return;
    }

    const res = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      branch,
      emergencyContact: emergencyContact.trim(),
      bio: bio.trim(),
      avatar: avatarUrl.trim(),
      nik: nik.trim() ? nik.replace(/\D/g, '') : '',
      birthPlace: birthPlace.trim(),
      birthDate,
      gender,
      address: address.trim(),
      bloodType,
      occupationOrSchool: occupationOrSchool.trim(),
      uniformSize,
      healthNotes: healthNotes.trim(),
      motivation: motivation.trim()
    });

    if (res.success) {
      setMessage({ type: 'success', text: 'Seluruh data diri dan foto profil berhasil disimpan!' });
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
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden ring-2 ring-slate-100 shadow-xs bg-slate-100">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}&backgroundColor=831843,b91c1c,d97706`}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setQuickPhotoValue(currentUser.avatar || '');
                setIsPhotoModalOpen(true);
              }}
              className="absolute inset-0 bg-black/55 text-white rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
              title="Klik untuk ubah pas foto KTA"
            >
              <Camera className="w-5 h-5 mb-1 text-white" />
              <span>Ubah Foto</span>
            </button>
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
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              id="profile-header-change-photo-btn"
              onClick={() => {
                setQuickPhotoValue(currentUser.avatar || '');
                setIsPhotoModalOpen(true);
              }}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Ganti foto profil untuk KTA fisik dan digital"
            >
              <Camera className="w-3.5 h-3.5 text-red-700" />
              <span>Ubah Foto Profil</span>
            </button>

            <button
              id="profile-header-print-kta-btn"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Buka tampilan cetak KTA fisik standar ID Card"
            >
              <Printer className="w-3.5 h-3.5 text-red-700" />
              <span>Cetak KTA</span>
            </button>

            <button
              onClick={navigateToSchedules}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kartu Tanda Anggota (KTA) Digital PAMUR</h2>
              <p className="text-xs text-slate-500">Identitas resmi keanggotaan Perguruan Pencak Silat PAMUR Cabang Gresik</p>
            </div>
            <button
              id="kta-open-print-modal-btn"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer hover:scale-102"
              title="Buka tampilan cetak kartu fisik standar PVC ID Card"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak KTA Fisik (Print-Ready)</span>
            </button>
          </div>

          {/* KTA Card Component */}
          <div className="max-w-md mx-auto" ref={ktaCardRef}>
            <KTACard 
              user={currentUser} 
              config={ktaConfig} 
              beltInfo={currentBeltInfo} 
              showBackToggle={true} 
            />
          </div>

          {/* Physical Print Action Banner */}
          <div className="bg-gradient-to-r from-red-50 via-slate-50 to-red-50 border border-red-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <span>Cetak Fisik Kartu Anggota (PVC / Kertas Foto)</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-red-100 text-red-800 font-bold uppercase">Standar CR-80</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                  Gunakan tampilan print-friendly untuk mencetak sisi depan & belakang berdampingan lengkap dengan garis potong (crop marks), panduan lipat, dan dimensi fisik presisi 85.6 × 54 mm.
                </p>
              </div>
            </div>

            <button
              id="profile-banner-print-kta-btn"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-102 whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Buka Tampilan Cetak</span>
            </button>
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
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ubah Informasi Data Diri & Pas Foto</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbarui biodata resmi dan pas foto Anda. Data akan langsung terhubung ke sistem keanggotaan dan Kartu Tanda Anggota (KTA).
            </p>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Bagian 1: Pas Foto Profil KTA */}
            <div className="p-4 bg-red-50/40 border border-red-100 rounded-xl">
              <ProfilePhotoUploader
                value={avatarUrl}
                onChange={setAvatarUrl}
                userName={name || currentUser.name}
                label="Pas Foto Profil / KTA Digital"
                helperText="Unggah pas foto formal atau potret langsung via kamera untuk kartu anggota KTA fisik dan digital resmi PAMUR."
                shape="circle"
              />
            </div>

            {/* Bagian 2: Data Identitas Pokok */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <UserIcon className="w-3.5 h-3.5 text-red-700" />
                <span>Identitas Pokok & Kependudukan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK 16 Digit)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="16 digit angka sesuai KTP/KK"
                    maxLength={16}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="misal: Gresik"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Golongan Darah</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  >
                    <option value="Belum Tahu">Belum Tahu</option>
                    <option value="A">Golongan A</option>
                    <option value="B">Golongan B</option>
                    <option value="AB">Golongan AB</option>
                    <option value="O">Golongan O</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <label className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                    gender === 'Laki-laki' 
                      ? 'bg-red-50 border-red-500 text-red-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="editGender"
                      value="Laki-laki"
                      checked={gender === 'Laki-laki'}
                      onChange={(e) => setGender(e.target.value)}
                      className="hidden"
                    />
                    <span>Laki-laki</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                    gender === 'Perempuan' 
                      ? 'bg-red-50 border-red-500 text-red-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="editGender"
                      value="Perempuan"
                      checked={gender === 'Perempuan'}
                      onChange={(e) => setGender(e.target.value)}
                      className="hidden"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bagian 3: Kontak & Domisili */}
            <div className="space-y-3.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Phone className="w-3.5 h-3.5 text-red-700" />
                <span>Kontak & Alamat Domisili</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp / HP <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak Darurat (Wali / Keluarga)</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="misal: 0812-xxxx (Bapak Joko / Orang Tua)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nama jalan, RT/RW, Dusun/Kelurahan, Kecamatan di Gresik..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Bagian 4: Ranting Latihan & Perlengkapan */}
            <div className="space-y-3.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-700" />
                <span>Ranting Latihan & Perlengkapan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ranting Latihan PAMUR</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ukuran Seragam Silat</label>
                  <select
                    value={uniformSize}
                    onChange={(e) => setUniformSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  >
                    <option value="S">Ukuran S (Kecil)</option>
                    <option value="M">Ukuran M (Sedang)</option>
                    <option value="L">Ukuran L (Besar)</option>
                    <option value="XL">Ukuran XL (Ekstra Besar)</option>
                    <option value="XXL">Ukuran XXL (Super Besar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan / Asal Sekolah</label>
                  <input
                    type="text"
                    value={occupationOrSchool}
                    onChange={(e) => setOccupationOrSchool(e.target.value)}
                    placeholder="misal: SMA Negeri 1 Gresik / Karyawan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 5: Kesehatan & Profil */}
            <div className="space-y-3.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Heart className="w-3.5 h-3.5 text-red-700" />
                <span>Kesehatan, Motivasi & Bio Pesilat</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Riwayat Kesehatan / Alergi</label>
                  <textarea
                    rows={2}
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    placeholder="misal: Riwayat asma ringan / Tidak ada pantangan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Motivasi Bergabung PAMUR</label>
                  <textarea
                    rows={2}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="misal: Ingin berprestasi di tanding silat & melatih mental budi luhur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Profil / Bio Singkat</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Tuliskan motto silat, spesialisasi tanding/seni..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                * Pastikan nomor WhatsApp dan nama lengkap sudah benar sesuai identitas resmi.
              </span>
              <button
                id="save-profile-btn"
                type="submit"
                className="py-2.5 px-6 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Seluruh Data Diri</span>
              </button>
            </div>
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

      {/* KTA Print Friendly Modal */}
      <KTAPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        user={currentUser}
        config={ktaConfig}
        beltInfo={currentBeltInfo}
      />

      {/* Quick Profile Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ubah Foto Profil & KTA</h3>
                  <p className="text-[11px] text-slate-500">Pas foto resmi untuk kartu anggota digital & fisik</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ProfilePhotoUploader
              value={quickPhotoValue}
              onChange={setQuickPhotoValue}
              userName={currentUser.name}
              label="Pas Foto Anggota PAMUR"
              helperText="Pilih foto dari galeri/perangkat, potret langsung dengan kamera, atau pilih karakter pesilat."
              shape="circle"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveQuickPhoto}
                disabled={isSavingPhoto}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingPhoto ? 'Menyimpan...' : 'Simpan Foto Baru'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
