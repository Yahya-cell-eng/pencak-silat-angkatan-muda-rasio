import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';

interface ArticleShareModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({ article, isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [isCopyingImage, setIsCopyingImage] = useState<boolean>(false);

  if (!isOpen || !article) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pamur.id';

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

  // WhatsApp share payload including photo/image link for automatic rich media preview
  const whatsappText = `🥋 *${article.title}*\n_${article.category}_\n\n${article.excerpt}\n\n📷 *Foto / Dokumentasi:* ${article.imageUrl}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${currentUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  // Instagram Caption payload with photo guidance
  const instagramCaption = `🥋 ${article.title}\n\n${article.excerpt}\n\n📌 Kategori: ${article.category}\n👤 Penulis: ${article.author}\n\n🔗 Baca artikel selengkapnya melalui portal resmi PAMUR: ${currentUrl}\n\n#PAMUR #PencakSilat #PAMURGresik #SilatIndonesia #PesilatPAMUR #IPSI #SeniBeladiri #JurusSilat`;

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
      // Fallback: Open image in new tab for manual saving
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
      
      // Convert to PNG for clipboard compatibility if needed
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        // Create canvas to ensure PNG format
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
      // Fallback copy image URL
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
        text: `🥋 ${article.title}\n\n${article.excerpt}\n\n📖 Baca selengkapnya di Portal PAMUR:\n${currentUrl}`,
        url: currentUrl
      };

      // Check if browser supports sharing files
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
        // Fallback to text copy
        handleCopy(whatsappText, 'link');
      }
    } finally {
      setIsPreparingShare(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl my-8 text-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Bagikan Artikel & Foto Dokumentasi</h3>
              <p className="text-[11px] text-slate-500">Kirim teks lengkap beserta gambar/foto resmi PAMUR</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article & Image Preview Snippet */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-14 rounded-lg overflow-hidden ring-1 ring-slate-200 shrink-0 bg-slate-200">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[9px] text-white text-center font-bold py-0.5">
                Foto Utama
              </span>
            </div>
            <div className="overflow-hidden flex-1">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">{article.category}</span>
              <h4 className="font-bold text-xs text-slate-900 truncate">{article.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{article.excerpt}</p>
            </div>
          </div>

          {/* Quick Photo Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloadingImage}
              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              title="Unduh foto artikel untuk dilampirkan"
            >
              {isDownloadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (copiedType === 'downloaded_img' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-500" />)}
              <span>{copiedType === 'downloaded_img' ? 'Foto Terunduh!' : 'Unduh Foto'}</span>
            </button>

            <button
              onClick={handleCopyImageToClipboard}
              disabled={isCopyingImage}
              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              title="Salin gambar untuk ditempel ke WhatsApp Web / Dokumen"
            >
              {isCopyingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (copiedType === 'copied_img' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ImageIcon className="w-3.5 h-3.5 text-slate-500" />)}
              <span>{copiedType === 'copied_img' ? 'Foto Disalin!' : 'Salin Foto'}</span>
            </button>
          </div>
        </div>

        {/* Share Channels */}
        <div className="space-y-3">
          
          {/* 1. WHATSAPP (WITH MEDIA & PREVIEW LINK) */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <span>WhatsApp</span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Teks + Foto</span>
                  </h4>
                  <p className="text-[10px] text-emerald-700">Kirim warta & tautan foto ke grup ranting / kontak silat</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim ke WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. INSTAGRAM */}
          <div className="p-3.5 rounded-xl border border-pink-100 bg-gradient-to-r from-pink-50/40 to-purple-50/40 hover:from-pink-50/70 hover:to-purple-50/70 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Instagram (Post / Story / Bio)</h4>
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
                  <span>{copiedType === 'instagram' ? 'Caption Disalin!' : 'Salin Caption IG'}</span>
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
            {copiedType === 'instagram' && (
              <p className="text-[10px] text-emerald-700 font-medium pl-9">
                ✓ Teks & tagar siap ditempel di Instagram! Jangan lupa gunakan tombol <strong>"Unduh Foto"</strong> di atas untuk gambar feed/story.
              </p>
            )}
          </div>

          {/* 3. TIKTOK */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black border border-slate-700 text-cyan-400 flex items-center justify-center font-black text-xs">
                  ♪
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>TikTok</span>
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
            {copiedType === 'tiktok' && (
              <p className="text-[10px] text-cyan-300 font-medium pl-9">
                ✓ Caption TikTok beserta tagar viral silat berhasil disalin ke clipboard!
              </p>
            )}
          </div>

          {/* 4. BAGIKAN DENGAN FOTO (NATIVE SHARE API) & SALIN TAUTAN */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy(`${article.title}\n${article.excerpt}\n\n${currentUrl}`, 'link')}
              className={`flex-1 w-full py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                copiedType === 'link'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedType === 'link' ? 'Teks & Tautan Berhasil Disalin!' : 'Salin Tautan'}</span>
            </button>

            <button
              onClick={handleNativeShareWithPhoto}
              disabled={isPreparingShare}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isPreparingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              <span>{isPreparingShare ? 'Menyiapkan Foto...' : 'Bagikan Bersama Foto'}</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dukung pelestarian pencak silat Nusantara dengan membagikan warta dan foto materi resmi PAMUR.
          </p>
        </div>

      </div>
    </div>
  );
};

