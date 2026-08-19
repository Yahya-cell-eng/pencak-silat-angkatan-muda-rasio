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
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onSuccess 
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState(BRANCHES_LIST[0].name);
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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('Semua kolom wajib diisi.');
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

    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      branch: regBranch,
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

  const handleQuickFill = (role: 'admin' | 'member1' | 'member2') => {
    if (role === 'admin') {
      setLoginIdentifier('admin@pamur.id');
      setLoginPassword('admin123');
    } else if (role === 'member1') {
      setLoginIdentifier('budi@pamur.id');
      setLoginPassword('user123');
    } else if (role === 'member2') {
      setLoginIdentifier('siti@pamur.id');
      setLoginPassword('user123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-slate-900 my-8">
        
        {/* Header Ribbon */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {mode === 'login' ? 'Masuk ke Portal PAMUR' : 'Pendaftaran Anggota Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'login' ? 'Gunakan akun admin atau anggota Anda' : 'Bergabunglah dalam keluarga besar pesilat PAMUR'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-slate-200/70 p-1 mt-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

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

          {/* Mode Login */}
          {mode === 'login' ? (
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
                    placeholder="misal: admin@pamur.id atau PMR-2023-0142"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <span className="text-[10px] text-slate-400">Akun default di bawah</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
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
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-xs transition-colors text-xs mt-2"
              >
                Masuk Sekarang
              </button>

              {/* Quick Fill Helpers */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-red-700" />
                  <span>Isi Otomatis Akun Percobaan:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    className="p-2 text-left bg-slate-50 hover:bg-red-50/50 border border-slate-200 rounded-lg text-[11px] transition-colors"
                  >
                    <div className="font-bold text-red-700">Role Admin</div>
                    <div className="text-[9px] text-slate-500">admin@pamur.id</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('member1')}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] transition-colors"
                  >
                    <div className="font-bold text-slate-800">Budi (Anggota)</div>
                    <div className="text-[9px] text-slate-500">budi@pamur.id</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('member2')}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] transition-colors"
                  >
                    <div className="font-bold text-slate-800">Siti (Anggota)</div>
                    <div className="text-[9px] text-slate-500">siti@pamur.id</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Mode Register */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
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

              <div className="grid grid-cols-2 gap-2.5">
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
                      placeholder="email@domain.com"
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Ranting Latihan *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      id="register-branch"
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kontak Darurat (Orang Tua / Wali)
                </label>
                <input
                  id="register-emergency"
                  type="text"
                  value={regEmergencyContact}
                  onChange={(e) => setRegEmergencyContact(e.target.value)}
                  placeholder="Nama & Nomor Telp Wali (Opsional)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
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
                Dengan mendaftar, Anda menyetujui Anggaran Dasar & Rumah Tangga serta kode etik kehormatan pesilat PAMUR.
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-xs transition-colors text-xs mt-2"
              >
                Daftar Sebagai Anggota PAMUR
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
