import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  X, 
  RotateCw, 
  Check, 
  Trash2, 
  Image as ImageIcon,
  User as UserIcon,
  AlertCircle,
  Sparkles,
  SwitchCamera
} from 'lucide-react';
import { compressImageToDataUrl } from '../utils/imageCompressor';

interface ProfilePhotoUploaderProps {
  value?: string;
  onChange: (photoUrl: string) => void;
  userName?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  shape?: 'circle' | 'card' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

const PRESET_AVATARS = [
  {
    name: 'Pesilat Pria 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pesilat Wanita 1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pesilat Pria 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pesilat Wanita 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  }
];

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  value = '',
  onChange,
  userName = 'Pesilat PAMUR',
  label = 'Foto Profil / Pas Foto KTA',
  helperText = 'Unggah pas foto formal atau ambil via kamera untuk kartu tanda anggota (KTA).',
  required = false,
  shape = 'circle',
  size = 'md'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'url' | 'presets' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBadge, setSuccessBadge] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState('');

  // Default fallback dicebear avatar if no value
  const defaultInitialsAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName || 'PAMUR')}&backgroundColor=831843,b91c1c,d97706`;
  const currentDisplayPhoto = value || defaultInitialsAvatar;

  // Cleanup camera stream when unmounting or switching tabs
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  // Handle file select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsProcessing(true);

    try {
      // Compress and convert to clean DataURL
      const compressedDataUrl = await compressImageToDataUrl(file, {
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.82,
        squareCrop: true
      });

      onChange(compressedDataUrl);
      setSuccessBadge(true);
      setTimeout(() => setSuccessBadge(false), 2500);
      setActiveTab(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses berkas gambar.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Start Camera
  const startCamera = async () => {
    stopCamera();
    setCameraError('');
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah diaktifkan pada peramban Anda.');
      setIsCameraActive(false);
    }
  };

  // Switch between front/back camera
  const toggleCameraFacing = async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: nextFacing,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Gagal mengganti kamera.');
    }
  };

  // Capture frame from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const minDim = Math.min(video.videoWidth, video.videoHeight) || 360;
      
      canvas.width = 360;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const sourceX = (video.videoWidth - minDim) / 2;
        const sourceY = (video.videoHeight - minDim) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          video,
          sourceX,
          sourceY,
          minDim,
          minDim,
          0,
          0,
          360,
          360
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        onChange(dataUrl);
        stopCamera();
        setActiveTab(null);
        setSuccessBadge(true);
        setTimeout(() => setSuccessBadge(false), 2500);
      }
    } catch (err) {
      setCameraError('Gagal mengambil gambar dari kamera.');
    }
  };

  // Apply URL
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage('Harap masukkan URL foto yang valid.');
      return;
    }
    onChange(urlInput.trim());
    setUrlInput('');
    setActiveTab(null);
    setSuccessBadge(true);
    setTimeout(() => setSuccessBadge(false), 2500);
  };

  // Reset to default initials
  const handleResetToInitials = () => {
    onChange('');
    stopCamera();
    setActiveTab(null);
    setErrorMessage('');
  };

  return (
    <div className="space-y-3">
      {/* Label and Helper */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>{label}</span>
          {required ? (
            <span className="text-red-600 font-bold">*</span>
          ) : (
            <span className="text-[10px] font-normal text-slate-500">(Opsional)</span>
          )}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleResetToInitials}
            className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Gunakan inisial bawaan"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus / Gunakan Inisial</span>
          </button>
        )}
      </div>

      {/* Main Avatar Display & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Preview Frame */}
        <div className="relative group shrink-0">
          <div className={`overflow-hidden border-2 border-red-700/80 shadow-xs bg-white ${
            shape === 'circle' 
              ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-full' 
              : 'w-24 h-32 sm:w-28 sm:h-36 rounded-xl'
          }`}>
            <img
              src={currentDisplayPhoto}
              alt="Preview Foto Anggota"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = defaultInitialsAvatar;
              }}
            />
          </div>

          {/* Quick Overlay Action */}
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'upload') {
                fileInputRef.current?.click();
              } else {
                setActiveTab('upload');
                setTimeout(() => fileInputRef.current?.click(), 50);
              }
            }}
            className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
            title="Klik untuk memilih foto"
          >
            <Camera className="w-5 h-5 mb-1" />
            <span>Ganti Foto</span>
          </button>

          {/* Badge indicator */}
          <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-xs ${
            value ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
          }`}>
            {value ? 'KTA Foto' : 'Inisial'}
          </span>
        </div>

        {/* Buttons & Explanations */}
        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">
              {value ? 'Foto Profil KTA Siap Digunakan' : 'Belum Mengunggah Foto KTA'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {helperText}
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Action Tabs Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
            {/* 1. Upload File Button */}
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab('upload');
                fileInputRef.current?.click();
              }}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-red-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Memproses...' : 'Pilih Berkas'}</span>
            </button>

            {/* 2. Camera Button */}
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'camera') {
                  stopCamera();
                  setActiveTab(null);
                } else {
                  setActiveTab('camera');
                  startCamera();
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-red-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ambil Kamera</span>
            </button>

            {/* 3. Link URL Button */}
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab(activeTab === 'url' ? null : 'url');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-red-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautkan URL</span>
            </button>

            {/* 4. Preset Avatars Button */}
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab(activeTab === 'presets' ? null : 'presets');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-red-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pilihan Karakter</span>
            </button>
          </div>

          {/* Feedback Badges */}
          {successBadge && (
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Foto berhasil dipasang!</span>
            </div>
          )}

          {errorMessage && (
            <div className="text-[11px] text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded-lg border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Panel: Camera Mode */}
      {activeTab === 'camera' && (
        <div className="p-4 bg-slate-900 rounded-xl text-white space-y-3 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold">Kamera Pengambilan Pas Foto KTA</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="Ganti kamera depan / belakang"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span className="text-[11px]">Balik</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Camera Viewfinder */}
          <div className="relative aspect-square max-w-[280px] mx-auto bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Visual Oval/Square Guide */}
                <div className="absolute inset-4 border-2 border-dashed border-red-500/70 rounded-full pointer-events-none flex items-center justify-center">
                  <span className="text-[9px] uppercase font-bold text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                    Posisikan Wajah di Sini
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-4 text-xs text-slate-400">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span>{cameraError || 'Mempersiapkan kamera...'}</span>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          {isCameraActive && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Ambil Foto Sekarang</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Panel: URL Input Mode */}
      {activeTab === 'url' && (
        <form onSubmit={handleApplyUrl} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Tautkan Tautan (URL) Foto Profil</span>
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://contoh.com/foto-pesilat.jpg"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
            >
              Pasang
            </button>
          </div>
        </form>
      )}

      {/* Expanded Panel: Presets Mode */}
      {activeTab === 'presets' && (
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Pilih Avatar Karakter Pesilat</span>
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_AVATARS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setActiveTab(null);
                  setSuccessBadge(true);
                  setTimeout(() => setSuccessBadge(false), 2500);
                }}
                className="p-2 border border-slate-200 hover:border-red-600 rounded-lg flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-red-50/50 transition-all cursor-pointer group"
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
