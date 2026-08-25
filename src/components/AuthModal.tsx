import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BeltRankLevel } from '../types';
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
  Building2,
  Heart,
  FileText,
  Sparkles,
  MessageSquare,
  Info,
  UserPlus
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
  const { login, register } = useAuth();
  const { branches, beltRanks, registrationConfig, config, requestPasswordReset } = useData();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State (Admin Verification Flow)
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotReason, setForgotReason] = useState('Lupa kata sandi lama');
  const [isResetting, setIsResetting] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // Register Form Standard States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState('Laki-laki');
  const [regBirthPlace, setRegBirthPlace] = useState('Gresik');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regJoinYear, setRegJoinYear] = useState(String(new Date().getFullYear()));
  const [regAddress, setRegAddress] = useState('');
  const [regRanting, setRegRanting] = useState(branches[0]?.name || 'Ranting Kebomas');
  const [regBelt, setRegBelt] = useState<BeltRankLevel>(beltRanks[0]?.level || 'Dasar');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regBloodType, setRegBloodType] = useState('Belum Tahu');
  const [regOccupation, setRegOccupation] = useState('');
  const [regUniformSize, setRegUniformSize] = useState('M');
  const [regHealthNotes, setRegHealthNotes] = useState('');
  const [regMotivation, setRegMotivation] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Custom Fields Answers Map
  const [regCustomAnswers, setRegCustomAnswers] = useState<Record<string, string>>({});

  // Update default ranting and belt if loaded asynchronously
  useEffect(() => {
    if (!regRanting && branches.length > 0) {
      setRegRanting(branches[0].name);
    }
  }, [branches, regRanting]);

  useEffect(() => {
    if (!regBelt && beltRanks.length > 0) {
      setRegBelt(beltRanks[0].level);
    }
  }, [beltRanks, regBelt]);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredUserPhone, setRegisteredUserPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setRegCustomAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

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
    const res = await requestPasswordReset(
      forgotIdentifier,
      forgotNewPassword,
      forgotReason,
      forgotPhone
    );
    setIsResetting(false);

    if (res.success) {
      setResetSubmitted(true);
      setSuccessMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registrationConfig.isOpen) {
      setErrorMessage(registrationConfig.closedMessage || 'Pendaftaran online saat ini sedang ditutup.');
      return;
    }

    // Required basic checks
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMessage('Harap lengkapi semua kolom wajib.');
      return;
    }

    const fieldsCfg = registrationConfig.fields;

    // Check configured required fields
    if (fieldsCfg.birthPlace?.enabled && fieldsCfg.birthPlace.required && !regBirthPlace.trim()) {
      setErrorMessage('Tempat lahir wajib diisi.');
      return;
    }

    if (fieldsCfg.birthDate?.enabled && fieldsCfg.birthDate.required && !regBirthDate) {
      setErrorMessage('Tanggal lahir wajib diisi.');
      return;
    }

    if (fieldsCfg.nik?.enabled) {
      if (fieldsCfg.nik.required && !regNik.trim()) {
        setErrorMessage('Nomor Induk Kependudukan (NIK) wajib diisi.');
        return;
      }
      if (regNik.trim() && regNik.replace(/\D/g, '').length !== 16) {
        setErrorMessage('NIK harus terdiri dari 16 digit angka.');
        return;
      }
    }

    if (fieldsCfg.joinYear?.enabled && fieldsCfg.joinYear.required && !regJoinYear) {
      setErrorMessage('Pilihan tahun masuk wajib diisi.');
      return;
    }

    if (fieldsCfg.address?.enabled && fieldsCfg.address.required && !regAddress.trim()) {
      setErrorMessage('Alamat domisili lengkap wajib diisi.');
      return;
    }

    if (fieldsCfg.emergencyContact?.enabled && fieldsCfg.emergencyContact.required && !regEmergencyContact.trim()) {
      setErrorMessage('Kontak darurat (wali) wajib diisi.');
      return;
    }

    if (fieldsCfg.occupationOrSchool?.enabled && fieldsCfg.occupationOrSchool.required && !regOccupation.trim()) {
      setErrorMessage('Kolom pekerjaan / sekolah wajib diisi.');
      return;
    }

    if (fieldsCfg.healthNotes?.enabled && fieldsCfg.healthNotes.required && !regHealthNotes.trim()) {
      setErrorMessage('Catatan riwayat kesehatan wajib diisi.');
      return;
    }

    if (fieldsCfg.motivation?.enabled && fieldsCfg.motivation.required && !regMotivation.trim()) {
      setErrorMessage('Motivasi bergabung wajib diisi.');
      return;
    }

    // Check custom fields required
    if (registrationConfig.customFields && registrationConfig.customFields.length > 0) {
      for (const cf of registrationConfig.customFields) {
        if (cf.enabled !== false && cf.required) {
          const val = regCustomAnswers[cf.id];
          if (cf.type === 'checkbox') {
            if (val !== 'Ya') {
              setErrorMessage(`Persetujuan "${cf.label}" wajib dicentang.`);
              return;
            }
          } else if (!val || !val.trim()) {
            setErrorMessage(`Pertanyaan "${cf.label}" wajib diisi.`);
            return;
          }
        }
      }
    }

    if (regPassword.length < 5) {
      setErrorMessage('Kata sandi minimal 5 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Determine initial status based on requireAdminApproval
    const memberStatus = registrationConfig.requireAdminApproval ? 'pending' : 'active';

    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      gender: fieldsCfg.gender?.enabled ? regGender : undefined,
      birthPlace: fieldsCfg.birthPlace?.enabled ? regBirthPlace.trim() : undefined,
      birthDate: fieldsCfg.birthDate?.enabled ? regBirthDate : undefined,
      nik: fieldsCfg.nik?.enabled ? regNik.replace(/\D/g, '') : undefined,
      joinYear: fieldsCfg.joinYear?.enabled !== false ? regJoinYear : undefined,
      address: fieldsCfg.address?.enabled ? regAddress.trim() : undefined,
      ranting: regRanting,
      beltRank: regBelt,
      emergencyContact: fieldsCfg.emergencyContact?.enabled ? regEmergencyContact.trim() : undefined,
      bloodType: fieldsCfg.bloodType?.enabled ? regBloodType : undefined,
      occupationOrSchool: fieldsCfg.occupationOrSchool?.enabled ? regOccupation.trim() : undefined,
      uniformSize: fieldsCfg.uniformSize?.enabled ? regUniformSize : undefined,
      healthNotes: fieldsCfg.healthNotes?.enabled ? regHealthNotes.trim() : undefined,
      motivation: fieldsCfg.motivation?.enabled ? regMotivation.trim() : undefined,
      customAnswers: regCustomAnswers,
      status: memberStatus,
      password: regPassword
    });

    if (res.success) {
      const customSuccessMsg = registrationConfig.successMessage || res.message;
      setSuccessMessage(customSuccessMsg);
      setRegisteredUserPhone(regPhone);

      if (!registrationConfig.requireAdminApproval) {
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const openWhatsAppConfirmation = () => {
    const targetPhone = registrationConfig.whatsappConfirmationPhone || '6281234567890';
    const cleanPhone = targetPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Halo Panitia PAMUR Cabang Gresik, saya telah mendaftar sebagai anggota baru:\n\nNama: ${regName}\nRanting: ${regRanting}\nEmail: ${regEmail}\nNo. HP: ${regPhone}\n\nMohon konfirmasi dan verifikasi pendaftaran saya. Terima kasih!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
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
                {mode === 'register' && (registrationConfig.formTitle || registrationConfig.title || 'Pendaftaran Anggota Baru PAMUR')}
                {mode === 'forgot-password' && 'Reset Kata Sandi Pesilat'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Sistem Informasi Digital & Keanggotaan Cabang Gresik'}
                {mode === 'register' && (registrationConfig.formSubtitle || registrationConfig.subtitle || 'Pengurus Cabang Kabupaten Gresik')}
                {mode === 'forgot-password' && 'Pulihkan akses akun pesilat menggunakan Email / NIK'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mt-4 border border-slate-700/60 text-xs">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Anggota Baru
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          
          {/* Notification Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
              
              {mode === 'register' && registrationConfig.requireAdminApproval && (
                <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                  <p className="text-[11px] text-emerald-700">
                    Data Anda telah tercatat dalam sistem. Admin akan segera memverifikasi formulir Anda.
                  </p>
                  {registrationConfig.whatsappConfirmationPhone && (
                    <button
                      type="button"
                      onClick={openWhatsAppConfirmation}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Konfirmasi via WhatsApp Panitia</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email atau Nomor Anggota (PMR-xxxx)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-identifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="nama@email.com atau PMR-2026-xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setForgotIdentifier(loginIdentifier);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] text-red-700 hover:text-red-800 font-semibold"
                  >
                    Lupa Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs mt-2"
              >
                Masuk ke Akun Pesilat
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500">
                  Belum punya akun anggota?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-red-700 font-bold hover:underline"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE 2: FORGOT PASSWORD (VERIFIKASI ADMIN) */}
          {mode === 'forgot-password' && (
            <div className="space-y-3.5">
              {resetSubmitted ? (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">Permohonan Terkirim ke Admin</h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Permohonan reset kata sandi untuk akun <strong>{forgotIdentifier}</strong> telah dicatat dan menunggu verifikasi & persetujuan dari Pengurus PAMUR.
                    </p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-left text-xs space-y-1 text-slate-700">
                    <p><strong>Status:</strong> <span className="text-amber-700 font-semibold">Menunggu Verifikasi Admin</span></p>
                    <p><strong>Catatan:</strong> Setelah disetujui, Anda dapat langsung masuk dengan kata sandi baru yang Anda ajukan.</p>
                  </div>
                  {registrationConfig.whatsappConfirmationPhone && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = registrationConfig.whatsappConfirmationPhone?.replace(/\D/g, '');
                        const text = encodeURIComponent(`Halo Admin Pengurus PAMUR Cabang Gresik, saya telah mengajukan permohonan reset kata sandi akun PAMUR (${forgotIdentifier}). Mohon bantuan verifikasinya. Terima kasih!`);
                        window.open(`https://wa.me/${target}?text=${text}`, '_blank');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Konfirmasi Admin via WhatsApp</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setResetSubmitted(false);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Verifikasi Pengurus / Admin PAMUR</strong>
                      <span>Untuk menjaga keamanan data pesilat, permohonan reset kata sandi akan diverifikasi oleh Admin PAMUR Cabang Gresik sebelum kata sandi baru aktif.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email, NIK, atau Nomor Anggota Terdaftar *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="forgot-identifier"
                        type="text"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="nama@email.com / 3525... / PMR-2026-..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      No. WhatsApp / HP Aktif untuk Dihubungi (Opsional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="forgot-phone"
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="misal: 0812-xxxx-xxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kata Sandi Baru yang Diajukan *
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alasan Permohonan Reset (Opsional)
                    </label>
                    <input
                      id="forgot-reason"
                      type="text"
                      value={forgotReason}
                      onChange={(e) => setForgotReason(e.target.value)}
                      placeholder="misal: Lupa kata sandi lama / perangkat berganti"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
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
                      Batal
                    </button>
                    <button
                      id="submit-forgot-btn"
                      type="submit"
                      disabled={isResetting}
                      className="flex-2 py-2 px-4 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isResetting ? 'Mengirim...' : 'Kirim Permohonan ke Admin'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: REGISTER (DYNAMIC FORM RENDERING) */}
          {mode === 'register' && (
            <div>
              {/* Check if registration is closed */}
              {!registrationConfig.isOpen ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-red-900">Pendaftaran Online Ditutup Sementara</h4>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      {registrationConfig.closedMessage || 'Pendaftaran anggota baru saat ini belum dibuka oleh Pengurus PAMUR Gresik.'}
                    </p>
                  </div>
                  {registrationConfig.whatsappConfirmationPhone && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = registrationConfig.whatsappConfirmationPhone?.replace(/\D/g, '');
                        window.open(`https://wa.me/${target}?text=${encodeURIComponent('Halo Panitia PAMUR Gresik, mohon informasi terkait jadwal pembukaan pendaftaran anggota baru.')}`, '_blank');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Hubungi Panitia via WhatsApp</span>
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  
                  {/* Instructions Banner if configured */}
                  {(registrationConfig.formInstructions || registrationConfig.instructions) && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-900 flex items-start gap-2">
                      <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{registrationConfig.formInstructions || registrationConfig.instructions}</span>
                    </div>
                  )}

                  {/* Wilayah Cabang Gresik Badge */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Building2 className="w-4 h-4 text-red-700" />
                      <span>Wilayah Pengurus Cabang: <strong>Kabupaten Gresik</strong></span>
                    </div>
                    <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-bold rounded-full">
                      Resmi
                    </span>
                  </div>

                  {/* Fee & Payment Notice if active */}
                  {registrationConfig.registrationFee > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-amber-700" />
                          Biaya Administrasi Pendaftaran:
                        </span>
                        <span className="font-mono text-sm text-red-700">
                          Rp {registrationConfig.registrationFee.toLocaleString('id-ID')}
                        </span>
                      </div>
                      {registrationConfig.paymentInfo && (
                        <p className="text-[11px] text-amber-800 whitespace-pre-line bg-white/70 p-2 rounded-lg border border-amber-100 font-mono">
                          {registrationConfig.paymentInfo}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 1. Nama Lengkap (Selalu Wajib) */}
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

                  {/* 2. Jenis Kelamin (Jika Diaktifkan) */}
                  {registrationConfig.fields.gender?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jenis Kelamin {registrationConfig.fields.gender.required ? '*' : '(Opsional)'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                          regGender === 'Laki-laki' 
                            ? 'bg-red-50 border-red-500 text-red-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}>
                          <input
                            type="radio"
                            name="regGender"
                            value="Laki-laki"
                            checked={regGender === 'Laki-laki'}
                            onChange={(e) => setRegGender(e.target.value)}
                            className="hidden"
                          />
                          <span>Laki-laki</span>
                        </label>
                        <label className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                          regGender === 'Perempuan' 
                            ? 'bg-red-50 border-red-500 text-red-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}>
                          <input
                            type="radio"
                            name="regGender"
                            value="Perempuan"
                            checked={regGender === 'Perempuan'}
                            onChange={(e) => setRegGender(e.target.value)}
                            className="hidden"
                          />
                          <span>Perempuan</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 3. Tempat & Tanggal Lahir */}
                  {(registrationConfig.fields.birthPlace?.enabled || registrationConfig.fields.birthDate?.enabled) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {registrationConfig.fields.birthPlace?.enabled && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tempat Lahir {registrationConfig.fields.birthPlace.required ? '*' : ''}
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
                              required={registrationConfig.fields.birthPlace.required}
                            />
                          </div>
                        </div>
                      )}

                      {registrationConfig.fields.birthDate?.enabled && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tanggal Lahir {registrationConfig.fields.birthDate.required ? '*' : ''}
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              id="register-birth-date"
                              type="date"
                              value={regBirthDate}
                              onChange={(e) => setRegBirthDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                              required={registrationConfig.fields.birthDate.required}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. NIK (Jika Diaktifkan) */}
                  {registrationConfig.fields.nik?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor Induk Kependudukan (NIK 16 Digit) {registrationConfig.fields.nik.required ? '*' : '(Opsional)'}
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
                          required={registrationConfig.fields.nik.required}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Diperlukan untuk penerbitan Kartu Tanda Anggota (KTA) resmi Cabang Gresik.
                      </p>
                    </div>
                  )}

                  {/* 5. Email & No HP (Selalu Wajib) */}
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

                  {/* 6. Alamat Domisili Lengkap */}
                  {registrationConfig.fields.address?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Domisili Lengkap {registrationConfig.fields.address.required ? '*' : ''}
                      </label>
                      <input
                        id="register-address"
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="Jl. / Desa / Kelurahan, Kecamatan di Gresik"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                        required={registrationConfig.fields.address.required}
                      />
                    </div>
                  )}

                  {/* 7. Ranting & Tingkat Sabuk & Tahun Masuk */}
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
                          {branches.map((b) => (
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
                          {beltRanks.map((b) => (
                            <option key={b.id || b.level} value={b.level}>Sabuk {b.level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 7b. Pilihan Tahun Masuk / Bergabung PAMUR */}
                  {registrationConfig.fields.joinYear?.enabled !== false && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tahun Masuk / Bergabung PAMUR {registrationConfig.fields.joinYear?.required ? '*' : '(Opsional)'}
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <select
                          id="register-join-year"
                          value={regJoinYear}
                          onChange={(e) => setRegJoinYear(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                          required={registrationConfig.fields.joinYear?.required}
                        >
                          {Array.from({ length: 45 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                            <option key={yr} value={String(yr)}>
                              Tahun {yr} {yr === new Date().getFullYear() ? '(Angkatan Baru)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Tahun angkatan masuk Anda akan tercantum pada Kartu Tanda Anggota (KTA) dan database perguruan.
                      </p>
                    </div>
                  )}

                  {/* 8. Golongan Darah & Ukuran Seragam */}
                  {(registrationConfig.fields.bloodType?.enabled || registrationConfig.fields.uniformSize?.enabled) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {registrationConfig.fields.bloodType?.enabled && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Golongan Darah {registrationConfig.fields.bloodType.required ? '*' : ''}
                          </label>
                          <div className="relative">
                            <Heart className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <select
                              id="register-blood-type"
                              value={regBloodType}
                              onChange={(e) => setRegBloodType(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                            >
                              <option value="Belum Tahu">Belum Tahu</option>
                              <option value="A">Golongan Darah A</option>
                              <option value="B">Golongan Darah B</option>
                              <option value="AB">Golongan Darah AB</option>
                              <option value="O">Golongan Darah O</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {registrationConfig.fields.uniformSize?.enabled && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ukuran Sakral Seragam {registrationConfig.fields.uniformSize.required ? '*' : ''}
                          </label>
                          <div className="relative">
                            <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <select
                              id="register-uniform-size"
                              value={regUniformSize}
                              onChange={(e) => setRegUniformSize(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                            >
                              <option value="S">S (Ukuran Anak / Kecil)</option>
                              <option value="M">M (Standar Remaja)</option>
                              <option value="L">L (Dewasa)</option>
                              <option value="XL">XL (Besar)</option>
                              <option value="XXL">XXL (Ekstra Besar)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 9. Kontak Darurat */}
                  {registrationConfig.fields.emergencyContact?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kontak Darurat (Nama & No. Telp Orang Tua / Wali) {registrationConfig.fields.emergencyContact.required ? '*' : ''}
                      </label>
                      <input
                        id="register-emergency"
                        type="text"
                        value={regEmergencyContact}
                        onChange={(e) => setRegEmergencyContact(e.target.value)}
                        placeholder="misal: Bapak Supriadi (0813-xxxx-xxxx)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                        required={registrationConfig.fields.emergencyContact.required}
                      />
                    </div>
                  )}

                  {/* 10. Pekerjaan / Asal Sekolah */}
                  {registrationConfig.fields.occupationOrSchool?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pekerjaan / Asal Sekolah / Instansi {registrationConfig.fields.occupationOrSchool.required ? '*' : ''}
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          id="register-occupation"
                          type="text"
                          value={regOccupation}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder="misal: Pelajar SMAN 1 Gresik / Karyawan"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                          required={registrationConfig.fields.occupationOrSchool.required}
                        />
                      </div>
                    </div>
                  )}

                  {/* 11. Riwayat Kesehatan */}
                  {registrationConfig.fields.healthNotes?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Riwayat Kesehatan / Cedera {registrationConfig.fields.healthNotes.required ? '*' : ''}
                      </label>
                      <input
                        id="register-health"
                        type="text"
                        value={regHealthNotes}
                        onChange={(e) => setRegHealthNotes(e.target.value)}
                        placeholder="misal: Tidak ada riwayat penyakit berat / asma ringan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                        required={registrationConfig.fields.healthNotes.required}
                      />
                    </div>
                  )}

                  {/* 12. Motivasi */}
                  {registrationConfig.fields.motivation?.enabled && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Motivasi Bergabung {registrationConfig.fields.motivation.required ? '*' : ''}
                      </label>
                      <textarea
                        id="register-motivation"
                        rows={2}
                        value={regMotivation}
                        onChange={(e) => setRegMotivation(e.target.value)}
                        placeholder="misal: Ingin mendalami seni bela diri dan berprestasi di kejuaraan..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white"
                        required={registrationConfig.fields.motivation.required}
                      />
                    </div>
                  )}

                  {/* 13. Dynamic Custom Fields */}
                  {registrationConfig.customFields && registrationConfig.customFields
                    .filter((cf) => cf.enabled !== false)
                    .map((cf) => (
                    <div key={cf.id}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {cf.label} {cf.required ? '*' : ''}
                      </label>
                      
                      {cf.type === 'select' ? (
                        <select
                          value={regCustomAnswers[cf.id] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                          required={cf.required}
                        >
                          <option value="">-- Pilih {cf.label} --</option>
                          {cf.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : cf.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={regCustomAnswers[cf.id] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.id, e.target.value)}
                          placeholder={cf.placeholder || ''}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                          required={cf.required}
                        />
                      ) : cf.type === 'checkbox' ? (
                        <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={regCustomAnswers[cf.id] === 'Ya'}
                            onChange={(e) => handleCustomFieldChange(cf.id, e.target.checked ? 'Ya' : 'Tidak')}
                            className="w-4 h-4 text-red-700 rounded"
                            required={cf.required}
                          />
                          <span className="text-xs text-slate-700">{cf.placeholder || cf.label}</span>
                        </label>
                      ) : (
                        <input
                          type={cf.type}
                          value={regCustomAnswers[cf.id] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.id, e.target.value)}
                          placeholder={cf.placeholder || ''}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                          required={cf.required}
                        />
                      )}

                      {cf.helpText && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{cf.helpText}</p>
                      )}
                    </div>
                  ))}

                  {/* 14. Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kata Sandi Akun *
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
                    className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs mt-2 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Sebagai Anggota PAMUR Gresik</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
