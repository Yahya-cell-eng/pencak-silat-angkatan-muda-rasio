import React, { useState } from 'react';
import { User, KTACardConfig, BeltInfo } from '../types';
import { QrCode, Shield, Award, CheckCircle2, RotateCw, Sparkles, Building, Calendar, Phone, Heart } from 'lucide-react';

interface KTACardProps {
  user?: User;
  member?: User;
  config: KTACardConfig;
  beltInfo?: BeltInfo;
  showBackToggle?: boolean;
  scale?: number;
  forceSide?: 'front' | 'back';
}

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

  // Background styling based on preset / colors
  const getThemeBackground = () => {
    switch (config.themePreset) {
      case 'classic_red':
        return 'bg-gradient-to-br from-red-900 via-red-950 to-slate-900 text-white border-red-800/60';
      case 'navy_gold':
        return 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white border-amber-600/40';
      case 'emerald_warrior':
        return 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border-emerald-700/50';
      case 'obsidian_gold':
        return 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-amber-100 border-amber-500/40';
      case 'clean_white':
        return 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 border-slate-300 shadow-md';
      case 'dark_crimson':
      default:
        return 'bg-gradient-to-br from-slate-950 via-red-950 to-zinc-950 text-slate-100 border-slate-800';
    }
  };

  const isLight = config.themePreset === 'clean_white';
  const beltColor = beltInfo?.colorHex || '#dc2626';
  const logoUrl = config.logoUrl;

  return (
    <div className="flex flex-col items-center select-none print:m-0">
      {/* Front / Back Toggle if enabled */}
      {showBackToggle && (
        <div className="flex items-center justify-between w-full max-w-md mb-2 px-1 print:hidden">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Tampilan: {isFlipped ? 'Sisi Belakang (Janji & Tata Tertib)' : 'Sisi Depan (Identitas)'}
          </span>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-[11px] font-bold text-red-700 hover:text-red-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
          >
            <RotateCw className="w-3 h-3" />
            <span>{isFlipped ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang'}</span>
          </button>
        </div>
      )}

      {/* Main KTA Container */}
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        className="w-full max-w-md print:w-full print:max-w-none transition-all duration-300"
      >
        {showFront ? (
          /* FRONT SIDE */
          <div
            className={`relative overflow-hidden rounded-2xl p-5 md:p-6 border shadow-2xl transition-all ${getThemeBackground()}`}
            style={{
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)'
                : '0 20px 35px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            {/* Pattern Overlay / Watermark */}
            {config.showWatermark && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
                style={{ opacity: config.watermarkOpacity || 0.08 }}
              >
                {logoUrl && !logoLoadFailed ? (
                  <img
                    src={logoUrl}
                    alt="Watermark Logo"
                    className="w-56 h-56 object-contain filter grayscale contrast-200"
                  />
                ) : (
                  <div className="w-64 h-64 border-8 border-current rounded-full flex items-center justify-center font-black text-9xl">
                    P
                  </div>
                )}
              </div>
            )}

            {/* Top Header with Logo */}
            <div className={`flex items-center justify-between pb-3.5 border-b relative z-10 ${isLight ? 'border-slate-200' : 'border-white/15'}`}>
              <div className="flex items-center gap-3">
                {logoUrl && !logoLoadFailed ? (
                  <div className="w-11 h-11 rounded-xl bg-white/90 p-1 flex items-center justify-center shadow-md ring-2 ring-white/30 shrink-0 overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Logo PAMUR"
                      onError={() => setLogoLoadFailed(true)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm ring-2 ring-white/20 shrink-0"
                    style={{ backgroundColor: config.primaryColor || '#991b1b' }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={`text-xs md:text-sm font-bold tracking-wider font-serif ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {config.orgName || 'PENCAK SILAT PAMUR'}
                  </h3>
                  <p className={`text-[9px] uppercase tracking-wider font-medium ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                    {config.orgSubtitle || 'Angkatan Muda Rasio Indonesia'}
                  </p>
                  {config.branchSubtitle && (
                    <p className={`text-[8px] tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                      {config.branchSubtitle}
                    </p>
                  )}
                </div>
              </div>

              {config.badgeText && (
                <div 
                  className="px-2.5 py-1 rounded-full text-white font-black text-[9px] uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: config.accentColor || '#dc2626' }}
                >
                  {config.badgeText}
                </div>
              )}
            </div>

            {/* Belt Color Bar if enabled */}
            {config.showBeltColorBar && (
              <div className="h-1.5 w-full rounded-full my-2.5 relative z-10 flex overflow-hidden shadow-inner bg-black/20">
                <div 
                  className="h-full w-full transition-all duration-500" 
                  style={{ backgroundColor: beltColor }}
                />
              </div>
            )}

            {/* Card Body (Photo + User Details) */}
            <div className="py-3.5 grid grid-cols-12 gap-3.5 relative z-10 items-center">
              {/* Photo & Active Status */}
              <div className="col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover ring-2 ring-white/30 shadow-md bg-slate-800"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="mt-2 text-[8px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user.status === 'active' ? 'AKTIF' : 'TERDAFTAR'}
                </span>
              </div>

              {/* Bio & Credentials */}
              <div className="col-span-8 space-y-2 text-xs">
                <div>
                  <span className={`text-[8px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                    Nama Lengkap
                  </span>
                  <p className={`font-bold text-sm leading-snug line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {user.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className={`text-[8px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                      No. Anggota / NIK
                    </span>
                    <p className="font-mono font-bold text-xs tracking-tight text-red-500">
                      {user.memberId}
                    </p>
                  </div>
                  <div>
                    <span className={`text-[8px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                      Tingkat Sabuk
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0 ring-1 ring-white/30" 
                        style={{ backgroundColor: beltColor }} 
                      />
                      <span className={isLight ? 'text-slate-800' : 'text-white'}>
                        {user.beltRank}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className={`text-[8px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                      Ranting / Cabang
                    </span>
                    <p className={`font-medium text-[11px] truncate ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      {user.branch}
                    </p>
                  </div>

                  {config.showValidity && (
                    <div>
                      <span className={`text-[8px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                        Masa Berlaku
                      </span>
                      <p className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {config.validityText || 'Seumur Hidup'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional metadata (joinDate / bloodType) */}
                <div className="flex items-center gap-3 pt-0.5">
                  {config.showJoinDate && user.joinDate && (
                    <div className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-slate-400" />
                      <span>Sejak: {user.joinDate}</span>
                    </div>
                  )}
                  {config.showBloodType && user.bloodType && (
                    <div className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-red-400" />
                      <span>Gol: {user.bloodType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signatures Row if enabled on front side */}
            {config.showSignatures && (config.signatureLocation !== 'back') && (
              <div className={`pt-2.5 pb-2 border-t grid grid-cols-2 gap-2 text-center relative z-10 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                {/* Stamp overlay if enabled */}
                {config.showStamp && config.stampImg && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                    <img 
                      src={config.stampImg} 
                      alt="Stempel Resmi"
                      className="w-20 h-20 object-contain opacity-75 transform -rotate-12 filter drop-shadow-sm" 
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center">
                  <p className={`text-[8px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {config.signatureTitle1 || 'Ketua Pengurus Cabang'}
                  </p>
                  <div className="h-9 w-full flex items-center justify-center my-0.5">
                    {config.signatureImg1 ? (
                      <img 
                        src={config.signatureImg1} 
                        alt="Tanda Tangan 1" 
                        className="max-h-8 max-w-[120px] object-contain filter contrast-125"
                      />
                    ) : (
                      <span className="font-serif italic text-[11px] text-red-500 font-bold opacity-80 underline decoration-red-500/40">
                        {config.signatureName1 || 'Bambang S.'}
                      </span>
                    )}
                  </div>
                  <p className={`text-[8px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {config.signatureName1 || 'Dewan Guru'}
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <p className={`text-[8px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {config.signatureTitle2 || 'Dewan Pendekar Utama'}
                  </p>
                  <div className="h-9 w-full flex items-center justify-center my-0.5">
                    {config.signatureImg2 ? (
                      <img 
                        src={config.signatureImg2} 
                        alt="Tanda Tangan 2" 
                        className="max-h-8 max-w-[120px] object-contain filter contrast-125"
                      />
                    ) : (
                      <span className="font-serif italic text-[11px] text-red-500 font-bold opacity-80 underline decoration-red-500/40">
                        {config.signatureName2 || 'Pelatih Kepala'}
                      </span>
                    )}
                  </div>
                  <p className={`text-[8px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {config.signatureName2 || 'Pelatih Kepala'}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Footer (QR Code & Verified Security Code) */}
            <div className={`pt-2.5 border-t flex items-center justify-between relative z-10 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                {config.showQrCode && (
                  <div className={`p-1 rounded bg-white text-slate-900 shrink-0 shadow-xs ring-1 ${isLight ? 'ring-slate-300' : 'ring-white/30'}`}>
                    <QrCode className="w-6 h-6 text-slate-900" />
                  </div>
                )}
                <div className="text-[7.5px] font-mono leading-tight">
                  <div className={`font-bold tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    VERIFIED ENCRYPTED KTA
                  </div>
                  <div className={isLight ? 'text-slate-400' : 'text-slate-500'}>
                    SEC-ID: {user.id.slice(0, 16).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[8px] font-serif font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {config.cardTitle || 'KARTU TANDA ANGGOTA'}
                </div>
                <div className={`text-[7px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  PP. PAMUR INDONESIA
                </div>
              </div>
            </div>

            {/* Footer Note */}
            {config.footerNote && (
              <div className={`mt-2 pt-1 border-t text-[7.5px] text-center italic ${isLight ? 'text-slate-400 border-slate-100' : 'text-slate-500 border-white/5'}`}>
                {config.footerNote}
              </div>
            )}
          </div>
        ) : (
          /* BACK SIDE - FULLY CUSTOMIZABLE */
          <div
            className={`relative overflow-hidden rounded-2xl p-6 border shadow-2xl transition-all ${getThemeBackground()}`}
            style={{
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)'
                : '0 20px 35px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            {/* Pattern Overlay / Watermark */}
            {config.showWatermark && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
                style={{ opacity: (config.watermarkOpacity || 0.08) * 0.7 }}
              >
                {logoUrl && !logoLoadFailed ? (
                  <img
                    src={logoUrl}
                    alt="Watermark Logo"
                    className="w-56 h-56 object-contain filter grayscale contrast-200"
                  />
                ) : (
                  <div className="w-64 h-64 border-8 border-current rounded-full flex items-center justify-center font-black text-9xl">
                    P
                  </div>
                )}
              </div>
            )}

            <div className={`flex items-center justify-between pb-3 border-b relative z-10 ${isLight ? 'border-slate-200' : 'border-white/15'}`}>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-red-500" />
                <h4 className={`text-xs font-bold font-serif uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {config.backTitle || 'PANCA PRASETYA & KETENTUAN KTA'}
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-400">BAGIAN BELAKANG</span>
            </div>

            <div className="py-3.5 space-y-3 text-[10px] leading-relaxed relative z-10">
              {/* Pledge / Primary Rules Box */}
              {(config.backRulesText || config.backSubtitle) && (
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/30 border-white/10 text-slate-200'}`}>
                  {config.backSubtitle && (
                    <h5 className="font-bold text-red-500 mb-1.5 uppercase text-[9px] tracking-wider">
                      {config.backSubtitle}
                    </h5>
                  )}
                  {config.backRulesText && (
                    <div className="space-y-1 text-[9px] whitespace-pre-line leading-relaxed">
                      {config.backRulesText}
                    </div>
                  )}
                </div>
              )}

              {/* Secondary Terms / Tata Tertib */}
              {(config.backTermsHeading || config.backTermsText) && (
                <div className={`space-y-1 text-[8.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {config.backTermsHeading && (
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      {config.backTermsHeading}
                    </p>
                  )}
                  {config.backTermsText && (
                    <div className="whitespace-pre-line leading-relaxed">
                      {config.backTermsText}
                    </div>
                  )}
                </div>
              )}

              {/* Signatures on back side if enabled */}
              {(config.showBackSignatures || config.signatureLocation === 'back' || config.signatureLocation === 'both') && (
                <div className={`pt-2.5 mt-1 border-t grid grid-cols-2 gap-2 text-center relative ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  {/* Stamp overlay on back side */}
                  {config.showStamp && config.stampImg && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                      <img 
                        src={config.stampImg} 
                        alt="Stempel Resmi"
                        className="w-16 h-16 object-contain opacity-75 transform -rotate-12 filter drop-shadow-sm" 
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <p className={`text-[7.5px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {config.signatureTitle1 || 'Ketua Pengurus Cabang'}
                    </p>
                    <div className="h-8 w-full flex items-center justify-center my-0.5">
                      {config.signatureImg1 ? (
                        <img 
                          src={config.signatureImg1} 
                          alt="Tanda Tangan 1" 
                          className="max-h-7 max-w-[100px] object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="font-serif italic text-[10px] text-red-500 font-bold opacity-80 underline decoration-red-500/40">
                          {config.signatureName1 || 'Bambang S.'}
                        </span>
                      )}
                    </div>
                    <p className={`text-[7.5px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {config.signatureName1 || 'Dewan Guru'}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <p className={`text-[7.5px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {config.signatureTitle2 || 'Dewan Guru Utama'}
                    </p>
                    <div className="h-8 w-full flex items-center justify-center my-0.5">
                      {config.signatureImg2 ? (
                        <img 
                          src={config.signatureImg2} 
                          alt="Tanda Tangan 2" 
                          className="max-h-7 max-w-[100px] object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="font-serif italic text-[10px] text-red-500 font-bold opacity-80 underline decoration-red-500/40">
                          {config.signatureName2 || 'Pelatih Kepala'}
                        </span>
                      )}
                    </div>
                    <p className={`text-[7.5px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {config.signatureName2 || 'Pelatih Kepala'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Back Side Footer */}
            <div className={`pt-2.5 border-t flex items-center justify-between text-[8px] relative z-10 ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
              <div className="flex items-center gap-1.5">
                {config.showBackQr && (
                  <div className={`p-1 rounded bg-white text-slate-900 shrink-0 shadow-xs ring-1 ${isLight ? 'ring-slate-300' : 'ring-white/30'}`}>
                    <QrCode className="w-4 h-4 text-slate-900" />
                  </div>
                )}
                <div className="font-mono text-[7.5px]">
                  {config.backOrgName || 'Pencak Silat PAMUR Indonesia'}
                </div>
              </div>
              <div className="font-bold text-red-500 text-[8px] text-right">
                {config.backContactInfo || 'Pusat Informasi: 0812-3456-7890'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
