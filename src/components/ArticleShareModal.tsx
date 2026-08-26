import React, { useState, useRef } from 'react';
import { Article } from '../types';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  MessageCircle, 
  Instagram, 
  ExternalLink,
  Download,
  Image as ImageIcon,
  Send,
  Sparkles,
  Loader2,
  Eye,
  Layers,
  Smartphone,
  Shield,
  Award,
  Globe
} from 'lucide-react';

interface ArticleShareModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({ article, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'poster' | 'social'>('whatsapp');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [isCopyingImage, setIsCopyingImage] = useState<boolean>(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState<boolean>(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !article) return null;

  // Build deep link URL to open article directly
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pamur.id';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const shareUrl = `${origin}${pathname}?tab=articles&articleId=${article.id}`;

  // Helper to fetch image as File object for native file sharing
  const getImageFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      return new File([blob], `${filename}.${extension}`, { type: blob.type || 'image/jpeg' });
    } catch (err) {
      console.warn('Direct image fetch for share failed (likely CORS), falling back:', err);
      return null;
    }
  };

  // WhatsApp share payload formatted for rich link preview
  const whatsappText = `🥋 *${article.title}*\n_${article.category}_ • PAMUR Cabang Gresik\n\n${article.excerpt}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${shareUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  // Instagram Caption payload with photo guidance
  const instagramCaption = `🥋 ${article.title}\n\n${article.excerpt}\n\n📌 Kategori: ${article.category}\n👤 Penulis: ${article.author}\n\n🔗 Baca artikel selengkapnya melalui portal resmi PAMUR: ${shareUrl}\n\n#PAMUR #PencakSilat #PAMURGresik #SilatIndonesia #PesilatPAMUR #IPSI #SeniBeladiri #JurusSilat #AngkatanMudaRasio`;

  // TikTok Caption & Hashtag payload
  const tiktokCaption = `🥋 ${article.title} - ${article.category} PAMUR Gresik! ✊\n\n${article.excerpt.slice(0, 120)}...\n\n#pamur #pencaksilat #silat #pamurgresik #ipsi #beladiri #silatindonesia #fyp #martialarts`;

  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  // Download Article Photo
  const handleDownloadImage = async () => {
    try {
      setIsDownloadingImage(true);
      const res = await fetch(article.imageUrl, { mode: 'cors' });
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      a.download = `pamur-${cleanSlug || 'artikel'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      setCopiedType('downloaded_img');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      window.open(article.imageUrl, '_blank');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Copy Image directly to Clipboard
  const handleCopyImageToClipboard = async () => {
    try {
      setIsCopyingImage(true);
      const response = await fetch(article.imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = article.imageUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob })
              ]);
              setCopiedType('copied_img');
              setTimeout(() => setCopiedType(null), 2500);
            }
          }, 'image/png');
        }
      } else {
        handleCopy(article.imageUrl, 'copied_img');
      }
    } catch (err) {
      handleCopy(article.imageUrl, 'copied_img');
    } finally {
      setIsCopyingImage(false);
    }
  };

  // Native share with attached photo / image file
  const handleNativeShareWithPhoto = async () => {
    setIsPreparingShare(true);
    try {
      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
      const imageFile = await getImageFile(article.imageUrl, `foto-${cleanSlug}`);

      const shareData: ShareData = {
        title: article.title,
        text: `🥋 ${article.title}\n\n${article.excerpt}\n\n📖 Baca selengkapnya di Portal PAMUR:\n${shareUrl}`,
        url: shareUrl
      };

      if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        shareData.files = [imageFile];
      }

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopy(whatsappText, 'link');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        handleCopy(whatsappText, 'link');
      }
    } finally {
      setIsPreparingShare(false);
    }
  };

  // Generate and Download Poster Card using Canvas
  const handleGeneratePoster = async () => {
    try {
      setIsGeneratingPoster(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Poster Dimensions: 1080 x 1350 (4:5 High Definition Social Ratio)
      canvas.width = 1080;
      canvas.height = 1350;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Gold / Red accents
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1020, 1290);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(44, 44, 992, 1262);

      // Header Banner
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(44, 44, 992, 130);

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('PERGURUAN PENCAK SILAT PAMUR', 540, 105);

      ctx.font = '600 20px sans-serif';
      ctx.fillStyle = '#fecaca';
      ctx.fillText('PENGURUS CABANG GRESIK • JAWA TIMUR', 540, 145);

      // Load and Draw Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = article.imageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => resolve(null);
      });

      // Photo Frame
      ctx.fillStyle = '#020617';
      ctx.fillRect(70, 200, 940, 560);

      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 70, 200, 940, 560);
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(70, 200, 940, 560);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px sans-serif';
        ctx.fillText('Foto Dokumentasi PAMUR', 540, 480);
      }

      // Category Badge on photo
      ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
      ctx.fillRect(90, 220, 260, 48);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(article.category.toUpperCase(), 110, 252);

      // Article Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 44px serif';
      
      // Multi-line wrap title
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      const titleBottom = wrapText(article.title, 540, 830, 920, 56);

      // Excerpt Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(70, Math.min(titleBottom + 10, 960), 940, 180);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 26px sans-serif';
      wrapText(`"${article.excerpt}"`, 540, Math.min(titleBottom + 60, 1010), 880, 40);

      // Footer
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(44, 1220, 992, 86);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORTAL RESMI: WWW.PAMUR.ID • ANGKATAN MUDA RASIO', 540, 1272);

      // Export
      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
        a.download = `poster-pamur-${cleanSlug}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        setCopiedType('poster_downloaded');
        setTimeout(() => setCopiedType(null), 2500);
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Poster generation failed:', err);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-xl space-y-4 shadow-2xl my-6 text-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Bagikan Warta & Foto PAMUR</h3>
              <p className="text-[11px] text-slate-500">Pratinjau tampilan kartu di WhatsApp & media sosial</p>
            </div>
          </div>
          <button 
            id="article-share-modal-close-btn"
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pratinjau WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('poster')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'poster'
                ? 'bg-white text-red-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Poster Siar (HD)</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'social'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram & TikTok</span>
          </button>
        </div>

        {/* TAB 1: WHATSAPP CARD PREVIEW & ACTIONS */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            
            {/* Live WhatsApp Link Preview Card Mockup */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hasil Tampilan di WhatsApp Chat / Grup:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Rich Card Preview
                </span>
              </div>

              {/* Mockup Chat Bubble */}
              <div className="bg-[#e2e8f0]/40 dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
                <div className="max-w-sm mx-auto bg-white dark:bg-[#1f2c34] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 text-left">
                  
                  {/* Big Cover Photo (Matches User's Screenshot) */}
                  <div className="relative aspect-[16/10] w-full bg-slate-800 overflow-hidden group">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                      <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-red-700 text-white shadow-xs">
                        <Shield className="w-2.5 h-2.5" />
                        <span>{article.category}</span>
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white font-serif leading-tight drop-shadow-md mt-1 line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* WhatsApp Rich Snippet Footer Card */}
                  <div className="p-3 bg-slate-50 dark:bg-[#111b21] border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Portal PAMUR Cabang Gresik</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-500 font-mono">
                        <Globe className="w-3 h-3 text-red-600" />
                        <span>pamur.id/artikel/{article.id}</span>
                      </span>
                      <span className="text-[9px] text-slate-400">16.12 ✓✓</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Action Buttons for WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              
              {/* Button 1: Kirim Langsung via WhatsApp API */}
              <a
                id="whatsapp-share-direct-btn"
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-101"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim ke WhatsApp</span>
              </a>

              {/* Button 2: Bagikan bersama file Foto Asli */}
              <button
                id="whatsapp-share-native-photo-btn"
                onClick={handleNativeShareWithPhoto}
                disabled={isPreparingShare}
                className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-101 disabled:opacity-75"
              >
                {isPreparingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                <span>{isPreparingShare ? 'Menyiapkan...' : 'Kirim Foto + Teks'}</span>
              </button>

              {/* Button 3: Salin Teks Format WhatsApp */}
              <button
                onClick={() => handleCopy(whatsappText, 'wa_text')}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedType === 'wa_text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedType === 'wa_text' ? 'Format Teks Tersalin!' : 'Salin Format Teks WA'}</span>
              </button>

              {/* Button 4: Salin Tautan / Link */}
              <button
                onClick={() => handleCopy(shareUrl, 'link')}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedType === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedType === 'link' ? 'Tautan Tersalin!' : 'Salin Tautan Artikel'}</span>
              </button>

            </div>

            {/* Quick Photo Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-500 font-medium shrink-0">Opsi Gambar:</span>
              <button
                onClick={handleDownloadImage}
                disabled={isDownloadingImage}
                className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                {isDownloadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3 text-slate-500" />}
                <span>{copiedType === 'downloaded_img' ? 'Terunduh!' : 'Unduh Foto'}</span>
              </button>

              <button
                onClick={handleCopyImageToClipboard}
                disabled={isCopyingImage}
                className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                {isCopyingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 text-slate-500" />}
                <span>{copiedType === 'copied_img' ? 'Tersalin!' : 'Salin Foto'}</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: POSTER SIAR (HD STORY CARD GENERATOR) */}
        {activeTab === 'poster' && (
          <div className="space-y-4">
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700">
                <h4 className="font-bold text-slate-900">Poster Warta Resmi PAMUR (Rasio HD)</h4>
                <p className="text-slate-600 mt-0.5">
                  Buat kartu grafis otomatis berisi foto, judul, dan kutipan resmi untuk dibagikan ke <strong>WhatsApp Status</strong>, <strong>Instagram Story</strong>, maupun dokumen bulletin.
                </p>
              </div>
            </div>

            {/* Poster Mini Preview */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white text-center border border-slate-800 shadow-lg space-y-3">
              <div className="border border-red-700/60 rounded-xl p-3 bg-slate-950 space-y-2.5">
                <div className="bg-red-700 py-1.5 px-3 rounded text-[10px] font-bold tracking-wider uppercase text-white">
                  Perguruan Pencak Silat PAMUR Gresik
                </div>

                <div className="aspect-[16/9] rounded-lg overflow-hidden relative">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-700 text-[9px] font-black uppercase rounded text-white">
                    {article.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm text-slate-100 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-[11px] text-slate-300 italic line-clamp-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                  "{article.excerpt}"
                </p>

                <div className="text-[9px] text-red-400 font-bold uppercase tracking-wider pt-1">
                  Portal Resmi • www.pamur.id
                </div>
              </div>
            </div>

            {/* Generate & Download Button */}
            <button
              id="generate-hd-poster-btn"
              onClick={handleGeneratePoster}
              disabled={isGeneratingPoster}
              className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-101 disabled:opacity-75"
            >
              {isGeneratingPoster ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isGeneratingPoster ? 'Merender Poster HD...' : (copiedType === 'poster_downloaded' ? 'Poster Berhasil Diunduh!' : 'Unduh Poster Siar HD (Siap Kirim WA & Story)')}</span>
            </button>
          </div>
        )}

        {/* TAB 3: INSTAGRAM & TIKTOK */}
        {activeTab === 'social' && (
          <div className="space-y-3.5">
            {/* Instagram Section */}
            <div className="p-3.5 rounded-2xl border border-pink-200/80 bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-pink-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Instagram (Post / Feed / Story)</h4>
                    <p className="text-[10px] text-slate-500">Salin caption rapi & tagar resmi PAMUR</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(instagramCaption, 'instagram')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      copiedType === 'instagram'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 shadow-xs'
                    }`}
                  >
                    {copiedType === 'instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'instagram' ? 'Caption Disalin!' : 'Salin Caption'}</span>
                  </button>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white border border-pink-200 text-pink-700 rounded-lg hover:bg-pink-50 transition-colors"
                    title="Buka Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* TikTok Section */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-black border border-slate-700 text-cyan-400 flex items-center justify-center font-black text-xs">
                    ♪
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>TikTok Video Caption</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">FYP Tags</span>
                    </h4>
                    <p className="text-[10px] text-slate-300">Format caption video & tagar silat viral</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(tiktokCaption, 'tiktok')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      copiedType === 'tiktok'
                        ? 'bg-emerald-500 text-slate-900'
                        : 'bg-white text-slate-900 hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    {copiedType === 'tiktok' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'tiktok' ? 'Tersalin!' : 'Salin Caption TikTok'}</span>
                  </button>
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                    title="Buka TikTok"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2.5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dukung pelestarian pencak silat Nusantara dengan membagikan warta dan dokumentasi materi resmi PAMUR.
          </p>
        </div>

      </div>
    </div>
  );
};
