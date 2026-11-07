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
  Sparkles,
  Loader2,
  Shield,
  Smartphone,
  Globe,
  Layers,
  Send,
  CheckCircle2
} from 'lucide-react';

interface ArticleShareModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export type TopCardRatio = '16:9' | '1:1' | '9:16';

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({ article, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'topcard' | 'whatsapp' | 'social'>('topcard');
  const [selectedRatio, setSelectedRatio] = useState<TopCardRatio>('16:9');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isProcessingCard, setIsProcessingCard] = useState<boolean>(false);
  const [isPreparingShare, setIsPreparingShare] = useState<boolean>(false);

  if (!isOpen || !article) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pamur.id';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const shareUrl = `${origin}${pathname}?tab=articles&articleId=${article.id}`;

  // WhatsApp share formatted text with single canonical link so WhatsApp link preview engine renders the article card & photo cleanly
  const whatsappText = `🥋 *${article.title}*\n_${article.category}_ • PAMUR Cabang Gresik\n\n${article.excerpt}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${shareUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  // Instagram Caption payload
  const instagramCaption = `🥋 ${article.title}\n\n${article.excerpt}\n\n📌 Kategori: ${article.category}\n👤 Penulis: ${article.author}\n\n🔗 Baca artikel selengkapnya melalui portal resmi PAMUR: ${shareUrl}\n\n#PAMUR #PencakSilat #PAMURGresik #SilatIndonesia #PesilatPAMUR #IPSI #SeniBeladiri #JurusSilat #AngkatanMudaRasio`;

  // TikTok Caption payload
  const tiktokCaption = `🥋 ${article.title} - ${article.category} PAMUR Gresik! ✊\n\n${article.excerpt.slice(0, 120)}...\n\n#pamur #pencaksilat #silat #pamurgresik #ipsi #beladiri #silatindonesia #fyp #martialarts`;

  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  /**
   * Safely loads an image without tainting the canvas using Blob fetching or CORS
   */
  const loadSafeImage = async (url: string): Promise<HTMLImageElement | null> => {
    if (!url) return null;

    // Fast-path for base64 Data URLs
    if (url.startsWith('data:')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    }

    // 1. Try to fetch as Blob and create ObjectURL (bulletproof against canvas cross-origin taint)
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = reject;
          img.src = objUrl;
        });
        return img;
      }
    } catch {
      // Fallback to Image() with anonymous CORS
    }

    // 2. Try Image() with crossOrigin anonymous
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = reject;
        img.src = url;
      });
      if (img.complete && img.naturalWidth > 0) {
        return img;
      }
    } catch {
      // Fallback
    }

    // 3. Fallback: try loading directly without crossOrigin
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = reject;
        img.src = url;
      });
      if (img.complete && img.naturalWidth > 0) {
        return img;
      }
    } catch {
      // Fallback
    }

    return null;
  };

  /**
   * Pure procedural fallback generator when external images are strictly blocked by CORS.
   * Guarantees 100% successful canvas.toBlob() export with martial arts branding.
   */
  const generateProceduralCardBlob = (ratio: TopCardRatio): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        let width = 1200;
        let height = ratio === '1:1' ? 1080 : ratio === '9:16' ? 1920 : 675;
        if (ratio === '1:1') width = 1080;
        if (ratio === '9:16') width = 1080;

        canvas.width = width;
        canvas.height = height;

        // Rich Martial Arts Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#450a0a');
        bgGrad.addColorStop(0.35, '#1e1b4b');
        bgGrad.addColorStop(0.7, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Header Strip
        const headerHeight = Math.round(height * (ratio === '9:16' ? 0.08 : 0.11));
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(0, 0, width, headerHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(headerHeight * 0.38)}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('PERGURUAN PENCAK SILAT PAMUR', width / 2, headerHeight * 0.52);

        ctx.font = `600 ${Math.round(headerHeight * 0.22)}px sans-serif`;
        ctx.fillStyle = '#fecaca';
        ctx.fillText('PENGURUS CABANG GRESIK • RESMI IPSI', width / 2, headerHeight * 0.82);

        // Draw martial arts emblem art in the center
        const centerY = height * 0.38;
        ctx.save();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(width / 2, centerY, 90, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(width / 2, centerY, 75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAMUR', width / 2, centerY + 12);
        ctx.restore();

        // Category Badge
        const catY = centerY + 130;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(40, catY, 320, 42);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(article.category.toUpperCase(), 56, catY + 28);

        // Title
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 38px serif';
        ctx.fillText(article.title.slice(0, 50), 40, catY + 80);

        // Excerpt
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px sans-serif';
        ctx.fillText(article.excerpt.slice(0, 80) + '...', 40, catY + 125);

        // Footer Strip
        const footerHeight = Math.round(height * 0.1);
        const footerY = height - footerHeight;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, footerY, width, footerHeight);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`Penulis: ${article.author} • PAMUR Cabang Gresik`, 40, footerY + footerHeight * 0.58);

        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'right';
        ctx.fillText('BACA DI: WWW.PAMUR.ID', width - 40, footerY + footerHeight * 0.58);

        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.94);
      } catch {
        resolve(null);
      }
    });
  };

  /**
   * Generates a high-definition Top Card image on an HTML5 Canvas
   * and returns a Blob for download, clipboard copy, or native sharing.
   */
  const generateTopCardBlob = async (ratio: TopCardRatio): Promise<Blob | null> => {
    return new Promise(async (resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(await generateProceduralCardBlob(ratio));

        let width = 1200;
        let height = 675; // 16:9 default (WhatsApp / OpenGraph standard)

        if (ratio === '1:1') {
          width = 1080;
          height = 1080;
        } else if (ratio === '9:16') {
          width = 1080;
          height = 1920;
        }

        canvas.width = width;
        canvas.height = height;

        // Background dark gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.5, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Header Strip (Red & Gold)
        const headerHeight = Math.round(height * (ratio === '9:16' ? 0.08 : 0.11));
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(0, 0, width, headerHeight);

        // Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(headerHeight * 0.38)}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('PERGURUAN PENCAK SILAT PAMUR', width / 2, headerHeight * 0.52);

        ctx.font = `600 ${Math.round(headerHeight * 0.22)}px sans-serif`;
        ctx.fillStyle = '#fecaca';
        ctx.fillText('PENGURUS CABANG GRESIK • RESMI IPSI', width / 2, headerHeight * 0.82);

        // Load Article Image Safely
        const img = await loadSafeImage(article.imageUrl);

        // Top Image dimensions
        const imgY = headerHeight;
        const imgHeight = Math.round(height * (ratio === '16:9' ? 0.56 : ratio === '1:1' ? 0.52 : 0.44));

        if (img && img.naturalWidth > 0) {
          const imgW = img.naturalWidth;
          const imgH = img.naturalHeight;
          const imgRatio = imgW / imgH;
          const targetRatio = width / imgHeight;

          let drawW = width;
          let drawH = imgHeight;
          let drawX = 0;
          let drawY = imgY;

          if (imgRatio > targetRatio) {
            // Image is wider than container: crop horizontal sides to center
            drawW = imgHeight * imgRatio;
            drawX = (width - drawW) / 2;
          } else {
            // Image is taller than container: crop vertical top/bottom to center
            drawH = width / imgRatio;
            drawY = imgY + (imgHeight - drawH) / 2;
          }

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, imgY, width, imgHeight);
          ctx.clip();
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();
        } else {
          // Elegant procedural fallback box
          const photoFallbackGrad = ctx.createLinearGradient(0, imgY, width, imgY + imgHeight);
          photoFallbackGrad.addColorStop(0, '#1e293b');
          photoFallbackGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = photoFallbackGrad;
          ctx.fillRect(0, imgY, width, imgHeight);
          
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 32px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🥋 PAMUR CABANG GRESIK', width / 2, imgY + imgHeight * 0.45);
          
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px sans-serif';
          ctx.fillText('Dokumentasi Resmi & Warta Perguruan Pencak Silat', width / 2, imgY + imgHeight * 0.58);
        }

        // Smooth Vignette/Gradient overlay over bottom of the photo
        const imgFade = ctx.createLinearGradient(0, imgY + imgHeight - 160, 0, imgY + imgHeight);
        imgFade.addColorStop(0, 'rgba(9, 13, 22, 0)');
        imgFade.addColorStop(0.7, 'rgba(9, 13, 22, 0.7)');
        imgFade.addColorStop(1, '#090d16');
        ctx.fillStyle = imgFade;
        ctx.fillRect(0, imgY + imgHeight - 160, width, 160);

        // Category Badge
        const catBadgeY = imgY + imgHeight - 36;
        ctx.fillStyle = '#dc2626';
        const badgeWidth = Math.min(width * 0.45, 340);
        ctx.fillRect(40, catBadgeY, badgeWidth, 42);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(article.category.toUpperCase(), 56, catBadgeY + 28);

        // Helper text wrap function
        const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 3) => {
          const words = text.split(' ');
          let line = '';
          let currentY = y;
          let linesDrawn = 0;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              linesDrawn++;
              if (linesDrawn >= maxLines) {
                ctx.fillText(line.trim() + '...', x, currentY);
                return currentY + lineHeight;
              }
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

        // Title Section
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        const titleFontSize = ratio === '16:9' ? 38 : ratio === '1:1' ? 42 : 46;
        ctx.font = `bold ${titleFontSize}px serif`;
        const titleStartY = catBadgeY + 74;
        const titleBottom = wrapText(article.title, 40, titleStartY, width - 80, titleFontSize * 1.25, ratio === '16:9' ? 2 : 3);

        // Excerpt Section
        ctx.fillStyle = '#cbd5e1';
        const excerptFontSize = ratio === '16:9' ? 21 : 24;
        ctx.font = `normal ${excerptFontSize}px sans-serif`;
        const excerptStartY = titleBottom + 12;
        wrapText(article.excerpt, 40, excerptStartY, width - 80, excerptFontSize * 1.35, ratio === '16:9' ? 2 : 3);

        // Bottom Footer Strip
        const footerHeight = Math.round(height * (ratio === '9:16' ? 0.07 : 0.10));
        const footerY = height - footerHeight;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, footerY, width, footerHeight);

        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, footerY);
        ctx.lineTo(width, footerY);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Penulis: ${article.author} • ${article.createdAt || 'Resmi'}`, 40, footerY + footerHeight * 0.58);

        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'right';
        ctx.fillText('BACA DI: WWW.PAMUR.ID', width - 40, footerY + footerHeight * 0.58);

        // Try converting to Blob; if tainted canvas throws SecurityError, fallback smoothly
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              generateProceduralCardBlob(ratio).then(resolve);
            }
          }, 'image/jpeg', 0.94);
        } catch {
          // Canvas was tainted by crossOrigin image, fallback to procedural card
          const fallbackBlob = await generateProceduralCardBlob(ratio);
          resolve(fallbackBlob);
        }
      } catch (err) {
        console.error('Error generating Top Card:', err);
        const fallbackBlob = await generateProceduralCardBlob(ratio);
        resolve(fallbackBlob);
      }
    });
  };

  // Download the generated Top Card
  const handleDownloadTopCard = async () => {
    setIsProcessingCard(true);
    try {
      const blob = await generateTopCardBlob(selectedRatio);
      if (!blob) throw new Error('Gagal merender kartu');

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
      const ratioName = selectedRatio === '16:9' ? 'wa-landscape' : selectedRatio === '1:1' ? 'ig-feed' : 'ig-story';
      a.download = `pamur-topcard-${cleanSlug}-${ratioName}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setCopiedType('card_downloaded');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      alert('Gagal mengunduh gambar kartu. Silakan coba lagi.');
    } finally {
      setIsProcessingCard(false);
    }
  };

  // Download the Original Article Photo
  const handleDownloadOriginalPhoto = async () => {
    setIsProcessingCard(true);
    try {
      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
      const fileName = `pamur-foto-${cleanSlug}.jpg`;
      const isDataUrl = article.imageUrl?.startsWith('data:');
      const res = await fetch(article.imageUrl, isDataUrl ? undefined : { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        setCopiedType('original_downloaded');
        setTimeout(() => setCopiedType(null), 2500);
        return;
      }
      throw new Error('Direct download fallback');
    } catch {
      window.open(article.imageUrl, '_blank');
      setCopiedType('original_downloaded');
      setTimeout(() => setCopiedType(null), 2500);
    } finally {
      setIsProcessingCard(false);
    }
  };

  // Share Original Article Photo directly to WhatsApp
  const handleShareWhatsAppOriginalPhoto = async () => {
    setIsPreparingShare(true);
    try {
      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
      const fileName = `pamur-foto-${cleanSlug}.jpg`;
      const isDataUrl = article.imageUrl?.startsWith('data:');
      const res = await fetch(article.imageUrl, isDataUrl ? undefined : { mode: 'cors' });
      
      if (res.ok) {
        const blob = await res.blob();
        const imageFile = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
        const captionText = `🥋 *${article.title}*\n_${article.category}_ • PAMUR Cabang Gresik\n\n${article.excerpt}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${shareUrl}`;

        if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
          await navigator.share({
            files: [imageFile],
            title: article.title,
            text: captionText,
          });
          setCopiedType('wa_shared');
          setTimeout(() => setCopiedType(null), 3500);
          return;
        }

        // Desktop fallback: copy to clipboard & download & open WhatsApp
        try {
          if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
            const pngBlob = await convertBlobToPng(blob);
            if (pngBlob) {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
            }
          }
        } catch {}

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        window.open(whatsappShareUrl, '_blank');
        setCopiedType('desktop_wa_guided');
        setTimeout(() => setCopiedType(null), 8000);
        return;
      }
      window.open(whatsappShareUrl, '_blank');
    } catch {
      window.open(whatsappShareUrl, '_blank');
    } finally {
      setIsPreparingShare(false);
    }
  };

  // Copy generated Top Card directly to Clipboard
  const handleCopyTopCardImage = async () => {
    setIsProcessingCard(true);
    try {
      const blob = await generateTopCardBlob(selectedRatio);
      if (!blob) throw new Error('Gagal merender kartu');

      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        // Must be png for clipboard image in most browsers
        const img = new Image();
        const blobUrl = URL.createObjectURL(blob);
        img.src = blobUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob })
              ]);
              setCopiedType('card_copied');
              setTimeout(() => setCopiedType(null), 2500);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(blobUrl);
      } else {
        handleCopy(shareUrl, 'link');
      }
    } catch (err) {
      handleCopy(shareUrl, 'link');
    } finally {
      setIsProcessingCard(false);
    }
  };

  // Convert blob to PNG for clipboard image pasting
  const convertBlobToPng = async (blob: Blob): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(resolve, 'image/png');
        } else {
          resolve(null);
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  };

  // Primary: Share directly to WhatsApp with the Image attached
  const handleShareWhatsAppWithImage = async () => {
    setIsPreparingShare(true);
    try {
      const blob = await generateTopCardBlob(selectedRatio);
      if (!blob) throw new Error('Gagal merender kartu gambar');

      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
      const fileName = `pamur-topcard-${cleanSlug}.jpg`;
      const imageFile = new File([blob], fileName, { type: 'image/jpeg' });

      const captionText = `🥋 *${article.title}*\n_${article.category}_ • PAMUR Cabang Gresik\n\n${article.excerpt}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${shareUrl}`;

      // Check if Web Share API with files is supported (Android, iPhone, iPad, etc.)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          files: [imageFile],
          title: article.title,
          text: captionText,
        });
        setCopiedType('wa_shared');
        setTimeout(() => setCopiedType(null), 3500);
        return;
      }

      // Desktop browser fallback:
      // 1. Copy image to Clipboard so user can directly paste (Ctrl+V) in WhatsApp Web
      try {
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          const pngBlob = await convertBlobToPng(blob);
          if (pngBlob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob })
            ]);
          }
        }
      } catch (clipErr) {
        console.warn('Clipboard write error:', clipErr);
      }

      // 2. Automatically download image file so it is saved in downloads folder
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      // 3. Open WhatsApp Web / App
      window.open(whatsappShareUrl, '_blank');

      // 4. Show clear instructions
      setCopiedType('desktop_wa_guided');
      setTimeout(() => setCopiedType(null), 8000);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        window.open(whatsappShareUrl, '_blank');
      }
    } finally {
      setIsPreparingShare(false);
    }
  };

  // Native share with generated Top Card File attached to other apps
  const handleNativeShareTopCard = async () => {
    setIsPreparingShare(true);
    try {
      const blob = await generateTopCardBlob(selectedRatio);
      if (!blob) throw new Error('Gagal merender kartu');

      const cleanSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
      const imageFile = new File([blob], `pamur-topcard-${cleanSlug}.jpg`, { type: 'image/jpeg' });

      const captionText = `🥋 *${article.title}*\n_${article.category}_ • PAMUR Cabang Gresik\n\n${article.excerpt}\n\n📖 *Baca Selengkapnya di Portal PAMUR:*\n${shareUrl}`;

      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          files: [imageFile],
          title: article.title,
          text: captionText,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: captionText,
          url: shareUrl,
        });
      } else {
        window.open(whatsappShareUrl, '_blank');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        window.open(whatsappShareUrl, '_blank');
      }
    } finally {
      setIsPreparingShare(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-xl space-y-4 shadow-2xl my-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif">
                Bagikan Artikel & Image Top Card
              </h3>
              <p className="text-[11px] text-slate-500">
                Format kartu grafis khusus WhatsApp, Instagram, dan media sosial
              </p>
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

        {/* Real-time Feedback Notifications */}
        {copiedType === 'desktop_wa_guided' && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900">Gambar kartu artikel telah diunduh & disalin ke clipboard!</p>
              <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                WhatsApp Web telah terbuka. Cukup tekan <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-emerald-300 font-mono font-bold text-emerald-950 shadow-2xs">Ctrl + V</kbd> pada kolom chat untuk langsung melampirkan gambar beserta teks.
              </p>
            </div>
          </div>
        )}

        {copiedType === 'wa_shared' && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Artikel beserta gambar berhasil dibagikan ke WhatsApp!</span>
          </div>
        )}

        {copiedType === 'original_downloaded' && (
          <div className="p-3 bg-blue-50 border border-blue-300 rounded-2xl text-blue-950 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold">Foto dokumentasi asli artikel berhasil diunduh!</span>
          </div>
        )}

        {copiedType === 'card_downloaded' && (
          <div className="p-3 bg-red-50 border border-red-300 rounded-2xl text-red-950 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">Kartu gambar artikel kualitas tinggi (HD) berhasil diunduh!</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('topcard')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'topcard'
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Image Top Card</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Teks WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram & TikTok</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: IMAGE TOP CARD GENERATOR (WA, IG, STORY)          */}
        {/* ======================================================== */}
        {activeTab === 'topcard' && (
          <div className="space-y-4">
            
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-red-700" />
                <span>Pilih Format Kartu:</span>
              </span>

              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedRatio('16:9')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                    selectedRatio === '16:9'
                      ? 'bg-red-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Landscape 16:9 / 1200x675 untuk WhatsApp Chat & Web Link Card"
                >
                  WhatsApp (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRatio('1:1')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                    selectedRatio === '1:1'
                      ? 'bg-red-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Square 1:1 / 1080x1080 untuk Instagram Feed"
                >
                  Feed (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRatio('9:16')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                    selectedRatio === '9:16'
                      ? 'bg-red-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vertical 9:16 / 1080x1920 untuk IG Story & Status"
                >
                  Story (9:16)
                </button>
              </div>
            </div>

            {/* Interactive Live Top Card Preview */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left shadow-lg overflow-hidden">
              <div 
                className={`mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-700/80 shadow-md flex flex-col justify-between transition-all duration-300 ${
                  selectedRatio === '16:9'
                    ? 'w-full max-w-md aspect-[16/9]'
                    : selectedRatio === '1:1'
                    ? 'w-64 sm:w-72 aspect-square'
                    : 'w-52 sm:w-60 aspect-[9/16]'
                }`}
              >
                {/* Header Strip */}
                <div className="bg-red-800 text-white px-3 py-1 flex items-center justify-between text-[9px] font-bold tracking-wider uppercase shrink-0">
                  <span className="flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-white" />
                    <span>PAMUR GRESIK</span>
                  </span>
                  <span className="text-red-200">RESMI IPSI</span>
                </div>

                {/* Hero Image on Top */}
                <div className="relative flex-1 bg-slate-800 overflow-hidden min-h-[90px]">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Category Chip over Image */}
                  <span className="absolute bottom-2 left-2.5 px-2 py-0.5 bg-red-700 text-white text-[9px] font-bold uppercase rounded shadow-xs">
                    {article.category}
                  </span>
                </div>

                {/* Content Section below Top Image */}
                <div className="p-3 bg-slate-950 space-y-1 shrink-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white font-serif leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  {/* Card Bottom Meta */}
                  <div className="pt-1.5 flex items-center justify-between text-[8.5px] text-slate-400 border-t border-slate-800/80">
                    <span>{article.author} &bull; {article.createdAt || 'Resmi'}</span>
                    <span className="text-red-400 font-mono font-bold">pamur.id</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-2.5">
                Pratinjau kartu grafis berkualitas tinggi siap diposting ke WhatsApp, Instagram, dan status media sosial.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              
              {/* Highlight Button: Kirim ke WhatsApp Beserta Gambar */}
              <button
                id="btn-share-whatsapp-with-image"
                type="button"
                onClick={handleShareWhatsAppWithImage}
                disabled={isPreparingShare || isProcessingCard}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg disabled:opacity-75"
              >
                {isPreparingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                <span>Kirim ke WhatsApp Beserta Gambar</span>
              </button>

              {/* Secondary Actions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Button 2: Unduh Gambar Top Card (HD) */}
                <button
                  id="btn-download-topcard"
                  type="button"
                  onClick={handleDownloadTopCard}
                  disabled={isProcessingCard}
                  className="py-2.5 px-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-101 disabled:opacity-75"
                >
                  {isProcessingCard ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'card_downloaded' ? 'Terunduh!' : 'Unduh Kartu'}</span>
                </button>

                {/* Button 3: Unduh Foto Asli Artikel */}
                <button
                  id="btn-download-original-photo"
                  type="button"
                  onClick={handleDownloadOriginalPhoto}
                  disabled={isProcessingCard}
                  className="py-2.5 px-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-101 disabled:opacity-75"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span>{copiedType === 'original_downloaded' ? 'Terunduh!' : 'Unduh Foto'}</span>
                </button>

                {/* Button 4: Salin Gambar ke Clipboard */}
                <button
                  type="button"
                  onClick={handleCopyTopCardImage}
                  disabled={isProcessingCard}
                  className="py-2.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedType === 'card_copied' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedType === 'card_copied' ? 'Tersalin!' : 'Salin (Ctrl+V)'}</span>
                </button>

                {/* Button 5: Bagikan Langsung via Web Share API */}
                <button
                  id="btn-share-topcard-native"
                  type="button"
                  onClick={handleNativeShareTopCard}
                  disabled={isPreparingShare}
                  className="py-2.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-101 disabled:opacity-75"
                >
                  {isPreparingShare ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>Bagikan App</span>
                </button>

              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: WHATSAPP TEXT FORMAT & LINK                       */}
        {/* ======================================================== */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            
            {/* Chat Bubble Mockup */}
            <div className="bg-[#e2e8f0]/40 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
              <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 text-left">
                
                <div className="relative aspect-[16/10] w-full bg-slate-800 overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                    <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-red-700 text-white shadow-xs">
                      <Shield className="w-2.5 h-2.5" />
                      <span>{article.category}</span>
                    </span>
                    <h3 className="text-sm font-bold text-white font-serif leading-tight drop-shadow-md mt-1 line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                    <span className="font-bold text-slate-800">Portal PAMUR Gresik</span>
                    <span>•</span>
                    <span>{article.createdAt}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
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

            {/* Actions for WhatsApp */}
            <div className="space-y-2 pt-1">
              {/* Primary: Kirim Top Card Gambar ke WA */}
              <button
                id="whatsapp-share-with-image-btn"
                type="button"
                onClick={handleShareWhatsAppWithImage}
                disabled={isPreparingShare || isProcessingCard}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg disabled:opacity-75"
              >
                {isPreparingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                <span>Kirim Kartu Grafis (Top Card HD) ke WhatsApp</span>
              </button>

              {/* Secondary Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsAppOriginalPhoto}
                  disabled={isPreparingShare}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>Kirim Foto Asli ke WA</span>
                </button>

                <button
                  onClick={() => handleCopy(whatsappText, 'wa_text')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedType === 'wa_text' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedType === 'wa_text' ? 'Teks Tersalin!' : 'Salin Teks Pesan'}</span>
                </button>

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buka Chat WA</span>
                </a>
              </div>

              <p className="text-[10px] text-slate-500 text-center pt-1">
                💡 Tombol hijau otomatis melampirkan berkas gambar artikel langsung ke dalam obrolan WhatsApp.
              </p>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INSTAGRAM & TIKTOK CAPTIONS                       */}
        {/* ======================================================== */}
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
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

            {/* Quick Share to Telegram, Facebook, and X/Twitter */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🥋 ${article.title}\n\n${article.excerpt}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Telegram</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🥋 ${article.title} - PAMUR Pencak Silat`)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="font-bold text-xs">𝕏</span>
                <span>Twitter / X</span>
              </a>
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
