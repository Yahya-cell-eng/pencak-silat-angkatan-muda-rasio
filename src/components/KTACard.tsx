import React, { useState } from 'react';
import { User, KTACardConfig, BeltInfo } from '../types';
import { 
  QrCode, 
  Shield, 
  Award, 
  CheckCircle2, 
  RotateCw, 
  Sparkles, 
  Calendar, 
  Heart,
  Cpu,
  Lock,
  Compass
} from 'lucide-react';

interface KTACardProps {
  user?: User;
  member?: User;
  config: KTACardConfig;
  beltInfo?: BeltInfo;
  showBackToggle?: boolean;
  scale?: number;
  forceSide?: 'front' | 'back';
}

// Security Guilloche SVG Pattern for Authentic e-KTP Look
const KtpGuillocheBackground: React.FC<{ themePreset?: string; isLight?: boolean }> = ({ themePreset, isLight }) => {
  const isKtpBlue = themePreset === 'ktp_official';
  const isClassicRed = themePreset === 'classic_red';
  const isNavyGold = themePreset === 'navy_gold';
  const isEmerald = themePreset === 'emerald_warrior';
  const isObsidian = themePreset === 'obsidian_gold';

  let primaryStroke = 'rgba(14, 116, 144, 0.18)'; // cyan-700
  let secondaryStroke = 'rgba(2, 132, 199, 0.12)'; // sky-600
  let accentStroke = 'rgba(217, 119, 6, 0.15)'; // amber-600

  if (isClassicRed) {
    primaryStroke = 'rgba(254, 202, 202, 0.14)';
    secondaryStroke = 'rgba(239, 68, 68, 0.18)';
    accentStroke = 'rgba(245, 158, 11, 0.15)';
  } else if (isNavyGold) {
    primaryStroke = 'rgba(191, 219, 254, 0.15)';
    secondaryStroke = 'rgba(96, 165, 250, 0.15)';
    accentStroke = 'rgba(251, 191, 36, 0.2)';
  } else if (isEmerald) {
    primaryStroke = 'rgba(167, 243, 208, 0.15)';
    secondaryStroke = 'rgba(52, 211, 153, 0.15)';
    accentStroke = 'rgba(251, 191, 36, 0.15)';
  } else if (isObsidian) {
    primaryStroke = 'rgba(255, 255, 255, 0.1)';
    secondaryStroke = 'rgba(212, 175, 55, 0.18)';
    accentStroke = 'rgba(245, 158, 11, 0.15)';
  } else if (isLight) {
    primaryStroke = 'rgba(100, 116, 139, 0.14)';
    secondaryStroke = 'rgba(148, 163, 184, 0.12)';
    accentStroke = 'rgba(185, 28, 28, 0.12)';
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 540 340">
        <defs>
          <pattern id="ktp-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke={secondaryStroke} strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Micro-grid background */}
        <rect width="100%" height="100%" fill="url(#ktp-grid)" opacity="0.6" />

        {/* Guilloche Sine Waves (Top & Center security arches) */}
        <path
          d="M -20,70 Q 70,30 160,70 T 340,70 T 520,70 T 700,70"
          fill="none"
          stroke={primaryStroke}
          strokeWidth="1.2"
        />
        <path
          d="M -20,80 Q 70,120 160,80 T 340,80 T 520,80 T 700,80"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.8"
        />
        <path
          d="M -20,90 Q 70,50 160,90 T 340,90 T 520,90 T 700,90"
          fill="none"
          stroke={primaryStroke}
          strokeWidth="0.75"
        />
        <path
          d="M -20,100 Q 70,140 160,100 T 340,100 T 520,100 T 700,100"
          fill="none"
          stroke={accentStroke}
          strokeWidth="0.6"
        />

        {/* Center Concentric Guilloche Rosette */}
        <g transform="translate(270, 180)" opacity="0.45">
          <ellipse rx="130" ry="85" fill="none" stroke={primaryStroke} strokeWidth="0.8" strokeDasharray="4 2" />
          <ellipse rx="110" ry="70" fill="none" stroke={secondaryStroke} strokeWidth="0.7" />
          <ellipse rx="90" ry="55" fill="none" stroke={accentStroke} strokeWidth="0.6" strokeDasharray="3 3" />
          <ellipse rx="70" ry="40" fill="none" stroke={primaryStroke} strokeWidth="0.7" />
          <ellipse rx="50" ry="30" fill="none" stroke={secondaryStroke} strokeWidth="0.6" />
          <ellipse rx="30" ry="18" fill="none" stroke={primaryStroke} strokeWidth="0.5" />
        </g>

        {/* Lower Security Waves */}
        <path
          d="M -20,240 Q 90,200 200,240 T 420,240 T 640,240"
          fill="none"
          stroke={primaryStroke}
          strokeWidth="0.85"
        />
        <path
          d="M -20,250 Q 90,290 200,250 T 420,250 T 640,250"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.75"
        />
        <path
          d="M -20,260 Q 90,220 200,260 T 420,260 T 640,260"
          fill="none"
          stroke={accentStroke}
          strokeWidth="0.6"
        />
        <path
          d="M -20,270 Q 90,310 200,270 T 420,270 T 640,270"
          fill="none"
          stroke={primaryStroke}
          strokeWidth="0.5"
        />

        {/* Corner security rosettes */}
        <g transform="translate(30, 30)" opacity="0.35">
          <circle r="22" fill="none" stroke={primaryStroke} strokeWidth="0.6" />
          <circle r="16" fill="none" stroke={secondaryStroke} strokeWidth="0.5" />
        </g>
        <g transform="translate(510, 30)" opacity="0.35">
          <circle r="22" fill="none" stroke={primaryStroke} strokeWidth="0.6" />
          <circle r="16" fill="none" stroke={secondaryStroke} strokeWidth="0.5" />
        </g>
        <g transform="translate(30, 310)" opacity="0.35">
          <circle r="22" fill="none" stroke={primaryStroke} strokeWidth="0.6" />
          <circle r="16" fill="none" stroke={secondaryStroke} strokeWidth="0.5" />
        </g>
        <g transform="translate(510, 310)" opacity="0.35">
          <circle r="22" fill="none" stroke={primaryStroke} strokeWidth="0.6" />
          <circle r="16" fill="none" stroke={secondaryStroke} strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

// Gold Smart-Card Chip (Contact Pad) for e-KTP
const KtpSmartChip: React.FC = () => (
  <div 
    className="relative w-9 h-7 sm:w-11 sm:h-8 rounded bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-0.5 shadow-xs border border-amber-600/70 shrink-0 overflow-hidden ring-1 ring-amber-300/40"
    title="Smart Chip ID"
  >
    <div className="w-full h-full border border-amber-700/50 rounded-[2px] relative flex flex-col justify-between p-0.5">
      <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-700/50" />
      <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-700/50" />
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-700/50" />
      <div className="absolute inset-1 border border-amber-700/40 rounded-[2px]" />
    </div>
  </div>
);

// Hologram Security Foil Badge
const KtpHologramSeal: React.FC = () => (
  <div 
    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-300 via-purple-300 to-amber-300 p-0.5 shadow-sm shrink-0 border border-white/50 overflow-hidden ring-1 ring-white/30"
    title="Hologram Pengaman Resmi"
  >
    <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-[1px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -rotate-45" />
      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950/80 drop-shadow-xs" />
    </div>
  </div>
);

export const KTACard: React.FC<KTACardProps> = ({
  user: propUser,
  member,
  config,
  beltInfo,
  showBackToggle = true,
  scale = 1,
  forceSide
}) => {
  const targetUser = propUser || member;
  if (!targetUser) return null;
  const user = targetUser;
  const [isFlipped, setIsFlipped] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  // Determine active side
  const showFront = forceSide !== undefined ? forceSide === 'front' : !isFlipped;
  const isKtpStyle = config.cardStyle !== 'standard'; // Default is 'ktp'
  const isKtpOfficial = config.themePreset === 'ktp_official';
  const isLight = config.themePreset === 'clean_white' || isKtpOfficial;
  const beltColor = beltInfo?.colorHex || '#dc2626';
  const logoUrl = config.logoUrl;

  // Background styling based on preset
  const getThemeBackground = () => {
    switch (config.themePreset) {
      case 'ktp_official':
        // Authentic Indonesian e-KTP Cyan / Sky Security Palette
        return 'bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#e0f2fe] text-slate-900 border-sky-300/80 shadow-xl';
      case 'classic_red':
        return 'bg-gradient-to-br from-red-900 via-red-950 to-slate-900 text-white border-red-800/60 shadow-2xl';
      case 'navy_gold':
        return 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white border-amber-600/40 shadow-2xl';
      case 'emerald_warrior':
        return 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border-emerald-700/50 shadow-2xl';
      case 'obsidian_gold':
        return 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-amber-100 border-amber-500/40 shadow-2xl';
      case 'clean_white':
        return 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 border-slate-300 shadow-md';
      case 'dark_crimson':
      default:
        return 'bg-gradient-to-br from-slate-950 via-red-950 to-zinc-950 text-slate-100 border-slate-800 shadow-2xl';
    }
  };

  // Helper date formatter
  const formatBirthDate = (d?: string) => {
    if (!d) return '';
    try {
      const parts = d.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return d;
    } catch {
      return d;
    }
  };

  const birthPlaceStr = (user.birthPlace || '').toUpperCase();
  const birthDateStr = formatBirthDate(user.birthDate);
  const birthFull = [birthPlaceStr, birthDateStr].filter(Boolean).join(', ') || '-';
  const genderStr = user.gender ? user.gender.toUpperCase() : 'LAKI-LAKI';
  const bloodTypeStr = user.bloodType ? user.bloodType.toUpperCase() : '-';
  const issueCity = config.ktpIssueCity || (user.branch ? user.branch.replace(/ranting|cabang/gi, '').trim().toUpperCase() : 'GRESIK') || 'GRESIK';
  
  const issueDateStr = config.ktpIssueDate || (user.joinDate 
    ? formatBirthDate(user.joinDate) 
    : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'));

  // Member ID (NIA) & NIK
  const niaNumber = user.memberId || `PMR-35.25.01-${user.id.slice(0, 4).toUpperCase()}`;
  const nikNumber = user.nik || `352501${(user.birthDate || '000000').replace(/-/g, '').slice(2)}0001`;

  // Standard CR-80 PVC dimensions ratio: 85.6mm / 53.98mm = ~1.586
  return (
    <div className="flex flex-col items-center select-none print:m-0 w-full">
      {/* Front / Back Toggle if enabled */}
      {showBackToggle && (
        <div className="flex items-center justify-between w-full max-w-[540px] mb-2 px-1 print:hidden">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Format e-KTP: <strong className="text-slate-800 dark:text-slate-200">{showFront ? 'Sisi Depan (Identitas)' : 'Sisi Belakang (Ketentuan & MRZ)'}</strong></span>
          </span>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-[11px] font-bold text-red-700 hover:text-red-800 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang'}</span>
          </button>
        </div>
      )}

      {/* Main KTA Container - ISO/IEC 7810 ID-1 standard ratio ~1.586 : 1 */}
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        className="w-full max-w-[540px] print:w-full print:max-w-none transition-all duration-300"
      >
        {showFront ? (
          /* ============================================================ */
          /* FRONT SIDE - AUTHENTIC INDONESIAN e-KTP / SMART ID CARD     */
          /* ============================================================ */
          <div
            className={`kta-card-root relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all ${getThemeBackground()} aspect-[1.586/1] flex flex-col justify-between`}
            style={{
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(14, 116, 144, 0.12), 0 0 0 1px rgba(2, 132, 199, 0.15)'
                : '0 20px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)',
            }}
          >
            {/* Guilloche Micro-Security Pattern Overlay */}
            <KtpGuillocheBackground themePreset={config.themePreset} isLight={isLight} />

            {/* Central Watermark */}
            {config.showWatermark && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
                style={{ opacity: config.watermarkOpacity || (isLight ? 0.09 : 0.12) }}
              >
                {logoUrl && !logoLoadFailed ? (
                  <img
                    src={logoUrl}
                    alt="Watermark Logo"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain filter grayscale contrast-200"
                  />
                ) : (
                  <div className="w-56 h-56 border-8 border-current rounded-full flex items-center justify-center font-black text-8xl opacity-60">
                    P
                  </div>
                )}
              </div>
            )}

            {/* ================= HEADER SECTION ================= */}
            <div className="relative z-10 border-b pb-2 flex items-center justify-between border-slate-300/40">
              {/* Left Logo */}
              <div className="flex items-center gap-2.5">
                {logoUrl && !logoLoadFailed ? (
                  <div className="kta-logo-box w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/95 p-1 flex items-center justify-center shadow-xs ring-1 ring-black/10 shrink-0 overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Logo PAMUR"
                      onError={() => setLogoLoadFailed(true)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="kta-logo-box w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-xs ring-1 ring-white/30 shrink-0"
                    style={{ backgroundColor: config.primaryColor || '#991b1b' }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* 3-Tier Official KTP Header Text */}
                <div className="text-left">
                  <h3 className={`text-[10px] sm:text-[11.5px] font-black tracking-wider uppercase font-serif leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {config.orgName || 'PENCAK SILAT PAMUR'}
                  </h3>
                  <p className={`text-[8px] sm:text-[9px] uppercase tracking-wide font-bold leading-tight ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                    {config.branchSubtitle || 'PENGURUS CABANG KABUPATEN GRESIK'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-widest font-sans underline underline-offset-2 ${isLight ? 'text-slate-800' : 'text-amber-300'}`}>
                      {config.cardTitle || 'KARTU TANDA ANGGOTA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Hologram Foil / Badge */}
              <div className="flex items-center gap-2 shrink-0">
                {(config.showKtpEmblem ?? true) && (
                  <KtpHologramSeal />
                )}
                {config.badgeText && (
                  <span 
                    className="hidden sm:inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: config.accentColor || '#dc2626' }}
                  >
                    {config.badgeText}
                  </span>
                )}
              </div>
            </div>

            {/* Belt Color Bar */}
            {config.showBeltColorBar && (
              <div className="h-1 w-full rounded-full my-1 relative z-10 flex overflow-hidden shadow-2xs bg-black/10">
                <div 
                  className="h-full w-full transition-all duration-500" 
                  style={{ backgroundColor: beltColor }}
                />
              </div>
            )}

            {/* ================= NIA / NIK PROMINENT BAR (Like NIK on KTP) ================= */}
            <div className="relative z-10 flex items-center justify-between px-1 py-0.5 border-b border-dashed border-slate-400/30">
              <div className="flex items-center gap-2">
                <span className={`text-[8.5px] sm:text-[9.5px] font-black tracking-wide uppercase ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  NIA
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-mono font-black text-red-600 dark:text-red-400 tracking-wider">
                  : {niaNumber}
                </span>
              </div>

              {user.nik && (
                <div className="text-[7.5px] sm:text-[8px] font-mono text-slate-500 flex items-center gap-1">
                  <span>NIK:</span>
                  <span className="font-semibold">{user.nik}</span>
                </div>
              )}
            </div>

            {/* ================= CARD BODY: 2-COLUMN BIODATA (LEFT) & PAS FOTO 3X4 + TTD (RIGHT) ================= */}
            <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 py-1 items-start flex-1">
              
              {/* LEFT & CENTER: KTP TABULAR BIODATA (8 COLS) */}
              <div className="col-span-8 flex flex-col justify-between h-full space-y-1 text-[8px] sm:text-[9.5px] leading-tight font-sans">
                
                {/* Optional Gold Smart Chip */}
                {(config.showKtpChip ?? true) && (
                  <div className="flex items-center justify-between pb-0.5">
                    <KtpSmartChip />
                    <span className="text-[7.5px] font-mono text-slate-400 tracking-tight flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-600" />
                      <span>E-ID SECURE</span>
                    </span>
                  </div>
                )}

                {/* Tabular Rows */}
                <div className="space-y-0.5 font-medium">
                  {/* Nama */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Nama
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <span className={`col-span-7 font-black truncate uppercase text-[8.5px] sm:text-[10px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {user.name}
                    </span>
                  </div>

                  {/* Tempat / Tgl Lahir */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Tempat/Tgl Lahir
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <span className={`col-span-7 font-bold truncate uppercase ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                      {birthFull}
                    </span>
                  </div>

                  {/* Jenis Kelamin & Gol Darah */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Jenis Kelamin
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <div className="col-span-7 flex items-center justify-between pr-1">
                      <span className={`font-bold uppercase ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                        {genderStr}
                      </span>
                      {config.showBloodType && (
                        <span className="text-[7.5px] sm:text-[8px] font-bold text-red-600">
                          Gol. Darah: {bloodTypeStr}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Alamat
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <span className={`col-span-7 font-semibold truncate uppercase ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {user.address ? user.address.toUpperCase() : `KEC. ${issueCity}`}
                    </span>
                  </div>

                  {/* Ranting / Cabang */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] pl-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      &bull; Ranting/Unit
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <span className={`col-span-7 font-bold truncate uppercase ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {user.branch || 'CABANG GRESIK'}
                    </span>
                  </div>

                  {/* Tingkat Sabuk */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Tingkat Sabuk
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <div className="col-span-7 flex items-center gap-1 font-bold">
                      <span 
                        className="w-2 h-2 rounded-full inline-block shrink-0 ring-1 ring-black/20" 
                        style={{ backgroundColor: beltColor }} 
                      />
                      <span className={`uppercase font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {user.beltRank || 'SABUK PUTIH'}
                      </span>
                    </div>
                  </div>

                  {/* Status Keanggotaan */}
                  <div className="grid grid-cols-12 gap-0.5 items-baseline">
                    <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Status Anggota
                    </span>
                    <span className="col-span-1 text-center font-bold">:</span>
                    <span className="col-span-7 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      {user.status === 'active' ? 'ANGGOTA AKTIF' : 'TERDAFTAR'}
                    </span>
                  </div>

                  {/* Berlaku Hingga */}
                  {config.showValidity && (
                    <div className="grid grid-cols-12 gap-0.5 items-baseline">
                      <span className={`col-span-4 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        Berlaku Hingga
                      </span>
                      <span className="col-span-1 text-center font-bold">:</span>
                      <span className={`col-span-7 font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {config.validityText || 'SEUMUR HIDUP'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: PAS FOTO 3X4 + PENGESAHAN KTP (4 COLS) */}
              <div className="col-span-4 flex flex-col items-center justify-between h-full text-center pl-1">
                
                {/* Official Pas Foto 3x4 with Red Background Frame */}
                <div className="relative">
                  <div className="kta-photo-box w-[75px] h-[100px] sm:w-[92px] sm:h-[122px] rounded-md overflow-hidden bg-red-700 border-2 border-white shadow-md p-0.5 ring-1 ring-black/20">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-full h-full object-cover object-top rounded-[2px]"
                    />
                  </div>
                  {/* Verified check badge */}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm ring-1 ring-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Pengesahan: Kota, Tanggal, Tanda Tangan & Stempel */}
                <div className="w-full flex flex-col items-center mt-1 relative">
                  <p className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-tight leading-none ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {issueCity}, {issueDateStr}
                  </p>
                  <p className={`text-[6.5px] sm:text-[7.5px] font-medium uppercase tracking-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {config.signatureTitle1 || 'Ketua Cabang'}
                  </p>

                  {/* Signature Area + Stamp Overlay */}
                  <div className="relative w-full h-7 sm:h-8 flex items-center justify-center my-0.5">
                    {/* Stamp Overlay */}
                    {config.showStamp && config.stampImg && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                        <img 
                          src={config.stampImg} 
                          alt="Stempel Resmi"
                          className="kta-stamp-img w-12 h-12 sm:w-14 sm:h-14 object-contain opacity-80 transform -rotate-12 filter drop-shadow-2xs" 
                        />
                      </div>
                    )}

                    {/* Signature Graphic / Calligraphy */}
                    <div className="relative z-10">
                      {config.signatureImg1 ? (
                        <img 
                          src={config.signatureImg1} 
                          alt="Tanda Tangan Ketua" 
                          className="max-h-6 sm:max-h-7 max-w-[90px] object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="font-serif italic text-[10px] text-red-600 font-bold opacity-85 underline decoration-red-600/40">
                          {config.signatureName1 || 'Bambang Sutrisno'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signee Name */}
                  <p className={`text-[7px] sm:text-[8px] font-bold underline underline-offset-1 truncate max-w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {config.signatureName1 || 'Ketua Pengurus Cabang'}
                  </p>
                </div>

              </div>
            </div>

            {/* ================= BOTTOM FOOTER (QR & SECURITY HASH) ================= */}
            <div className={`relative z-10 pt-1 border-t flex items-center justify-between text-[7px] sm:text-[8px] ${isLight ? 'border-slate-300/60 text-slate-500' : 'border-white/10 text-slate-400'}`}>
              <div className="flex items-center gap-1.5">
                {config.showQrCode && (
                  <div className="kta-qr-box p-0.5 rounded bg-white text-slate-900 shrink-0 shadow-2xs ring-1 ring-slate-300">
                    <QrCode className="w-5 h-5 text-slate-900" />
                  </div>
                )}
                <div className="font-mono leading-none">
                  <span className="font-bold text-red-700 dark:text-red-400">PAMUR E-KTA</span> &bull; 
                  <span className="ml-1 tracking-tighter">SEC: {user.id.slice(0, 10).toUpperCase()}</span>
                </div>
              </div>

              <div className="text-right font-mono font-bold tracking-tight text-[6.5px] sm:text-[7.5px] text-slate-400">
                REPUBLIK INDONESIA &bull; ID-1 KTA
              </div>
            </div>

          </div>
        ) : (
          /* ============================================================ */
          /* BACK SIDE - KETENTUAN, JANJI PESILAT & MRZ MACHINE CODE     */
          /* ============================================================ */
          <div
            className={`kta-card-root relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all ${getThemeBackground()} aspect-[1.586/1] flex flex-col justify-between`}
            style={{
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(14, 116, 144, 0.12), 0 0 0 1px rgba(2, 132, 199, 0.15)'
                : '0 20px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)',
            }}
          >
            {/* Guilloche Micro-Security Pattern Overlay */}
            <KtpGuillocheBackground themePreset={config.themePreset} isLight={isLight} />

            {/* Magnetic Stripe on Top (Standard ID Card Back) */}
            <div className="h-7 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-2 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 border-b border-black/40 flex items-center px-4 relative z-10 shadow-inner">
              <span className="text-[7px] font-mono text-neutral-400 tracking-widest uppercase">
                PAMUR SECURITY SMART CARD &bull; MAGNETIC STRIPE ID
              </span>
            </div>

            {/* Back Header */}
            <div className="relative z-10 flex items-center justify-between pb-1 border-b border-slate-300/40">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-600" />
                <h4 className={`text-[9.5px] sm:text-[10.5px] font-bold font-serif uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {config.backTitle || 'PANCA PRASETYA & KETENTUAN KTA'}
                </h4>
              </div>
              <span className="text-[7.5px] font-mono font-bold text-red-600 uppercase">
                SISI BELAKANG
              </span>
            </div>

            {/* Rules & Pledges */}
            <div className="relative z-10 py-1 space-y-1.5 flex-1">
              {/* Panca Prasetya */}
              <div className={`p-2 rounded-lg border text-[7.5px] sm:text-[8.5px] leading-relaxed ${isLight ? 'bg-white/80 border-slate-200 text-slate-800' : 'bg-black/40 border-white/10 text-slate-200'}`}>
                <h5 className="font-bold text-red-600 mb-1 uppercase text-[8px] tracking-wide">
                  {config.backSubtitle || 'Ikrar & Panca Prasetya PAMUR:'}
                </h5>
                <div className="whitespace-pre-line leading-snug line-clamp-4">
                  {config.backRulesText || '1. Bertaqwa kepada Tuhan Yang Maha Esa.\n2. Berbakti kepada orang tua, guru, dan tanah air Indonesia.\n3. Menjunjung tinggi budi pekerti luhur dan persaudaraan.\n4. Mengutamakan akal pikiran sehat (rasio) dan kesabaran.\n5. Pantang menyerah dan membela kebenaran serta keadilan.'}
                </div>
              </div>

              {/* Terms / Tata Tertib */}
              <div className={`text-[7px] sm:text-[7.5px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <p className="font-bold text-slate-800 dark:text-slate-300 mb-0.5">
                  {config.backTermsHeading || 'Ketentuan Kartu:'}
                </p>
                <p className="line-clamp-2">
                  {config.backTermsText || 'Kartu ini adalah tanda bukti sah keanggotaan resmi Perguruan Silat PAMUR. Wajib dibawa saat latihan, ujian kenaikan tingkat, dan kejuaraan. Jika menemukan kartu ini harap serahkan ke sekretariat cabang PAMUR terdekat.'}
                </p>
              </div>

              {/* Signatures on Back Side if enabled */}
              {config.showBackSignatures && (
                <div className="pt-1 flex items-center justify-between text-[7px]">
                  <div>
                    <span className="text-slate-400">Pusat Informasi:</span>{' '}
                    <strong className="text-red-600">{config.backContactInfo || '0812-3456-7890'}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Sekretariat:</span>{' '}
                    <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{issueCity}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* ================= MACHINE READABLE ZONE (MRZ) - Like Real Passport & e-KTP ================= */}
            {(config.showMrzZone ?? true) && (
              <div className="relative z-10 pt-1 mt-1 border-t border-slate-300/40 font-mono text-[7px] sm:text-[8px] leading-tight tracking-widest text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/5 p-1 rounded">
                <div className="truncate">
                  {`IDIDN${(user.nik || '3525010000000000').padEnd(20, '<').slice(0, 24)}<<<<<`}
                </div>
                <div className="truncate">
                  {`PMR<<<<${user.name.toUpperCase().replace(/[^A-Z]/g, '<').padEnd(20, '<').slice(0, 24)}<<<<<`}
                </div>
                <div className="truncate">
                  {`${(user.memberId || 'PMR20260001').replace(/[^A-Z0-9]/gi, '').padEnd(12, '<')}<0IDN<<<<<<<<<<<<<4`}
                </div>
              </div>
            )}

            {/* Footer Back Note */}
            <div className={`relative z-10 pt-0.5 flex items-center justify-between text-[6.5px] sm:text-[7px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>{config.backOrgName || 'Perguruan Pencak Silat Angkatan Muda Rasio'}</span>
              <span className="font-bold text-red-600">DOKUMEN RESMI ANGGOTA</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
