import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { currentUser, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'articles', label: 'Artikel & Berita', icon: BookOpen },
    { id: 'schedules', label: 'Jadwal Latihan', icon: Calendar },
    { id: 'belts', label: 'Tingkatan Sabuk', icon: Award },
    { id: 'branches', label: 'Ranting & Cabang', icon: MapPin },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Demo Bar / Quick Role Switcher */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) &bull; Cloud Online
            </span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              Database Online
            </span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              id="demo-switcher-btn"
              onClick={() => setIsQuickLoginOpen(!isQuickLoginOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded-md text-amber-300 font-semibold border border-slate-700 transition-colors text-[11px]"
              title="Ganti Akun Demo Seketika"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Uji Coba Akun Demo</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isQuickLoginOpen && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-slate-800 text-xs"
                onMouseLeave={() => setIsQuickLoginOpen(false)}
              >
                <div className="font-bold text-slate-900 pb-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                  <span>Pilih Akun Pengujian:</span>
                  <span className="text-[10px] text-slate-400 font-normal">1-Klik</span>
                </div>
                <button
                  id="login-as-admin-quick"
                  onClick={() => {
                    quickLogin('admin');
                    setIsQuickLoginOpen(false);
                    setCurrentTab('admin');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-700 flex items-center justify-between transition-colors mb-1"
                >
                  <div>
                    <div className="font-bold text-red-700 text-xs">Dewan Guru (Admin)</div>
                    <div className="text-[10px] text-slate-500">admin@pamur.id</div>
                  </div>
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">Admin</span>
                </button>

                <button
                  id="login-as-member1-quick"
                  onClick={() => {
                    quickLogin('member1');
                    setIsQuickLoginOpen(false);
                    setCurrentTab('profile');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition-colors mb-1"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Budi Santoso (Anggota)</div>
                    <div className="text-[10px] text-slate-500">budi@pamur.id (Sabuk Hijau)</div>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Anggota</span>
                </button>

                <button
                  id="login-as-member2-quick"
                  onClick={() => {
                    quickLogin('member2');
                    setIsQuickLoginOpen(false);
                    setCurrentTab('profile');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Siti Rahmawati (Anggota)</div>
                    <div className="text-[10px] text-slate-500">siti@pamur.id (Sabuk Kuning)</div>
                  </div>
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">Anggota</span>
                </button>
              </div>
            )}
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
            <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-red-700/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                  PAMUR
                </h1>
                <span className="hidden sm:inline font-normal text-slate-500 text-sm">
                  | Portal Anggota
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                Pencak Silat Angkatan Muda Rasio
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-700 border border-red-100 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-700' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* If Admin, show Admin Link in Nav */}
            {isAdmin && (
              <button
                id="nav-link-admin"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            )}
          </nav>

          {/* User Auth Buttons / User Profile Pill */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 pl-3 pr-2.5 py-1.5 rounded-xl shadow-xs transition-all text-left group"
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
                    className="w-9 h-9 rounded-full object-cover border border-slate-300 ring-2 ring-slate-100"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-800"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                      <p className="text-[11px] text-red-700 font-mono font-semibold">{currentUser.memberId}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{currentUser.branch}</p>
                    </div>

                    <button
                      id="dropdown-my-profile"
                      onClick={() => {
                        setCurrentTab('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 font-medium"
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
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 font-medium"
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
                        className="w-full px-4 py-2 text-left text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 font-bold"
                      >
                        <Lock className="w-3.5 h-3.5 text-red-700" />
                        <span>Kelola Sistem (Admin)</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      id="dropdown-logout"
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                        setCurrentTab('home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
                  <button
                    id="nav-login-btn"
                    onClick={() => onOpenAuth('login')}
                    className="hover:text-red-700 transition-colors font-semibold"
                  >
                    Login
                  </button>
                  <button
                    id="nav-register-btn"
                    onClick={() => onOpenAuth('register')}
                    className="hover:text-red-700 border-l border-slate-200 pl-4 font-semibold text-red-700"
                  >
                    Daftar Akun
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated && currentUser && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
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
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-bold border border-red-100'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          {isAuthenticated && (
            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'profile'
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profil Saya & KTA Digital</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                currentTab === 'admin'
                  ? 'bg-red-700 text-white'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Panel Admin (Kelola PAMUR)</span>
            </button>
          )}

          {!isAuthenticated && (
            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2 text-center text-xs font-bold bg-white text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="w-full py-2 text-center text-xs font-bold bg-red-700 text-white rounded-lg hover:bg-red-800 shadow-sm"
              >
                Daftar Akun
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
