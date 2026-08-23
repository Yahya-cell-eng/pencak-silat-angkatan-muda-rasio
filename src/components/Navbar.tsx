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
  ChevronDown,
  Sparkles,
  Home,
  CheckCircle2,
  Bell,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { config } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'articles', label: 'Artikel & Warta', icon: BookOpen },
    { id: 'schedules', label: 'Jadwal & Latihan', icon: Calendar },
    { id: 'belts', label: 'Tingkatan Sabuk', icon: Award },
    { id: 'branches', label: 'Ranting di Gresik', icon: MapPin },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar / Header info */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {config.showAnnouncement && config.announcementText ? (
              <span className="font-medium text-amber-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Bell className="w-3 h-3 shrink-0 text-amber-400 animate-bounce" />
                <span className="truncate">{config.announcementText}</span>
              </span>
            ) : (
              <span className="font-medium text-slate-200 text-[11px] sm:text-xs">
                {config.appName} &bull; Portal Resmi Anggota
              </span>
            )}
            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-semibold hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              Sistem Aktif
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:flex items-center gap-3">
            <span>Kabupaten Gresik, Jawa Timur</span>
            <span className="text-slate-600">&bull;</span>
            <button
              onClick={() => openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin konsultasi seputar PAMUR Gresik.`)}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>WhatsApp Admin: {config.phone || config.contactPhone || '0812-3456-7890'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {config.logoUrl ? (
              <div className="relative">
                <img 
                  src={config.logoUrl} 
                  alt="Logo PAMUR" 
                  className="w-10 h-10 rounded-xl object-cover border border-red-200/80 shadow-xs group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-sm shadow-red-700/20 group-hover:scale-105 transition-all duration-300">
                P
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-serif leading-tight group-hover:text-red-700 transition-colors">
                  <span className="hidden sm:inline">{config.appName}</span>
                  <span className="sm:hidden">{config.shortName || config.appName}</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight line-clamp-1">
                {config.slogan || 'Pencak Silat Angkatan Muda Rasio'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links with Smooth Sliding Indicator */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-xl border border-slate-200/60 relative">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10 ${
                    isActive
                      ? 'text-red-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navTabHighlight"
                      className="absolute inset-0 bg-white rounded-lg shadow-2xs border border-red-100/80 -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-red-700' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* If Admin, show Admin Link in Nav */}
            {isAdmin && (
              <button
                id="nav-link-admin"
                onClick={() => handleNavClick('admin')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all z-10 ${
                  currentTab === 'admin'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            )}
          </nav>

          {/* User Auth Buttons / User Profile Pill */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 pl-3 pr-2 py-1.5 rounded-xl shadow-2xs hover:shadow-xs transition-all text-left group"
                >
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[130px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {currentUser.role === 'admin' ? 'Dewan Guru' : `Sabuk ${currentUser.beltRank}`}
                    </p>
                  </div>
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 ring-2 ring-slate-100"
                  />
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu with Motion */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <>
                      {/* Click outside backdrop for dropdown */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-800 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-red-50/20">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                          <p className="text-[11px] text-red-700 font-mono font-semibold">{currentUser.memberId}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{currentUser.branch}</p>
                        </div>

                        <div className="py-1">
                          <button
                            id="dropdown-my-profile"
                            onClick={() => {
                              setCurrentTab('profile');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 font-medium transition-colors"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Profil & KTA Digital</span>
                          </button>

                          <button
                            id="dropdown-my-tickets"
                            onClick={() => {
                              setCurrentTab('profile');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 font-medium transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>Riwayat & Tiket Latihan</span>
                          </button>

                          {isAdmin && (
                            <button
                              id="dropdown-admin-panel"
                              onClick={() => {
                                setCurrentTab('admin');
                                setIsUserDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-xs text-red-700 hover:bg-red-50 flex items-center gap-2.5 font-bold transition-colors"
                            >
                              <Lock className="w-3.5 h-3.5 text-red-700" />
                              <span>Kelola Fitur & Logo (Admin)</span>
                            </button>
                          )}
                        </div>

                        <div className="my-1 border-t border-slate-100"></div>

                        <div className="px-2 pb-1">
                          <button
                            id="dropdown-logout"
                            onClick={() => {
                              logout();
                              setIsUserDropdownOpen(false);
                              setCurrentTab('home');
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5 text-red-600" />
                            <span>Keluar Akun</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                  id="nav-contact-wa"
                  onClick={() => openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin menanyakan informasi pendaftaran silat PAMUR.`)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  title="Hubungi Admin WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hubungi Kami</span>
                </button>

                <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <button
                    id="nav-login-btn"
                    onClick={() => onOpenAuth('login')}
                    className="hover:text-red-700 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100 font-medium"
                  >
                    Masuk
                  </button>
                  {config.enablePublicRegistration && (
                    <button
                      id="nav-register-btn"
                      onClick={() => onOpenAuth('register')}
                      className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-4 py-2 rounded-xl transition-all font-bold shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Daftar Anggota</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-slate-200 active:scale-95 transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 overflow-hidden shadow-lg"
          >
            {isAuthenticated && currentUser && (
              <div className="p-3.5 bg-gradient-to-br from-slate-50 to-red-50/30 rounded-2xl border border-slate-200/90 mb-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                    <div className="text-xs text-red-700 font-mono font-semibold">{currentUser.memberId}</div>
                    <div className="text-[10px] text-slate-500">Sabuk {currentUser.beltRank} &bull; {currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold border border-red-100 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-700' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'profile'
                      ? 'bg-red-50 text-red-700 border border-red-100 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Profil Saya & KTA Digital</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'admin'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-red-50 text-red-700 border border-red-200/80'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Panel Admin (Kelola Fitur & Logo)</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin konsultasi seputar PAMUR Gresik.`);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Hubungi Admin WhatsApp ({config.phone || config.contactPhone || '0812-3456-7890'})</span>
              </button>
            </div>

            {!isAuthenticated && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold bg-white text-slate-800 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-2xs"
                >
                  Masuk
                </button>
                {config.enablePublicRegistration && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold bg-red-700 text-white rounded-xl hover:bg-red-800 shadow-xs"
                  >
                    Daftar Akun
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
