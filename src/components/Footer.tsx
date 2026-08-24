import React from 'react';
import { Phone, Mail, MapPin, Building, MessageCircle, Shield, ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { openWhatsAppChat } from './WhatsAppContact';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenAuth }) => {
  const { config } = useData();

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/90 text-slate-500 text-xs mt-16">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              {config.logoUrl ? (
                <img 
                  src={config.logoUrl} 
                  alt="Logo PAMUR" 
                  className="w-10 h-10 rounded-xl object-cover border border-red-200 shadow-2xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-serif font-black text-base shadow-2xs">
                  P
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base text-slate-900 tracking-tight leading-tight">
                  {config.appName}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  {config.slogan || 'Pencak Silat Rasio'}
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {config.footerAboutText || config.description || 'Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) • Mengembangkan seni beladiri rasional, ketangkasan tanding, dan integritas kesatria pesilat berjiwa luhur.'}
            </p>
            {(config.instagram || config.facebook || config.youtube) && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
                {config.instagram && (
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                    IG: {config.instagram}
                  </span>
                )}
                {config.facebook && (
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                    FB: {config.facebook}
                  </span>
                )}
                {config.youtube && (
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                    YT: {config.youtube}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Beranda Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('articles')} className="hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Artikel & Warta Silat</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('schedules')} className="hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Jadwal Latihan Online</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('belts')} className="hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Tingkatan Sabuk & Kurikulum</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('branches')} className="hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Ranting di Kab. Gresik</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Keanggotaan & Portal */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Layanan Pesilat</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenAuth('login')} className="hover:text-red-700 transition-colors cursor-pointer">
                  Masuk Akun Pesilat
                </button>
              </li>
              {config.enablePublicRegistration && (
                <li>
                  <button onClick={() => onOpenAuth('register')} className="hover:text-red-700 transition-colors cursor-pointer">
                    Pendaftaran Anggota Baru
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigateTab('schedules')} className="hover:text-red-700 transition-colors cursor-pointer">
                  Pemesanan E-Ticket Latihan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('profile')} className="hover:text-red-700 transition-colors cursor-pointer">
                  Kartu Tanda Anggota (KTA Digital)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Sekretariat */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Sekretariat Pengcab</h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{config.secretariatAddress || config.contactAddress || config.address || 'Padepokan PAMUR Cabang Gresik, Jawa Timur'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.phone || config.contactPhone || '+62 812-3456-7890'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.email || config.contactEmail || 'gresik@pamur.id'}</span>
              </div>
            </div>
            <div className="pt-1.5">
              <button
                id="footer-whatsapp-btn"
                onClick={() => openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName}, saya ingin berkonsultasi mengenai kegiatan silat PAMUR Gresik.`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            {config.copyrightText ? config.copyrightText : (
              <>&copy; {new Date().getFullYear()} {config.appName}. Hak Cipta Dilindungi.</>
            )}
          </div>
          <div>
            <span className="font-medium text-slate-500">{config.footerTagline || 'Melestarikan Warisan Pencak Silat Nusantara • Cabang Gresik'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
