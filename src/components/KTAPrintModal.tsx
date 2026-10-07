import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, KTACardConfig, BeltInfo } from '../types';
import { KTACard } from './KTACard';
import { toPng } from 'html-to-image';
import { 
  Printer, 
  X, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Maximize2,
  Info,
  Sliders,
  Palette,
  Download,
  Eye,
  Check,
  Loader2,
  CreditCard
} from 'lucide-react';

interface KTAPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  config: KTACardConfig;
  beltInfo?: BeltInfo;
}

export type PrintLayoutMode = 'both_horizontal' | 'front_only' | 'back_only' | 'both_vertical';

export type PrintCardSize = 'cr80' | 'laminating' | 'large';

interface CardSizeSpec {
  id: PrintCardSize;
  name: string;
  badge: string;
  desc: string;
  width: string;
  height: string;
  previewWidthPx: number;
}

export const PRINT_CARD_SIZES: Record<PrintCardSize, CardSizeSpec> = {
  cr80: {
    id: 'cr80',
    name: 'Standar CR-80 (e-KTP / PVC)',
    badge: '85.6 × 54.0 mm',
    desc: 'Standar kartu ATM & e-KTP pas dompet',
    width: '85.6mm',
    height: '54.0mm',
    previewWidthPx: 340,
  },
  laminating: {
    id: 'laminating',
    name: 'Standar Plastik Laminating',
    badge: '90.0 × 57.0 mm',
    desc: 'Sedikit lebih lega, pas mika laminasi panas',
    width: '90.0mm',
    height: '57.0mm',
    previewWidthPx: 360,
  },
  large: {
    id: 'large',
    name: 'Proporsional Jelas A4',
    badge: '95.0 × 60.0 mm',
    desc: 'Ukuran besar, tulisan & detail ekstra tajam',
    width: '95.0mm',
    height: '60.0mm',
    previewWidthPx: 380,
  },
};

export const KTAPrintModal: React.FC<KTAPrintModalProps> = ({
  isOpen,
  onClose,
  user,
  config,
  beltInfo
}) => {
  // Default to pure KTA card shape
  const [layoutMode, setLayoutMode] = useState<PrintLayoutMode>('both_horizontal');
  const [cardSize, setCardSize] = useState<PrintCardSize>('cr80');
  const [printScale, setPrintScale] = useState<number>(100);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(false);
  const [showFoldGuide, setShowFoldGuide] = useState<boolean>(false);
  const [useEcoTheme, setUseEcoTheme] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'instructions'>('preview');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  const selectedSize = PRINT_CARD_SIZES[cardSize];

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
      el.style.setProperty('--kta-card-w', selectedSize.width);
      el.style.setProperty('--kta-card-h', selectedSize.height);
      el.style.setProperty('--kta-scale', `${printScale / 100}`);
    } else {
      document.body.classList.remove('printing-kta');
    }

    return () => {
      document.body.classList.remove('printing-kta');
    };
  }, [isOpen, selectedSize, printScale]);

  if (!isOpen) return null;

  // Active configuration (with optional clean white theme for ink saving)
  const activeConfig: KTACardConfig = useEcoTheme
    ? { ...config, themePreset: 'clean_white' }
    : config;

  const handlePrint = () => {
    window.print();
  };

  // Download high-resolution PNG image (strictly the card itself)
  const handleDownloadImage = async (targetId: string, filename: string) => {
    const node = document.getElementById(targetId);
    if (!node) return;

    try {
      setIsExporting(true);
      setExportSuccess(null);
      
      const dataUrl = await toPng(node, {
        quality: 0.98,
        pixelRatio: 3,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(`Berhasil mengunduh kartu: ${filename}.png`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.info('Gagal mengunduh gambar KTA via toPng, disarankan cetak ke PDF:', err);
      setExportSuccess(`Gagal mengunduh gambar langsung. Silakan gunakan tombol "Cetak KTA" (Simpan sebagai PDF).`);
      setTimeout(() => setExportSuccess(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const idCardMmLabel = '85.6 mm × 54.0 mm (Standar CR-80 PVC)';

  // Printable Document Content (Strictly ONLY the KTA Card Shape)
  const renderPrintableDocument = (isForPortal: boolean = false) => (
    <div 
      id={isForPortal ? 'kta-print-sheet-portal' : 'kta-print-sheet-preview'}
      className={`flex flex-col items-center justify-center text-slate-900 w-full mx-auto ${
        isForPortal ? 'p-0 bg-transparent' : 'p-2 sm:p-4 bg-transparent'
      }`}
      style={{
        boxSizing: 'border-box',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        ['--kta-card-w' as string]: selectedSize.width,
        ['--kta-card-h' as string]: selectedSize.height,
        ['--kta-scale' as string]: `${printScale / 100}`,
      }}
    >
      {/* Pure KTA Cards Container (Zero outer dashed boxes or letterheads) */}
      <div 
        id={isForPortal ? 'kta-printable-cards-container-portal' : 'kta-printable-cards-container'}
        className="relative inline-flex flex-col items-center justify-center p-0 bg-transparent border-0"
        style={{
          boxSizing: 'border-box',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          ['--kta-card-w' as string]: selectedSize.width,
          ['--kta-card-h' as string]: selectedSize.height,
          ['--kta-scale' as string]: `${printScale / 100}`,
        }}
      >
        {/* Optional Outer Corner Crop Marks for manual scissors cutting */}
        {showCropMarks && (
          <>
            <div className="absolute -top-2.5 -left-2.5 w-4 h-4 border-t-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute -top-2.5 -right-2.5 w-4 h-4 border-t-2 border-r-2 border-slate-700 pointer-events-none" />
            <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 border-b-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 border-b-2 border-r-2 border-slate-700 pointer-events-none" />
          </>
        )}

        {/* 1. Layout Mode: DUA SISI BERDAMPINGAN (CR-80 ID Card KTP) */}
        {layoutMode === 'both_horizontal' && (
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 print:gap-2">
            {/* FRONT CARD */}
            <div 
              id={isForPortal ? 'kta-card-front-export-portal' : 'kta-card-front-export'}
              className="kta-print-card-box shrink-0"
              style={{
                width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
                ['--kta-card-w' as string]: selectedSize.width,
                ['--kta-card-h' as string]: selectedSize.height,
                ['--kta-scale' as string]: `${printScale / 100}`,
              }}
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="front"
              />
            </div>

            {/* Optional Hairline Fold Guide */}
            {showFoldGuide && (
              <div className="flex flex-col items-center justify-center px-1 text-slate-400 select-none print:px-0.5">
                <div className="w-px h-16 sm:h-20 border-r-2 border-dashed border-slate-400" />
                <span className="text-[7px] font-mono text-slate-500 bg-white px-1 py-0.5 rounded border border-slate-300 my-0.5 whitespace-nowrap shadow-2xs">
                  Lipat
                </span>
                <div className="w-px h-16 sm:h-20 border-r-2 border-dashed border-slate-400" />
              </div>
            )}

            {/* BACK CARD */}
            <div 
              id={isForPortal ? 'kta-card-back-export-portal' : 'kta-card-back-export'}
              className="kta-print-card-box shrink-0"
              style={{
                width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
                ['--kta-card-w' as string]: selectedSize.width,
                ['--kta-card-h' as string]: selectedSize.height,
                ['--kta-scale' as string]: `${printScale / 100}`,
              }}
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

        {/* 2. Layout Mode: SISI DEPAN SAJA (1 KARTU KTA) */}
        {layoutMode === 'front_only' && (
          <div 
            id={isForPortal ? 'kta-card-front-export-portal' : 'kta-card-front-export'}
            className="kta-print-card-box shrink-0"
            style={{
              width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
              ['--kta-card-w' as string]: selectedSize.width,
              ['--kta-card-h' as string]: selectedSize.height,
              ['--kta-scale' as string]: `${printScale / 100}`,
            }}
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

        {/* 3. Layout Mode: SISI BELAKANG SAJA (1 KARTU KTA) */}
        {layoutMode === 'back_only' && (
          <div 
            id={isForPortal ? 'kta-card-back-export-portal' : 'kta-card-back-export'}
            className="kta-print-card-box shrink-0"
            style={{
              width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
              ['--kta-card-w' as string]: selectedSize.width,
              ['--kta-card-h' as string]: selectedSize.height,
              ['--kta-scale' as string]: `${printScale / 100}`,
            }}
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

        {/* 4. Layout Mode: DUA SISI ATAS-BAWAH */}
        {layoutMode === 'both_vertical' && (
          <div className="flex flex-col items-center justify-center gap-3 print:gap-2">
            {/* FRONT CARD */}
            <div 
              id={isForPortal ? 'kta-card-front-export-portal' : 'kta-card-front-export'}
              className="kta-print-card-box shrink-0"
              style={{
                width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
                ['--kta-card-w' as string]: selectedSize.width,
                ['--kta-card-h' as string]: selectedSize.height,
                ['--kta-scale' as string]: `${printScale / 100}`,
              }}
            >
              <KTACard
                user={user}
                config={activeConfig}
                beltInfo={beltInfo}
                showBackToggle={false}
                forceSide="front"
              />
            </div>

            {showFoldGuide && (
              <div className="w-full flex items-center justify-center gap-2 py-0.5 text-slate-400 select-none">
                <div className="flex-1 border-t-2 border-dashed border-slate-400" />
                <span className="text-[7px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap">
                  Garis Lipat / Potong
                </span>
                <div className="flex-1 border-t-2 border-dashed border-slate-400" />
              </div>
            )}

            {/* BACK CARD */}
            <div 
              id={isForPortal ? 'kta-card-back-export-portal' : 'kta-card-back-export'}
              className="kta-print-card-box shrink-0"
              style={{
                width: isForPortal ? selectedSize.width : `${selectedSize.previewWidthPx}px`,
                ['--kta-card-w' as string]: selectedSize.width,
                ['--kta-card-h' as string]: selectedSize.height,
                ['--kta-scale' as string]: `${printScale / 100}`,
              }}
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
      </div>
    </div>
  );

  return (
    <>
      {/* 1. STANDALONE PRINT PORTAL (Active purely on print: ONLY the KTA Card) */}
      {portalElement && createPortal(renderPrintableDocument(true), portalElement)}

      {/* 2. ON-SCREEN INTERACTIVE MODAL */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 print:hidden">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-100">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold font-serif tracking-wide text-white">
                    Cetak Kartu Tanda Anggota (KTA)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                    Bentuk KTA Murni
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Pesilat: <strong className="text-white font-semibold">{user.name}</strong> ({user.memberId})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="kta-print-action-btn-header"
                onClick={handlePrint}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102"
                title="Cetak KTA langsung (Hanya bentuk kartu)"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Bentuk KTA</span>
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
          <div className="bg-slate-800/80 border-b border-slate-700/80 px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Layout Mode Switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 shadow-2xs">
              <button
                onClick={() => { setLayoutMode('both_horizontal'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  layoutMode === 'both_horizontal' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dua Sisi (Depan & Belakang)</span>
              </button>

              <button
                onClick={() => { setLayoutMode('front_only'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  layoutMode === 'front_only' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Sisi Depan Saja</span>
              </button>

              <button
                onClick={() => { setLayoutMode('back_only'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  layoutMode === 'back_only' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Sisi Belakang Saja</span>
              </button>

              <button
                onClick={() => { setLayoutMode('both_vertical'); setActiveTab('preview'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  layoutMode === 'both_vertical' && activeTab === 'preview'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Atas-Bawah</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-normal bg-emerald-600/90 text-white">
                  Aman A4
                </span>
              </button>
            </div>

            {/* Quick Actions: Petunjuk & Download Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'instructions' ? 'preview' : 'instructions')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
                  activeTab === 'instructions'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Petunjuk Cetak</span>
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70">
            
            {/* INSTRUCTIONS TAB */}
            {activeTab === 'instructions' && (
              <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-5 text-slate-200">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Panduan Cetak Fisik KTA PAMUR (Hanya Bentuk Kartu)</h4>
                    <p className="text-xs text-slate-400">Hasil cetak murni hanya kartu KTA tanpa kop surat atau teks dokumen.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>1. Media Cetak yang Disarankan</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                      <li><strong>PVC ID Card Inkjet (0.76 mm)</strong>: Menghasilkan kartu keras standar ATM/KTP fisik langsung.</li>
                      <li><strong>Kertas Foto Glossy (230 - 260 gsm)</strong>: Sangat hemat, warna tajam, lalu dilaminasi panas (hot lamination).</li>
                      <li><strong>Printer Khusus ID Card (Evolis/Fargo/Zebra)</strong>: Gunakan opsi <em>Sisi Depan Saja</em> atau <em>Belakang Saja</em>.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-1.5 text-sm">
                      <Sliders className="w-4 h-4 text-red-400" />
                      <span>2. Pengaturan Cetak Browser & Printer</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                      <li><strong>Ukuran Kertas</strong>: Pilih <strong>A4</strong> atau <strong>CR-80</strong>.</li>
                      <li><strong>Pilihan Tata Letak</strong>: Disarankan pilih <strong>Atas-Bawah (Aman A4)</strong> jika mencetak 2 sisi pada printer rumahan standar agar sisi samping tidak terpotong tepi kertas.</li>
                      <li><strong>Skala (Scale)</strong>: Gunakan <strong>100% (Asli)</strong>, atau pilih tombol <strong>95% (Anti-Potong)</strong> di atas jika rol kertas printer fisik Anda memotong margin luar.</li>
                      <li><strong>Grafik Latar Belakang (Background Graphics)</strong>: <strong>Wajib dicentang</strong> agar warna & pola guilloche tercetak.</li>
                      <li><strong>Margin</strong>: Pilih <em>None (Nol)</em> atau <em>Minimum</em> pada dialog printer.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Kembali ke Lembar Cetak KTA</span>
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW & PRINT SHEET */}
            {activeTab === 'preview' && (
              <div className="space-y-5">
                
                {/* Action Bar (Download Buttons & Mode Indicator) */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xs flex flex-col gap-3.5 text-xs">
                  
                  {/* Top Row: Card Size Selector & Direct Download */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Physical Size Selector */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Ukuran Fisik:</span>
                      </span>
                      {(Object.keys(PRINT_CARD_SIZES) as PrintCardSize[]).map((sizeKey) => {
                        const s = PRINT_CARD_SIZES[sizeKey];
                        const isActive = cardSize === sizeKey;
                        return (
                          <button
                            key={sizeKey}
                            type="button"
                            onClick={() => setCardSize(sizeKey)}
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer text-xs ${
                              isActive
                                ? 'bg-red-700 text-white border-red-600 shadow-xs'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700'
                            }`}
                            title={s.desc}
                          >
                            <span>{s.name}</span>
                            <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-black/25 text-white' : 'bg-slate-900 text-slate-400'}`}>
                              {s.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Print Scale / Margin Protections */}
                    <div className="flex flex-wrap items-center gap-1.5 pl-0 lg:pl-3 border-t lg:border-t-0 lg:border-l border-slate-800">
                      <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Skala Aman:</span>
                      </span>
                      {[
                        { val: 100, label: '100% (Asli 1:1)', desc: 'Ukuran standar CR-80 pas dompet' },
                        { val: 95, label: '95% (Anti-Potong)', desc: 'Ekstra aman margin printer rumahan / rol kertas' },
                        { val: 90, label: '90% (Kompak)', desc: 'Ukuran ringkas' },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setPrintScale(item.val)}
                          className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs border ${
                            printScale === item.val
                              ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                          }`}
                          title={item.desc}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Direct Card Download Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleDownloadImage('kta-card-front-export', `KTA_Depan_${user.name.replace(/\s+/g, '_')}_${user.memberId}`)}
                        disabled={isExporting}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                        title="Unduh file gambar sisi depan saja"
                      >
                        <Download className="w-3.5 h-3.5 text-red-400" />
                        <span>Unduh Depan (PNG)</span>
                      </button>

                      <button
                        onClick={() => handleDownloadImage('kta-card-back-export', `KTA_Belakang_${user.name.replace(/\s+/g, '_')}_${user.memberId}`)}
                        disabled={isExporting}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                        title="Unduh file gambar sisi belakang saja"
                      >
                        <Download className="w-3.5 h-3.5 text-red-400" />
                        <span>Unduh Belakang (PNG)</span>
                      </button>

                      <button
                        onClick={() => handleDownloadImage('kta-printable-cards-container', `KTA_Lengkap_${user.name.replace(/\s+/g, '_')}_${user.memberId}`)}
                        disabled={isExporting}
                        className="px-3 py-1.5 bg-red-700 hover:bg-red-800 disabled:bg-red-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        title="Unduh gambar KTA lengkap beresolusi tinggi"
                      >
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        <span>Unduh Kartu HD</span>
                      </button>
                    </div>
                  </div>

                  {/* Anti-Cutoff Guarantee Banner */}
                  <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-2 flex items-center gap-2 text-emerald-300 text-[11.5px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Sistem Anti-Terpotong & Pas Foto Kompak Aktif:</strong> Ukuran foto dibuat lebih proporsional & ringkas (16 × 24 mm / rasio 2:3), tipografi ringkas, dan margin aman otomatis memastikan foto, tanda tangan, stempel, biodata & QR code 100% utuh tanpa terpotong saat dicetak.
                    </span>
                  </div>

                  {/* Practical tip if both_horizontal is selected */}
                  {layoutMode === 'both_horizontal' && (
                    <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-amber-300 text-[11px]">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>Tips Kertas A4:</strong> Jika sisi samping kartu terpotong oleh batas rol kertas printer fisik Anda, gunakan opsi <strong>Atas-Bawah (Aman A4)</strong> atau pilih Skala <strong>95%</strong>.
                      </span>
                    </div>
                  )}

                  {/* Options: Garis Lipat & Eco Theme */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-300 w-full pt-1 border-t border-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      <input
                        type="checkbox"
                        checked={useEcoTheme}
                        onChange={(e) => setUseEcoTheme(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-600 w-3.5 h-3.5"
                      />
                      <Palette className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-[11px]">Tema Putih Hemat Tinta</span>
                    </label>

                    {(layoutMode === 'both_horizontal' || layoutMode === 'both_vertical') && (
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={showFoldGuide}
                          onChange={(e) => setShowFoldGuide(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-600 w-3.5 h-3.5"
                        />
                        <span className="font-medium text-xs">Garis Panduan Lipat</span>
                      </label>
                    )}

                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={showCropMarks}
                        onChange={(e) => setShowCropMarks(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-600 w-3.5 h-3.5"
                      />
                      <span className="font-medium text-xs">Garis Sudut Potong (Crop Marks)</span>
                    </label>
                  </div>
                </div>

                {/* ON-SCREEN PRINT SHEET PREVIEW (Pure KTA Cards in Studio View) */}
                <div 
                  ref={previewCardRef}
                  className="bg-slate-900/90 rounded-2xl p-4 sm:p-8 border border-slate-800 shadow-xl mx-auto max-w-4xl min-h-[380px] flex flex-col justify-center items-center overflow-x-auto"
                >
                  {renderPrintableDocument(false)}
                </div>

                {/* Bottom Print Action Callout */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <Printer className="w-4 h-4 text-red-500" />
                      <span>Cetak KTA Tanpa Kop Surat / Bebas Teks Ekstra</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Format cetak diatur murni hanya bentuk kartu KTA (ukuran presisi standar e-KTP CR-80).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      Tutup
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
