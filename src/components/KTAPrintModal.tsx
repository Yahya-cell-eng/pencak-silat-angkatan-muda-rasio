import React, { useState, useRef } from 'react';
import { User, KTACardConfig, BeltInfo } from '../types';
import { KTACard } from './KTACard';
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
  Palette
} from 'lucide-react';

interface KTAPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  config: KTACardConfig;
  beltInfo?: BeltInfo;
}

export type PrintLayoutMode = 'both_horizontal' | 'both_vertical' | 'front_only' | 'back_only' | 'sheet_a4';

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

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Active configuration (with optional clean white theme for ink saving)
  const activeConfig: KTACardConfig = useEcoTheme
    ? { ...config, themePreset: 'clean_white' }
    : config;

  const handlePrint = () => {
    window.print();
  };

  // Dimensions locked strictly to Standard PVC ID Card 85.6mm x 54mm (CR-80 standard)
  const idCardDimensionClass = 'kta-idcard-print-target w-[325px] sm:w-[340px] md:w-[355px] max-w-[355px] shrink-0';
  const idCardMmLabel = '85.6 mm × 54.0 mm (Standar Fisik ID Card PVC / CR-80)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Header (Hidden on print) */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white shrink-0 print:hidden">
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
                  Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Format cetak standar kartu fisik untuk pesilat <strong className="text-white">{user.name}</strong> ({user.memberId})
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

        {/* Options & Navigation Bar (Hidden on print) */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 shrink-0 print:hidden flex flex-wrap items-center justify-between gap-3 text-xs">
          
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

          {/* Quick Toggle for Instructions */}
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

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-200/60 print:bg-white print:p-0 print:overflow-visible">
          
          {/* INSTRUCTIONS TAB */}
          {activeTab === 'instructions' && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 print:hidden">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Panduan & Rekomendasi Cetak Fisik KTA PAMUR</h4>
                  <p className="text-xs text-slate-500">Agar kartu KTA memiliki hasil cetak tajam, presisi, dan tahan lama.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Rekomendasi Media Kertas</span>
                  </h5>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4 leading-relaxed">
                    <li><strong>Kertas Foto Glossy / Matte (230 - 260 gsm)</strong>: Ideal untuk cetak hemat, lalu dilaminasi panas (hot lamination).</li>
                    <li><strong>PVC ID Card Inkjet (0.76 mm)</strong>: Menghasilkan kartu keras standar ATM/KTP.</li>
                    <li><strong>Kertas Buffalo / Karton Tebal</strong>: Cocok untuk pencetakan dokumen arsip ranting.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Sliders className="w-4 h-4 text-red-700" />
                    <span>2. Pengaturan Dialog Cetak (Browser)</span>
                  </h5>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4 leading-relaxed">
                    <li><strong>Ukuran Kertas</strong>: Pilih <strong>A4</strong>.</li>
                    <li><strong>Skala (Scale)</strong>: Pilih <strong>100% / Default</strong> (Jangan pilih <em>Fit to Page</em> agar ukuran kartu 85.6 × 54 mm tetap akurat).</li>
                    <li><strong>Grafik Latar Belakang</strong>: <strong>Wajib dicentang</strong> agar warna, logo, dan foto tercetak penuh.</li>
                    <li><strong>Kualitas Cetak</strong>: Pilih <em>High / Photo Quality</em>.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Scissors className="w-4 h-4 text-purple-700" />
                    <span>3. Metode Lipat & Laminasi</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed">
                    Gunakan opsi <strong>Dua Sisi Berdampingan</strong>. Setelah dicetak, lipat tepat pada garis putus-putus tengah, lalu potong mengikuti garis sudut luar (crop marks) sebelum dimasukkan ke dalam holder mika KTA (Ukuran B2 / B3).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>4. Verifikasi QR & Barcode</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed">
                    QR Code pada KTA berisi kode otentikasi resmi yang dapat dipindai oleh dewan juri / pelatih saat Ujian Kenaikan Tingkat (UKT) maupun kejuaraan resmi IPSI / PAMUR.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Kembali ke Lembar Cetak KTA</span>
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW & PRINT SHEET */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Toolbar Controls (Print Dimensions & Options) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
                
                {/* Fixed ID Card Dimension Indicator */}
                <div className="flex items-center gap-2 bg-red-50/80 px-3 py-1.5 rounded-xl border border-red-200/70 text-red-900">
                  <Maximize2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                  <span className="font-semibold text-xs">
                    Ukuran ID Card: <strong className="text-red-950 font-bold">CR-80 (85.6 mm × 54.0 mm)</strong>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-700 text-white shrink-0">
                    Standar Fisik
                  </span>
                </div>

                {/* Checkbox Options */}
                <div className="flex flex-wrap items-center gap-4 text-slate-700">
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

                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    <input
                      type="checkbox"
                      checked={useEcoTheme}
                      onChange={(e) => setUseEcoTheme(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5"
                    />
                    <Palette className="w-3 h-3 text-emerald-700" />
                    <span className="font-bold text-[11px]">Tema Putih Bersih (Hemat Tinta)</span>
                  </label>
                </div>
              </div>

              {/* PRINT SHEET CONTAINER */}
              <div 
                id="kta-print-sheet" 
                ref={printAreaRef}
                className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-300 shadow-lg mx-auto max-w-4xl min-h-[480px] flex flex-col justify-center items-center print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0"
              >
                
                {/* Print Sheet Header (Watermark & Identification for Official Documents) */}
                <div className="w-full text-center pb-4 mb-4 border-b border-slate-100 hidden print:block">
                  <h4 className="text-xs font-bold font-serif uppercase tracking-widest text-slate-800">
                    DOKUMEN RESMI KARTU TANDA ANGGOTA &bull; PENCAK SILAT PAMUR
                  </h4>
                  <p className="text-[9px] text-slate-500">
                    Standar Cetak Kartu Fisik &bull; Ukuran: {idCardMmLabel} &bull; Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Cards Container based on Selected Layout */}
                <div className="relative p-4 sm:p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 print:bg-white print:border-none print:p-0">
                  
                  {/* Outer Crop Marks (Top Left, Top Right, Bottom Left, Bottom Right) */}
                  {showCropMarks && (
                    <>
                      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-slate-500 pointer-events-none" />
                      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-slate-500 pointer-events-none" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-slate-500 pointer-events-none" />
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-slate-500 pointer-events-none" />
                    </>
                  )}

                  {/* 1. Both Horizontal (Side-by-Side) */}
                  {layoutMode === 'both_horizontal' && (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 print:flex-row print:gap-4">
                      {/* FRONT CARD */}
                      <div className={`relative ${idCardDimensionClass}`}>
                        <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                          SISI DEPAN (FRONT)
                        </div>
                        <KTACard
                          user={user}
                          config={activeConfig}
                          beltInfo={beltInfo}
                          showBackToggle={false}
                          forceSide="front"
                        />
                      </div>

                      {/* Folding / Separation Line */}
                      {showFoldGuide && (
                        <div className="hidden md:flex print:flex flex-col items-center justify-center py-2 h-full text-slate-400">
                          <div className="w-px h-28 border-r-2 border-dashed border-slate-400" />
                          <div className="p-1 bg-white rounded-full border border-slate-300 text-[8px] font-mono text-slate-500 my-1 whitespace-nowrap shadow-2xs">
                            Garis Lipat Tengah
                          </div>
                          <div className="w-px h-28 border-r-2 border-dashed border-slate-400" />
                        </div>
                      )}

                      {/* BACK CARD */}
                      <div className={`relative ${idCardDimensionClass}`}>
                        <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                          SISI BELAKANG (BACK)
                        </div>
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

                  {/* 2. Both Vertical (Stacked) */}
                  {layoutMode === 'both_vertical' && (
                    <div className="flex flex-col items-center justify-center gap-6 print:gap-4">
                      {/* FRONT CARD */}
                      <div className={`relative ${idCardDimensionClass}`}>
                        <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                          SISI DEPAN (FRONT)
                        </div>
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
                        <div className="w-full flex items-center justify-center gap-2 py-1 text-slate-400">
                          <div className="flex-1 border-t-2 border-dashed border-slate-400" />
                          <span className="text-[8px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-300">
                            Garis Lipat / Potong
                          </span>
                          <div className="flex-1 border-t-2 border-dashed border-slate-400" />
                        </div>
                      )}

                      {/* BACK CARD */}
                      <div className={`relative ${idCardDimensionClass}`}>
                        <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                          SISI BELAKANG (BACK)
                        </div>
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

                  {/* 3. Front Only */}
                  {layoutMode === 'front_only' && (
                    <div className={`relative ${idCardDimensionClass}`}>
                      <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                        SISI DEPAN (FRONT ONLY)
                      </div>
                      <KTACard
                        user={user}
                        config={activeConfig}
                        beltInfo={beltInfo}
                        showBackToggle={false}
                        forceSide="front"
                      />
                    </div>
                  )}

                  {/* 4. Back Only */}
                  {layoutMode === 'back_only' && (
                    <div className={`relative ${idCardDimensionClass}`}>
                      <div className="text-[10px] font-bold text-slate-500 text-center mb-1.5 print:hidden">
                        SISI BELAKANG (BACK ONLY)
                      </div>
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

                {/* Print Metadata Footer */}
                {showPrintMeta && (
                  <div className="mt-6 pt-3 border-t border-slate-200 w-full max-w-xl text-center space-y-0.5 text-[8.5px] text-slate-500 font-mono">
                    <div className="flex items-center justify-between gap-4">
                      <span>PMR ID: <strong>{user.memberId}</strong></span>
                      <span>PESILAT: <strong>{user.name.toUpperCase()}</strong></span>
                      <span>SABUK: <strong>{user.beltRank.toUpperCase()}</strong></span>
                    </div>
                    <div className="text-slate-400 text-[8px] pt-1">
                      KTA Resmi Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) &bull; Dicetak via Portal Silat PAMUR
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Print Action & Callout */}
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-red-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <Printer className="w-4 h-4 text-red-700" />
                    <span>Siap untuk Dicetak ke Kertas Foto atau Kartu PVC?</span>
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Ukuran kartu diatur presisi sesuai standar kartu identitas fisik ({idCardMmLabel}).
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
  );
};

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
