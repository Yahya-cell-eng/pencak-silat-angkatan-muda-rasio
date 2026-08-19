import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BeltRankLevel } from '../types';
import { BRANCHES_LIST, BELT_RANKS } from '../data/initialData';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Calendar,
  CreditCard,
  Building2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot-password';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onSuccess 
}) => {
  const { login, register, resetPasswordByEmailOrId } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBirthPlace, setRegBirthPlace] = useState('Gresik');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regRanting, setRegRanting] = useState(BRANCHES_LIST[0]?.name || 'Ranting Kebomas');
  const [regBelt, setRegBelt] = useState<BeltRankLevel>('Putih');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier || !loginPassword) {
      setErrorMessage('Harap isi email/nomor anggota dan kata sandi.');
      return;
    }

    const res = login(loginIdentifier, loginPassword);
    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Harap masukkan Email, NIK, atau Nomor Anggota.');
      return;
    }

    if (forgotNewPassword.length < 5) {
      setErrorMessage('Kata sandi baru minimal 5 karakter.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsResetting(true);
    const res = await resetPasswordByEmailOrId(forgotIdentifier, forgotNewPassword);
    setIsResetting(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setLoginIdentifier(forgotIdentifier);
      setLoginPassword(forgotNewPassword);
      setTimeout(() => {
        setMode('login');
      }, 1500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('Harap lengkapi semua kolom bertanda bintang (*).');
      return;
    }

    if (!regBirthPlace.trim()) {
      setErrorMessage('Tempat lahir wajib diisi.');
      return;
    }

    if (!regBirthDate) {
      setErrorMessage('Tanggal lahir wajib diisi.');
      return;
    }

    if (regNik.trim() && regNik.replace(/\D/g, '').length !== 16) {
      setErrorMessage('NIK harus terdiri dari 16 digit angka (atau kosongkan jika belum memiliki KTP).');
      return;
    }

    if (regPassword.length < 5) {
      setErrorMessage('Kata sandi minimal 5 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      birthPlace: regBirthPlace,
      birthDate: regBirthDate,
      nik: regNik.replace(/\D/g, ''),
      ranting: regRanting,
      beltRank: regBelt,
      emergencyContact: regEmergencyContact,
      password: regPassword
    });

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-6">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 border border-red-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif tracking-wide">
                {mode === 'login' && 'Masuk ke Portal PAMUR'}
                {mode === 'register' && 'Pendaftaran Anggota Cabang Gresik'}
                {mode === 'forgot-password' && 'Reset / Lupa Kata Sandi'}
              </h3>
              <p className="text-xs text-slate-300">
                {mode === 'login' && 'Gunakan akun admin atau anggota Anda'}
                {mode === 'register' && 'Bergabunglah dalam keluarga besar pesilat PAMUR Kab. Gresik'}
                {mode === 'forgot-password' && 'Atur ulang kata sandi menggunakan Email, NIK, atau PMR ID'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-slate-800 p-1 mt-4 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                mode === 'register'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email atau Nomor Anggota (PMR ID)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-input-identifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="misal: admin@pamur.id atau PMR-1998-0001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setErrorMessage('');
                      setSuccessMessage('');
                      if (loginIdentifier) {
                        setForgotIdentifier(loginIdentifier);
                      }
                    }}
                    className="text-[11px] font-semibold text-red-700 hover:text-red-800 hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun Anda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs mt-2 cursor-pointer"
              >
                Masuk Sekarang
              </button>

              {/* Quick 1-Click Login Helper */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">
                  ⚡ Isi Cepat Akun Administrator:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('admin@pamur.id');
                      setLoginPassword('admin123');
                      setErrorMessage('');
                    }}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-red-700">
                      Admin: admin@pamur.id
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Sandi: admin123
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('yhendrasahroni@gmail.com');
                      setLoginPassword('admin123');
                      setErrorMessage('');
                    }}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-red-700 truncate">
                      Admin: yhendrasahroni@...
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Sandi: admin123
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: FORGOT PASSWORD */}
          {mode === 'forgot-password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Reset Kata Sandi Akun Pesilat & Admin</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Masukkan Email terdaftar, Nomor PMR ID, atau NIK untuk membuat kata sandi baru secara langsung.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email, Nomor Anggota (PMR ID), atau NIK *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="forgot-identifier"
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="misal: admin@pamur.id atau 3525011506750001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Baru *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="forgot-new-password"
                      type={showForgotPass ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Min. 5 karakter"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPass(!showForgotPass)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showForgotPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="forgot-confirm-password"
                      type={showForgotPass ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Kembali ke Login
                </button>
                <button
                  id="submit-forgot-btn"
                  type="submit"
                  disabled={isResetting}
                  className="flex-2 py-2 px-4 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm text-xs"
                >
                  {isResetting ? 'Memperbarui...' : 'Simpan Sandi Baru'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              
              {/* Wilayah Cabang Gresik Badge */}
              <div className="flex items-center justify-between p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-red-900 font-semibold">
                  <Building2 className="w-4 h-4 text-red-600" />
                  <span>Wilayah Pengurus Cabang: <strong>Kabupaten Gresik</strong></span>
                </div>
                <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-bold rounded-full">
                  Tetap Gresik
                </span>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pesilat *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="register-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="misal: Mochamad Hendra Pratama"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-birth-place"
                      type="text"
                      value={regBirthPlace}
                      onChange={(e) => setRegBirthPlace(e.target.value)}
                      placeholder="misal: Gresik"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-birth-date"
                      type="date"
                      value={regBirthDate}
                      onChange={(e) => setRegBirthDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* NIK (Nomor Induk Kependudukan) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK 16 Digit) *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="register-nik"
                    type="text"
                    maxLength={16}
                    value={regNik}
                    onChange={(e) => setRegNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="3525xxxxxxxxxxxx (16 digit angka KTP/KK)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Diperlukan untuk penerbitan Kartu Tanda Anggota (KTA) resmi Cabang Gresik.
                </p>
              </div>

              {/* Email & No HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp / HP *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ranting di Gresik & Tingkat Sabuk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ranting Latihan di Gresik *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      id="register-ranting"
                      value={regRanting}
                      onChange={(e) => setRegRanting(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    >
                      {BRANCHES_LIST.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Sabuk Saat Ini *
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      id="register-belt"
                      value={regBelt}
                      onChange={(e) => setRegBelt(e.target.value as BeltRankLevel)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    >
                      {BELT_RANKS.map((b) => (
                        <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Kontak Darurat */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kontak Darurat (Nama & No. Telp Orang Tua / Wali)
                </label>
                <input
                  id="register-emergency"
                  type="text"
                  value={regEmergencyContact}
                  onChange={(e) => setRegEmergencyContact(e.target.value)}
                  placeholder="misal: Bapak Supriadi (0813-xxxx-xxxx)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 5 karakter"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Konfirmasi Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="register-confirm-password"
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi sandi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Dengan mendaftar, Anda menyetujui Anggaran Dasar & Rumah Tangga serta kode etik kehormatan pesilat PAMUR Cabang Gresik.
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs mt-2"
              >
                Daftar Sebagai Anggota PAMUR Gresik
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
