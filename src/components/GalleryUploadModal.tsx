import React, { useState, useRef, useEffect } from 'react';
import { GalleryPhoto, GalleryPhotoCategory } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, 
  Link as LinkIcon, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Image as ImageIcon,
  Calendar,
  MapPin,
  Tag,
  RefreshCw,
  SwitchCamera,
  Layers,
  FileText
} from 'lucide-react';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPhoto?: GalleryPhoto | null;
}

const CATEGORIES: GalleryPhotoCategory[] = [
  'Kegiatan & Latihan',
  'Kejuaraan & Prestasi',
  'Ujian Kenaikan Tingkat (UKT)',
  'Tradisi & Seremonial',
  'Latihan Gabungan',
  'Lainnya'
];

const PRESET_SAMPLE_URLS = [
  {
    label: 'Ujian Kenaikan Tingkat (UKT)',
    url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&auto=format&fit=crop&q=80',
    title: 'Evaluasi Jurus Baku UKT Massal',
    location: 'Padepokan PAMUR Gresik',
    category: 'Ujian Kenaikan Tingkat (UKT)' as GalleryPhotoCategory
  },
  {
    label: 'Kejuaraan & Medali',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    title: 'Podium Juara Atlet Tanding PAMUR',
    location: 'GOR Wahana Ekspresi Poesponegoro (WEP) Gresik',
    category: 'Kejuaraan & Prestasi' as GalleryPhotoCategory
  },
  {
    label: 'Latihan Fisik & Kuda-Kuda',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    title: 'Pemantapan Kuda-Kuda & Kelenturan',
    location: 'Halaman Gedung Ranting Manyar',
    category: 'Kegiatan & Latihan' as GalleryPhotoCategory
  },
  {
    label: 'Latihan Bersama Antar Ranting',
    url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1200&auto=format&fit=crop&q=80',
    title: 'Latihan Gabungan Teknik Kuncian & Bantingan',
    location: 'Dojo Ranting Driyorejo',
    category: 'Latihan Gabungan' as GalleryPhotoCategory
  }
];

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  editPhoto
}) => {
  const { createGalleryPhoto, updateGalleryPhoto } = useData();
  const { currentUser } = useAuth();

  const [uploadSource, setUploadSource] = useState<'camera' | 'external_url' | 'file_upload'>('camera');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<GalleryPhotoCategory>('Kegiatan & Latihan');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<string>('Padepokan PAMUR Cabang Gresik');
  const [description, setDescription] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('#PAMURGresik #SilatRasio');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  // Initialize or Reset Form
  useEffect(() => {
    if (editPhoto) {
      setTitle(editPhoto.title || '');
      setCategory(editPhoto.category || 'Kegiatan & Latihan');
      setImageUrl(editPhoto.imageUrl || '');
      setDate(editPhoto.date || new Date().toISOString().split('T')[0]);
      setLocation(editPhoto.location || 'Padepokan PAMUR Cabang Gresik');
      setDescription(editPhoto.description || '');
      setTagsInput(editPhoto.tags ? editPhoto.tags.join(' ') : '#PAMURGresik');
      setUploadSource('external_url');
    } else {
      setTitle('');
      setCategory('Kegiatan & Latihan');
      setImageUrl('');
      setDate(new Date().toISOString().split('T')[0]);
      setLocation('Padepokan PAMUR Cabang Gresik');
      setDescription('');
      setTagsInput('#PAMURGresik #DokumentasiSilat');
      setCapturedPhoto(null);
      setUploadSource('camera');
    }
    setErrorMsg('');
    setCameraError('');
  }, [editPhoto, isOpen]);

  // Clean up camera stream on unmount or tab switch
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle switching away from camera tab
  useEffect(() => {
    if (uploadSource !== 'camera' && cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [uploadSource, cameraStream]);

  // Start Camera
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError('');
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Tidak dapat mengakses kamera perangkat secara langsung. Silakan izinkan izin kamera browser atau gunakan opsi "Unggah Berkas" / "Tautan URL".'
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Toggle Camera Facing Mode (Front / Back)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Snap Photo from Video Stream
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions matching video feed
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to compressed JPEG data url
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    setCapturedPhoto(dataUrl);
    setImageUrl(dataUrl);
    stopCamera();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    setImageUrl('');
    startCamera(facingMode);
  };

  // Handle File Input and compress
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Format berkas tidak valid. Harap pilih berkas gambar (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress using canvas to max 1280px dimension
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setImageUrl(compressedDataUrl);
          setCapturedPhoto(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Preset Selection Helper
  const applyPreset = (preset: typeof PRESET_SAMPLE_URLS[0]) => {
    setImageUrl(preset.url);
    if (!title) setTitle(preset.title);
    if (!location) setLocation(preset.location);
    setCategory(preset.category);
    setErrorMsg('');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!imageUrl.trim()) {
      setErrorMsg('Foto dokumentasi wajib diisi (ambil via kamera, tautkan URL, atau unggah berkas).');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Judul dokumentasi kegiatan wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(/[\s,]+/)
        .filter(t => t.trim().length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`);

      if (editPhoto) {
        // Update existing photo
        const res = await updateGalleryPhoto(editPhoto.id, {
          title: title.trim(),
          category,
          imageUrl: imageUrl.trim(),
          date: date.trim(),
          location: location.trim(),
          description: description.trim(),
          tags
        });

        if (res.success) {
          stopCamera();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        // Create new photo
        const res = await createGalleryPhoto({
          title: title.trim(),
          category,
          imageUrl: imageUrl.trim(),
          date: date.trim(),
          location: location.trim(),
          description: description.trim(),
          tags,
          uploadedBy: currentUser?.name || 'Pengurus PAMUR Gresik'
        });

        if (res.success) {
          stopCamera();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan saat menyimpan foto: ' + (err.message || String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white font-bold shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif tracking-wide text-white">
                {editPhoto ? 'Edit Dokumentasi Foto' : 'Unggah Dokumentasi Kegiatan'}
              </h3>
              <p className="text-xs text-slate-300">
                {editPhoto 
                  ? 'Perbarui metadata foto dokumentasi kegiatan perguruan' 
                  : 'Ambil langsung via Kamera atau tautkan link eksternal foto kegiatan'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Source Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Pilih Sumber Foto Dokumentasi
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setUploadSource('camera')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadSource === 'camera'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Kamera Langsung</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadSource('external_url')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadSource === 'external_url'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link External</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadSource('file_upload')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadSource === 'file_upload'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Berkas</span>
              </button>
            </div>
          </div>

          {/* TAB 1: LIVE CAMERA VIEW */}
          {uploadSource === 'camera' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-red-700" />
                  <span>Jendela Kamera Langsung</span>
                </span>
                {isCameraActive && (
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="text-[11px] font-semibold text-slate-700 hover:text-red-700 flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                    <span>Ganti Kamera ({facingMode === 'environment' ? 'Belakang' : 'Depan'})</span>
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Buka Kamera Bawaan HP / File</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Viewfinder Canvas / Video */}
              <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                {capturedPhoto ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={capturedPhoto} 
                      alt="Foto Terambil" 
                      className="w-full h-full object-contain bg-black"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Foto Berhasil Diambil</span>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Kamera Belum Aktif</p>
                      <p className="text-[11px] text-slate-500">Klik tombol di bawah untuk mengaktifkan kamera laptop / smartphone</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Aktifkan Kamera</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden Canvas for capture processing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                {isCameraActive && (
                  <button
                    type="button"
                    onClick={takeSnapshot}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    <span>Jepret Foto Sekarang (Shutter)</span>
                  </button>
                )}

                {capturedPhoto && (
                  <div className="w-full flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ulangi Pengambilan Foto</span>
                    </button>
                    <span className="text-[11px] text-emerald-700 font-bold px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      ✓ Foto Siap Digunakan
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EXTERNAL URL */}
          {uploadSource === 'external_url' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                Tautan Gambar / URL Eksternal (Unsplash, Direct Image Link, Drive, dll)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau https://..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 font-mono"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Contoh Foto Dokumentasi Siap Pakai:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PRESET_SAMPLE_URLS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-[11px] text-slate-700 hover:text-red-700 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-semibold truncate">{preset.label}</span>
                      <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-red-600 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Preview */}
              {imageUrl && (
                <div className="mt-2 aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200">
                  <img 
                    src={imageUrl} 
                    alt="Preview External" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-mono">
                    Pratinjau Gambar URL
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {uploadSource === 'file_upload' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Berkas Foto dari Komputer atau HP
              </label>

              <label className="border-2 border-dashed border-slate-300 hover:border-red-600 bg-white hover:bg-red-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-red-700 mb-2 transition-colors" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-red-800">
                  Klik untuk Memilih Foto atau Drag & Drop
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Format JPG, PNG, atau WebP (Otomatis Dioptimasi)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {imageUrl && (
                <div className="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200">
                  <img 
                    src={imageUrl} 
                    alt="Preview Upload" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    ✓ Berkas Foto Terpilih
                  </div>
                </div>
              )}
            </div>
          )}

          {/* METADATA FIELDS */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Keterangan & Informasi Kegiatan
            </label>

            {/* Judul */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Foto Dokumentasi <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Ujian Kenaikan Tingkat (UKT) Gabungan Ranting Manyar"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
              />
            </div>

            {/* Kategori & Tanggal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Kegiatan <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GalleryPhotoCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Kegiatan <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi Pelaksanaan Kegiatan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Padepokan PAMUR Gresik / GOR WEP"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi / Catatan Dokumentasi
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan keterangan detail mengenai jalannya acara, peserta yang terlibat, atau hasil kejuaraan..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagar Pencarian (Pisahkan dengan spasi)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#PAMURGresik #UKT2026 #PesilatTangguh"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono text-[11px]"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-102"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{editPhoto ? 'Simpan Perubahan' : 'Terbitkan ke Galeri'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
