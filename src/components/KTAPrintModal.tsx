import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, KTACardConfig, BeltInfo } from '../types';
import { KTACard } from './KTACard';
import { toPng } from 'html-to-image';
import { 
  Printer, 
  X, 
  Layers, 
  Scissors, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Maximize2,
  Info,
  Sliders,
  Palette,
  Download,
  Eye,
  Check,
  Loader2
} from 'lucide-react';

interface KTAPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  config: KTACardConfig;
  beltInfo?: BeltInfo;
}

export type PrintLayoutMode = 'both_horizontal' | 'both_vertical' | 'front_only' | 'back_only';

export const KTAPrintModal: React.FC<KTAPrintModalProps> = ({
  isOpen,
  onClose,
  user,
  config,
  beltInfo
}) => {
  const [layoutMode, setLayoutMode] = useState<PrintLayoutMode>('both_horizontal');
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [showFoldGuide, setShowFoldGuide] = useState<boolean>(true);
  const [showPrintMeta, setShowPrintMeta] = useState<boolean>(true);
  const [useEcoTheme, setUseEcoTheme] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'instructions'>('preview');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById('kta-print-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'kta-print-portal';
      document.body.appendChild(el);
    }
    setPortalElement(el);

    if (isOpen) {
      document.body.classList.add('printing-kta');
    } else {
      document.body.classList.remove('printing-kta');
    }

    return () => {
      document.body.classList.remove('printing-kta');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Active configuration (with optional clean white theme for ink saving)
  const activeConfig: KTACardConfig = useEcoTheme
    ? { ...config, themePreset: 'clean_white' }
    : config;

  const handlePrint = () => {
    window.print();
  };

  // Download high-resolution PNG image
  const handleDownloadImage = async (targetId: string, filename: string) => {
    const node = document.getElementById(targetId);
    if (!node) return;

    try {
      setIsExporting(true);
      setExportSuccess(null);
      
      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 3, // High DPI for crisp printing & sharing
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(`Berhasil mengunduh ${filename}.png`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Gagal mengunduh gambar KTA:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const idCardMmLabel = '85.6 mm × 54.0 mm (Standar CR-80 PVC)';

  // Printable Document Content (Shared between On-Screen Preview & Pure Print Portal)
  const renderPrintableDocument = (isForPortal: boolean = false) => (
    <div 
      id={isForPortal ? 'kta-print-sheet-portal' : 'kta-print-sheet-preview'}
      className="bg-white p-4 sm:p-8 flex flex-col items-center justify-start text-slate-900 w-full max-w-4xl mx-auto"
      style={{
        boxSizing: 'border-box',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* Official Header Banner on Printout */}
      <div className="w-full text-center pb-3 mb-4 border-b border-slate-300">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <span className="text-[11px] font-bold font-serif uppercase tracking-widest text-red-800">
            PERGURUAN PENCAK SILAT ANGKATAN MUDA RASIO (PAMUR)
          </span>
        </div>
        <h4 className="text-[12px] font-black font-serif uppercase tracking-wider text-slate-900">
          DOKUMEN RESMI CETAK KARTU TANDA ANGGOTA (KTA)
        </h4>
        <p className="text-[8.5px] text-slate-500 font-mono mt-0.5">
          Dimensi Fisik ID Card: {idCardMmLabel} &bull; Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Cards Box with Optional Crop Marks and Center Folding Guide */}
      <div 
        id="kta-printable-cards-container"
        className="relative inline-flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-300 bg-white"
        style={{
          boxSizing: 'border-box',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {/* Outer Corner Crop Marks */}
        {showCropMarks && (
          <>
            <div className="absolute -top-2.5 -left-2.5 w-5 h-5 border-t-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute -top-2.5 -right-2.5 w-5 h-5 border-t-2 border-r-2 border-slate-700 pointer-events-none" />
            <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 border-b-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 border-b-2 border-r-2 border-slate-700 pointer-events-none" />
          </>
        )}

        {/* 1. Layout Mode: BOTH HORIZONTAL (Side-by-Side with center fold line) */}
        {layoutMode === 'both_horizontal' && (
          <div className="flex flex-row items-center justify-center gap-3">
            {/* FRONT CARD */}
            <div 
              id="kta-card-front-export"
              className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="front"
              />
            </div>

            {/* Center Fold / Cut Guide */}
            {showFoldGuide && (
              <div className="flex flex-col items-center justify-center px-1 text-slate-400 select-none">
                <div className="w-px h-24 border-r-2 border-dashed border-slate-400" />
                <span className="text-[7.5px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-300 my-1 whitespace-nowrap shadow-2xs">
                  Garis Lipat
                </span>
                <div className="w-px h-24 border-r-2 border-dashed border-slate-400" />
              </div>
            )}

            {/* BACK CARD */}
            <div 
              id="kta-card-back-export"
              className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="back"
              />
            </div>
          </div>
        )}

        {/* 2. Layout Mode: BOTH VERTICAL (Stacked) */}
        {layoutMode === 'both_vertical' && (
          <div className="flex flex-col items-center justify-center gap-3">
            {/* FRONT CARD */}
            <div 
              id="kta-card-front-export"
              className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="front"
              />
            </div>

            {/* Horizontal Fold Guide */}
            {showFoldGuide && (
              <div className="w-full flex items-center justify-center gap-2 py-1 text-slate-400 select-none">
                <div className="flex-1 border-t-2 border-dashed border-slate-400" />
                <span className="text-[7.5px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap">
                  Garis Lipat / Potong
                </span>
                <div className="flex-1 border-t-2 border-dashed border-slate-400" />
              </div>
            )}

            {/* BACK CARD */}
            <div 
              id="kta-card-back-export"
              className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="back"
              />
            </div>
          </div>
        )}

        {/* 3. Layout Mode: FRONT ONLY */}
        {layoutMode === 'front_only' && (
          <div 
            id="kta-card-front-export"
            className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
          >
            <KTACard
              user={user}
              config={activeConfig}
              beltInfo={beltInfo}
              showBackToggle={false}
              forceSide="front"
            />
          </div>
        )}

        {/* 4. Layout Mode: BACK ONLY */}
        {layoutMode === 'back_only' && (
          <div 
            id="kta-card-back-export"
            className="kta-print-card-box w-[324px] sm:w-[340px] md:w-[350px] shrink-0"
          >
            <KTACard
              user={user}
              config={activeConfig}
              beltInfo={beltInfo}
              showBackToggle={false}
              forceSide="back"
            />
          </div>
        )}
      </div>

      {/* Verification & Authentication Metadata on Sheet */}
      {showPrintMeta && (
        <div className="mt-5 pt-3 border-t border-slate-300 w-full max-w-xl text-center space-y-1 text-[8.5px] text-slate-600 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2">
            <span>NO. ANGGOTA: <strong className="text-slate-900 font-bold">{user.memberId}</strong></span>
            <span>NAMA: <strong className="text-slate-900 font-bold">{user.name.toUpperCase()}</strong></span>
            <span>TINGKAT: <strong className="text-slate-900 font-bold">{user.beltRank.toUpperCase()}</strong></span>
            <span>RANTING: <strong className="text-slate-900 font-bold">{user.branch.toUpperCase()}</strong></span>
          </div>
          <p className="text-[7.5px] text-slate-500 pt-0.5">
            Kartu Tanda Anggota Resmi Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) &bull; Sistem Otentikasi Digital
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. STANDALONE PRINT PORTAL (Active purely on print, isolating the output to 1 clean page) */}
      {portalElement && createPortal(renderPrintableDocument(true), portalElement)}

      {/* 2. ON-SCREEN INTERACTIVE MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:hidden">
        
        {/* Modal Card */}
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh]">
          
          {/* Top Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white font-bold shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-serif tracking-wide text-white">
                    Cetak Fisik Kartu Tanda Anggota (KTA)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                    CR-80 Ready
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Format cetak presisi untuk pesilat <strong className="text-white">{user.name}</strong> ({user.memberId})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="kta-print-action-btn-header"
                onClick={handlePrint}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102"
                title="Buka dialog cetak browser (Ctrl + P)"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Cetak Sekarang (Print)</span>
                <span className="sm:hidden">Cetak</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Tutup lembar cetak"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Options & Navigation Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => { setLayoutMode('both_horizontal'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'both_horizontal' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dua Sisi Berdampingan (Lipat/PVC)</span>
              </button>

              <button
                onClick={() => { setLayoutMode('both_vertical'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'both_vertical' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dua Sisi Atas-Bawah</span>
              </button>

              <button
                onClick={() => { setLayoutMode('front_only'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'front_only' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Depan Saja</span>
              </button>

              <button
                onClick={() => { setLayoutMode('back_only'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'back_only' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Belakang Saja</span>
              </button>
            </div>

            {/* Actions: Petunjuk & Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'instructions' ? 'preview' : 'instructions')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'instructions'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Petunjuk Cetak Fisik</span>
              </button>
            </div>
          </div>

          {/* Success Banner if exported */}
          {exportSuccess && (
            <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Modal Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-200/60">
            
            {/* INSTRUCTIONS TAB */}
            {activeTab === 'instructions' && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Panduan & Rekomendasi Cetak Fisik KTA PAMUR</h4>
                    <p className="text-xs text-slate-500">Hasil cetak presisi 1 halaman bebas bocor background.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Rekomendasi Media Cetak</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-600 list-disc pl-4 leading-relaxed">
                      <li><strong>Kertas Foto Glossy (230 - 260 gsm)</strong>: Sangat hemat, warna tajam, lalu dilaminasi panas (hot lamination).</li>
                      <li><strong>PVC ID Card Inkjet (0.76 mm)</strong>: Menghasilkan kartu keras standar ATM/KTP fisik.</li>
                      <li><strong>Kertas Buffalo / Karton Tebal</strong>: Cocok untuk dokumen arsip ranting / perguruan.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Sliders className="w-4 h-4 text-red-700" />
                      <span>2. Pengaturan Dialog Cetak (Browser)</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-600 list-disc pl-4 leading-relaxed">
                      <li><strong>Ukuran Kertas</strong>: Pilih <strong>A4</strong>.</li>
                      <li><strong>Skala (Scale)</strong>: Pilih <strong>100% / Default</strong> (Ukuran standar CR-80 85.6 × 54.0 mm).</li>
                      <li><strong>Grafik Latar Belakang (Background Graphics)</strong>: <strong>Wajib dicentang</strong>.</li>
                      <li><strong>Margin</strong>: Pilih <em>Default</em> atau <em>Minimum</em>.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Scissors className="w-4 h-4 text-purple-700" />
                      <span>3. Metode Lipat Dua Sisi</span>
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      Gunakan opsi <strong>Dua Sisi Berdampingan</strong>. Setelah dicetak, lipat tepat pada garis putus-putus tengah, lalu potong mengikuti garis sudut luar (crop marks) sebelum dimasukkan ke dalam holder mika KTA (Ukuran B2 / B3).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>4. Otentikasi QR Code</span>
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      QR Code pada KTA memuat kode otentikasi resmi untuk memvalidasi keanggotaan pesilat saat UKT (Ujian Kenaikan Tingkat) maupun kejuaraan resmi.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Kembali ke Lembar Cetak KTA</span>
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW & PRINT SHEET */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                
                {/* Toolbar Controls (Print Dimensions, Downloads & Options) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
                  
                  {/* Fixed ID Card Dimension Indicator */}
                  <div className="flex items-center gap-2 bg-red-50/80 px-3 py-1.5 rounded-xl border border-red-200/70 text-red-900">
                    <Maximize2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span className="font-semibold text-xs">
                      Dimensi Fisik ID Card: <strong className="text-red-950 font-bold">CR-80 (85.6 mm × 54.0 mm)</strong>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-700 text-white shrink-0">
                      Standar ISO
                    </span>
                  </div>

                  {/* Export Options (PNG / Image) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadImage('kta-printable-cards-container', `KTA_${user.name.replace(/\s+/g, '_')}_${user.memberId}`)}
                      disabled={isExporting}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Unduh gambar beresolusi tinggi (PNG HD)"
                    >
                      {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      <span>Download Gambar HD (PNG)</span>
                    </button>
                  </div>

                  {/* Checkbox Options */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-700 w-full pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={showCropMarks}
                        onChange={(e) => setShowCropMarks(e.target.checked)}
                        className="rounded text-red-700 focus:ring-red-700 w-3.5 h-3.5"
                      />
                      <span className="font-medium">Garis Potong (Crop Marks)</span>
                    </label>

                    {(layoutMode === 'both_horizontal' || layoutMode === 'both_vertical') && (
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={showFoldGuide}
                          onChange={(e) => setShowFoldGuide(e.target.checked)}
                          className="rounded text-red-700 focus:ring-red-700 w-3.5 h-3.5"
                        />
                        <span className="font-medium">Garis Panduan Lipat</span>
                      </label>
                    )}

                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={showPrintMeta}
                        onChange={(e) => setShowPrintMeta(e.target.checked)}
                        className="rounded text-red-700 focus:ring-red-700 w-3.5 h-3.5"
                      />
                      <span className="font-medium">Info Verifikasi Cetak</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={useEcoTheme}
                        onChange={(e) => setUseEcoTheme(e.target.checked)}
                        className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5"
                      />
                      <Palette className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-bold text-[11px]">Tema Putih Bersih (Hemat Tinta)</span>
                    </label>
                  </div>
                </div>

                {/* ON-SCREEN PRINT SHEET PREVIEW CONTAINER */}
                <div 
                  ref={previewCardRef}
                  className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-300 shadow-xl mx-auto max-w-4xl min-h-[440px] flex flex-col justify-center items-center overflow-x-auto"
                >
                  {renderPrintableDocument(false)}
                </div>

                {/* Bottom Print Action & Callout */}
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-red-900 flex items-center justify-center sm:justify-start gap-1.5">
                      <Printer className="w-4 h-4 text-red-700" />
                      <span>Siap untuk Dicetak ke Kertas Foto atau Kartu PVC?</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Hasil cetak otomatis diisolasi bersih pada lembar A4 (1 halaman tanpa bocor menu/footer).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      Kembali ke Profil
                    </button>
                    <button
                      id="kta-print-action-btn-bottom"
                      onClick={handlePrint}
                      className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-102"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak KTA Sekarang</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};
