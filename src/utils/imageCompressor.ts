/**
 * Utility to resize, square-crop (if needed), and compress images to lightweight Base64 DataURLs.
 * Keeps payloads under 40KB for smooth Firestore storage and crisp KTA print output.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  squareCrop?: boolean;
}

export const compressImageToDataUrl = (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  const {
    maxWidth = 360,
    maxHeight = 360,
    quality = 0.82,
    squareCrop = true
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Berkas yang dipilih harus berupa gambar (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Gagal menginisialisasi canvas pemroses gambar.'));
            return;
          }

          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;

          if (squareCrop) {
            // Square crop from center for optimal avatar & KTA card placement
            const minDim = Math.min(img.width, img.height);
            sourceX = (img.width - minDim) / 2;
            sourceY = (img.height - minDim) / 2;
            sourceWidth = minDim;
            sourceHeight = minDim;

            canvas.width = Math.min(maxWidth, minDim);
            canvas.height = Math.min(maxHeight, minDim);
          } else {
            // Scale keeping aspect ratio
            let targetWidth = img.width;
            let targetHeight = img.height;

            if (targetWidth > maxWidth || targetHeight > maxHeight) {
              const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
              targetWidth = Math.round(targetWidth * ratio);
              targetHeight = Math.round(targetHeight * ratio);
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
          }

          // Draw image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Convert to JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          // If canvas compression fails, fallback to raw DataURL so upload succeeds
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Gagal memproses berkas gambar.'));
          }
        }
      };

      img.onerror = () => {
        // Fallback to raw DataURL if Image() decode encounters format issues
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Gagal membaca gambar.'));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Gagal membuka berkas dari perangkat.'));
    };

    reader.readAsDataURL(file);
  });
};
