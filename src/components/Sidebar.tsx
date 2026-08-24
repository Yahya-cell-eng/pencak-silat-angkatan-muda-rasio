import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { openWhatsAppChat } from './WhatsAppContact';
import { 
  Shield, 
  User as UserIcon, 
  LogOut, 
  Calendar, 
  BookOpen, 
  Award, 
  MapPin, 
  Lock, 
  Menu, 
  X, 
  CreditCard, 
  Sparkles,
  Home,
  CheckCircle2,
  Bell,
  MessageCircle,
  ArrowRight,
  LogIn,
  UserPlus,
  Flame,
  ChevronRight,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { config } = useData();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainNavLinks = [
    { id: 'home', label: 'Beranda Utama', icon: Home, badge: 'Utama' },
    { id: 'articles', label: 'Artikel & Warta', icon: BookOpen, badge: 'Edukasi' },
    { id: 'schedules', label: 'Jadwal & Latihan', icon: Calendar, badge: 'Online' },
    { id: 'belts', label: 'Tingkatan Sabuk', icon: Award, badge: 'Kurikulum' },
    { id: 'branches', label: 'Ranting di Gresik', icon: MapPin, badge: 'Lokasi' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileOpen(false);
  };

  const handleAuthAction = (mode: 'login' | 'register') => {
    setIsMobileOpen(false);
    onOpenAuth(mode);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl text-slate-800 select-none overflow-y-auto border-r border-slate-200/80">
      {/* 1. Header Brand Section */}
      <div className="p-5 border-b border-slate-100/90 flex-shrink-0 bg-gradient-to-b from-slate-50/90 via-white to-white">
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {config.logoUrl ? (
            <div className="relative shrink-0">
              <img 
                src={config.logoUrl} 
                alt="Logo PAMUR" 
                className="w-12 h-12 rounded-2xl object-cover border border-red-200 shadow-sm group-hover:scale-105 transition-all duration-300 ring-2 ring-red-100/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-2xl flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-red-700/20 group-hover:scale-105 transition-all duration-300 shrink-0 ring-2 ring-red-200/50">
              P
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold tracking-tight text-slate-900 font-serif leading-tight group-hover:text-red-700 transition-colors truncate">
              {config.shortName || config.appName}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-tight truncate mt-0.5">
              {config.slogan || 'Pencak Silat Angkatan Muda Rasio'}
            </p>
          </div>
        </div>

        {/* System Active Badge */}
        <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate font-semibold">Pengcab Gresik</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50/90 px-2 py-0.5 rounded-full border border-emerald-200/70 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* 2. Announcement Callout (if active) */}
      {config.showAnnouncement && config.announcementText && (
        <div className="mx-4 mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 flex-shrink-0 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <div className="text-[11px] leading-relaxed min-w-0">
              <span className="font-bold text-amber-950 block text-[10px] uppercase tracking-wider">Pengumuman Terkini</span>
              <p className="text-amber-900/90 font-medium text-[10.5px] line-clamp-3 mt-0.5">
                {config.announcementText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Navigation Section */}
      <div className="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto">
        {/* Navigation Group: Menu Utama */}
        <div>
          <div className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Menu Navigasi</span>
            <span className="w-8 h-px bg-slate-200"></span>
          </div>
          <nav className="space-y-1">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`sidebar-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-sm font-bold scale-[1.01]'
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-700'
                    }`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className="truncate">{link.label}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-red-200 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Navigation Group: Area Anggota & Pengurus */}
        <div>
          <div className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Layanan Pesilat</span>
            <span className="w-8 h-px bg-slate-200"></span>
          </div>
          <nav className="space-y-1.5">
            {/* Profil / KTA Digital Link */}
            <button
              id="sidebar-link-profile"
              onClick={() => {
                if (isAuthenticated) {
                  handleNavClick('profile');
                } else {
                  handleAuthAction('login');
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  currentTab === 'profile' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-700'
                }`}>
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span className="truncate">Profil & KTA Digital</span>
              </div>
              {!isAuthenticated && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold border border-slate-200">Login</span>
              )}
            </button>

            {/* Admin Panel (If user is Admin) */}
            {isAdmin && (
              <button
                id="sidebar-link-admin"
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-gradient-to-r from-red-900 to-slate-900 text-white shadow-sm'
                    : 'bg-red-50/90 text-red-800 hover:bg-red-100/90 border border-red-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    currentTab === 'admin' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                  }`}>
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className="truncate">Panel Kelola Admin</span>
                </div>
                <span className="text-[9px] bg-red-700 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-2xs">
                  Admin
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Quick WhatsApp Assistance */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => openWhatsAppChat(
              config.phone || config.contactPhone || '0812-3456-7890', 
              `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin konsultasi seputar kegiatan pencak silat PAMUR.`
            )}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-900 border border-emerald-200/80 hover:border-emerald-300 transition-all text-xs font-semibold cursor-pointer shadow-2xs group hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-emerald-950 leading-tight truncate">WhatsApp Sekretariat</span>
              <span className="block text-[10px] text-emerald-700 font-mono font-medium truncate mt-0.5">{config.phone || config.contactPhone || '0812-3456-7890'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Footer User Profile or Auth Buttons Section */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/90 flex-shrink-0">
        {isAuthenticated && currentUser ? (
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 ring-2 ring-red-100"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-red-700 transition-colors">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                  <span className="font-mono text-red-700 font-bold truncate">{currentUser.memberId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500 font-medium truncate">
                    {currentUser.role === 'admin' ? 'Dewan Guru' : `Sabuk ${currentUser.beltRank}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleNavClick('profile')}
                className="px-2 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-200/80 cursor-pointer"
              >
                <UserIcon className="w-3 h-3 text-slate-500" />
                <span>Profil</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  handleNavClick('home');
                }}
                className="px-2 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 border border-red-200/60 cursor-pointer"
              >
                <LogOut className="w-3 h-3 text-red-600" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              id="sidebar-login-btn"
              onClick={() => handleAuthAction('login')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-[0.99]"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-600" />
              <span>Masuk Akun Pesilat</span>
            </button>

            {config.enablePublicRegistration && (
              <button
                id="sidebar-register-btn"
                onClick={() => handleAuthAction('register')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:to-red-950 text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.99]"
              >
                <UserPlus className="w-3.5 h-3.5 text-red-100" />
                <span>Daftar Anggota Baru</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE TOP HEADER BAR (Only shown on < lg screens)      */}
      {/* ======================================================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-4 py-3 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          {config.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt="Logo PAMUR" 
              className="w-9 h-9 rounded-xl object-cover border border-red-200 shadow-2xs"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-white font-serif font-black text-sm shadow-2xs">
              P
            </div>
          )}
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-slate-900 font-serif">
              {config.shortName || config.appName}
            </h1>
            <p className="text-[9px] text-slate-500 font-medium">
              Pengcab Kab. Gresik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && currentUser ? (
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs"
            >
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
            </button>
          ) : (
            <button
              onClick={() => handleAuthAction('login')}
              className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors shadow-2xs"
            >
              Masuk
            </button>
          )}

          {/* Toggle Mobile Drawer */}
          <button
            id="mobile-sidebar-toggle"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 active:scale-95 transition-all shadow-2xs"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER SLIDEOUT (Animates from left)           */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Slideout Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Close Button Header */}
              <div className="absolute top-4 right-3 z-10">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderSidebarContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Fixed/Sticky on left)       */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white/90 z-30 flex-shrink-0">
        {renderSidebarContent()}
      </aside>
    </>
  );
};
