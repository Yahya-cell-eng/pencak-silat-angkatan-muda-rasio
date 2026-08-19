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
  Sparkles,
  Bookmark,
  FileText
} from 'lucide-react';

interface ArticleShareModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({ article, isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !article) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pamur.id';

  // WhatsApp share payload
  const whatsappText = `🥋 *${article.title}*\n_${article.category}_\n\n${article.excerpt}\n\n📖 Baca artikel selengkapnya di Portal Resmi PAMUR:\n${currentUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  // Instagram Caption payload
  const instagramCaption = `🥋 ${article.title}\n\n${article.excerpt}\n\n📌 Kategori: ${article.category}\n👤 Penulis: ${article.author}\n\n🔗 Baca artikel selengkapnya melalui tautan di bio/portal resmi PAMUR.\n\n#PAMUR #PencakSilat #PAMURGresik #SilatIndonesia #PesilatPAMUR #IPSI #SeniBeladiri #JurusSilat`;

  // TikTok Caption & Hashtag payload
  const tiktokCaption = `🥋 ${article.title} - ${article.category} PAMUR Gresik! ✊\n\n${article.excerpt.slice(0, 100)}...\n\n#pamur #pencaksilat #silat #pamurgresik #ipsi #beladiri #silatindonesia #fyp #martialarts`;

  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.title} - ${article.excerpt}`,
          url: currentUrl
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopy(currentUrl, 'link');
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
              <h3 className="font-bold text-sm text-slate-900">Bagikan Artikel Ini</h3>
              <p className="text-[11px] text-slate-500">Pilih media sosial untuk menyebarkan warta & materi silat</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Preview Snippet */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-14 h-12 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" 
          />
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-red-700 uppercase">{article.category}</span>
            <h4 className="font-bold text-xs text-slate-900 truncate">{article.title}</h4>
            <p className="text-[11px] text-slate-500 truncate">{article.excerpt}</p>
          </div>
        </div>

        {/* Share Channels */}
        <div className="space-y-3">
          
          {/* 1. WHATSAPP */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">WhatsApp</h4>
                  <p className="text-[10px] text-emerald-700">Kirim langsung ke grup WA ranting / kontak silat</p>
                </div>
              </div>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Buka WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 2. INSTAGRAM */}
          <div className="p-3.5 rounded-xl border border-pink-100 bg-gradient-to-r from-pink-50/40 to-purple-50/40 hover:from-pink-50/70 hover:to-purple-50/70 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
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
                ✓ Teks & tagar siap ditempel (paste) di feed, story, atau caption Instagram Anda!
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

          {/* 4. SALIN LINK & NATIVE SHARE */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy(currentUrl, 'link')}
              className={`flex-1 w-full py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                copiedType === 'link'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedType === 'link' ? 'Tautan Artikel Berhasil Disalin!' : 'Salin Tautan (Link)'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Lainnya</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dukung pelestarian pencak silat Nusantara dengan membagikan materi edukasi resmi PAMUR.
          </p>
        </div>

      </div>
    </div>
  );
};
