import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GalleryPhoto, GalleryPhotoCategory } from '../types';
import { GalleryUploadModal } from './GalleryUploadModal';
import { 
  Camera, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  Download, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Filter, 
  Check, 
  Tag, 
  Copy,
  ExternalLink,
  Layers
} from 'lucide-react';

const CATEGORIES: ('Semua' | GalleryPhotoCategory)[] = [
  'Semua',
  'Kegiatan & Latihan',
  'Kejuaraan & Prestasi',
  'Ujian Kenaikan Tingkat (UKT)',
  'Tradisi & Seremonial',
  'Latihan Gabungan',
  'Lainnya'
];

export const GalleryView: React.FC = () => {
  const { galleryPhotos, deleteGalleryPhoto, likeGalleryPhoto } = useData();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const [selectedCategory, setSelectedCategory] = useState<'Semua' | GalleryPhotoCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Upload & Edit Modal State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  
  // Toast & Action states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Photos List
  const filteredPhotos = useMemo(() => {
    return galleryPhotos.filter(photo => {
      const matchCategory = selectedCategory === 'Semua' || photo.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        photo.title.toLowerCase().includes(query) ||
        (photo.location && photo.location.toLowerCase().includes(query)) ||
        (photo.description && photo.description.toLowerCase().includes(query)) ||
        (photo.tags && photo.tags.some(t => t.toLowerCase().includes(query)));

      return matchCategory && matchSearch;
    });
  }, [galleryPhotos, selectedCategory, searchQuery]);

  // Selected Photo for Lightbox
  const activeLightboxPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    } else {
      setSelectedPhotoIndex(0); // loop
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    } else {
      setSelectedPhotoIndex(filteredPhotos.length - 1); // loop
    }
  };

  // Handle Like Action
  const handleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    likeGalleryPhoto(photoId);
  };

  // Handle Delete Action
  const handleDelete = async (e: React.MouseEvent, photo: GalleryPhoto) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus foto "${photo.title}" dari galeri?`)) {
      const res = await deleteGalleryPhoto(photo.id);
      if (res.success) {
        showToast('Foto dokumentasi berhasil dihapus');
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        }
      } else {
        alert(res.message);
      }
    }
  };

  // Handle Edit
  const handleEdit = (e: React.MouseEvent, photo: GalleryPhoto) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setIsUploadOpen(true);
  };

  // Share photo
  const handleShare = (photo: GalleryPhoto) => {
    const text = `Dokumentasi Pencak Silat PAMUR:\n*${photo.title}*\n📅 ${photo.date} | 📍 ${photo.location || 'Padepokan PAMUR'}\n\nLihat selengkapnya di Galeri Portal Silat PAMUR`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: text,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      showToast('Tautan dan deskripsi foto disalin ke clipboard');
    }
  };

  // Copy Image Link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Tautan gambar berhasil disalin');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-red-900/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-700/80 text-[11px] font-bold uppercase tracking-wider text-red-100 backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Dokumentasi Resmi</span>
              </span>
              <span className="text-xs text-slate-400">Pencak Silat PAMUR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
              Galeri Kegiatan & Prestasi Perguruan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Arsip dokumentasi visual kegiatan latihan, ujian kenaikan tingkat (UKT), kejuaraan tanding/seni, dan tradisi perguruan Silat Angkatan Muda Rasio (PAMUR).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                id="gallery-add-photo-btn"
                onClick={() => {
                  setEditingPhoto(null);
                  setIsUploadOpen(true);
                }}
                className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-950/50 hover:scale-102 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Foto / Ambil Kamera</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Total Dokumentasi</span>
            <span className="text-base font-bold text-white mt-0.5 block">{galleryPhotos.length} Foto</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Kategori Dokumentasi</span>
            <span className="text-base font-bold text-red-400 mt-0.5 block">6 Kategori</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Pengunggah Aktif</span>
            <span className="text-base font-bold text-slate-200 mt-0.5 block">Admin & Dewan Pelatih</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Resolusi Tampilan</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">HD & Multi-Device</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari foto, lokasi, atau tagar..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
            <span>Menampilkan <strong>{filteredPhotos.length}</strong> dari <strong>{galleryPhotos.length}</strong> foto</span>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map((cat) => {
            const count = cat === 'Semua' 
              ? galleryPhotos.length 
              : galleryPhotos.filter(p => p.category === cat).length;
            
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Photos Masonry / Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Dokumentasi Foto</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {searchQuery || selectedCategory !== 'Semua'
                ? 'Tidak ada foto yang sesuai dengan filter atau kata kunci pencarian Anda.'
                : 'Belum ada foto kegiatan yang diunggah ke galeri perguruan.'}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingPhoto(null);
                setIsUploadOpen(true);
              }}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Unggah Foto Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Photo Image Container */}
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                    {photo.category}
                  </span>
                </div>

                {/* Top Action Overlay (Admin & Like) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleLike(e, photo.id)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-700 text-white backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-xs"
                    title="Apresiasi Foto"
                  >
                    <Heart className={`w-3.5 h-3.5 ${photo.likes && photo.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{photo.likes || 0}</span>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-slate-900/80 rounded-lg p-0.5 backdrop-blur-md">
                      <button
                        onClick={(e) => handleEdit(e, photo)}
                        className="p-1 rounded-md hover:bg-white/20 text-white transition-colors"
                        title="Edit Metadata"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, photo)}
                        className="p-1 rounded-md hover:bg-red-600 text-white transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Meta Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-center justify-between text-[11px] text-slate-200">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-red-400" />
                    <span>{photo.date}</span>
                  </span>
                  {photo.location && (
                    <span className="flex items-center gap-1 font-medium truncate max-w-[150px]">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  )}
                </div>

                {/* Tags & Uploaded By */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10.5px]">
                  <div className="flex flex-wrap gap-1">
                    {photo.tags && photo.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-slate-400 italic truncate">
                    Oleh: {photo.uploadedBy || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          
          {/* Top Bar with Close and Details */}
          <div className="absolute top-3 inset-x-3 sm:inset-x-6 flex items-center justify-between z-20 text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-700 text-xs font-bold shadow-sm">
                {activeLightboxPhoto.category}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                {selectedPhotoIndex! + 1} / {filteredPhotos.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(activeLightboxPhoto)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Bagikan Dokumentasi"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              <a
                href={activeLightboxPhoto.imageUrl}
                target="_blank"
                rel="noreferrer"
                download={`PAMUR-${activeLightboxPhoto.title}.jpg`}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Buka / Unduh Resolusi Asli"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-700 text-white transition-colors cursor-pointer"
                title="Tutup Galeri"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prev / Next Nav Buttons */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-red-700 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
            title="Foto Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextPhoto}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-red-700 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
            title="Foto Selanjutnya (Panah Kanan)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Content Modal Container */}
          <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800 shadow-2xl">
            
            {/* Left Image Viewport */}
            <div className="flex-1 bg-black flex items-center justify-center p-2 relative overflow-hidden">
              <img
                src={activeLightboxPhoto.imageUrl}
                alt={activeLightboxPhoto.title}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>

            {/* Right Information Sidebar */}
            <div className="w-full md:w-80 lg:w-96 bg-slate-900 p-5 sm:p-6 text-white flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-slate-800 shrink-0">
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeLightboxPhoto.date}</span>
                  </div>
                  <h2 className="text-lg font-bold font-serif text-white leading-snug">
                    {activeLightboxPhoto.title}
                  </h2>
                </div>

                {activeLightboxPhoto.location && (
                  <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{activeLightboxPhoto.location}</span>
                  </div>
                )}

                {activeLightboxPhoto.description && (
                  <div className="space-y-1">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                      Keterangan Kegiatan
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeLightboxPhoto.description}
                    </p>
                  </div>
                )}

                {activeLightboxPhoto.tags && activeLightboxPhoto.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                      Tagar Terkait
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLightboxPhoto.tags.map((tag, idx) => (
                        <span key={idx} className="text-[11px] font-mono text-red-300 bg-red-950/60 border border-red-900/60 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-2">
                  Diunggah oleh: <strong className="text-slate-400">{activeLightboxPhoto.uploadedBy || 'Admin PAMUR'}</strong>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLike(e, activeLightboxPhoto.id)}
                    className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Apresiasi ({activeLightboxPhoto.likes || 0})</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(activeLightboxPhoto.imageUrl)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                    title="Salin Tautan Foto"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        handleEdit(e, activeLightboxPhoto);
                        setSelectedPhotoIndex(null);
                      }}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Foto</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, activeLightboxPhoto)}
                      className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Gallery Upload / Edit Modal */}
      {isUploadOpen && (
        <GalleryUploadModal
          isOpen={isUploadOpen}
          onClose={() => {
            setIsUploadOpen(false);
            setEditingPhoto(null);
          }}
          editPhoto={editingPhoto}
        />
      )}

    </div>
  );
};
