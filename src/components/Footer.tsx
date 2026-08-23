import React from 'react';
import { Phone, Mail, MapPin, Building, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { openWhatsAppChat } from './WhatsAppContact';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenAuth }) => {
  const { config } = useData();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              {config.logoUrl ? (
                <img 
                  src={config.logoUrl} 
                  alt="Logo PAMUR" 
                  className="w-8 h-8 rounded-lg object-cover border border-red-200 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
                  P
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base text-slate-900 tracking-tight">
                  {config.appName}
                </span>
                <span className="text-[9px] text-slate-400 -mt-0.5 font-semibold uppercase">
                  {config.slogan || 'Pencak Silat Rasio'}
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {config.footerAboutText || config.description || 'Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) • Mengembangkan seni beladiri rasional, ketangkasan tanding, dan integritas kesatria pesilat berjiwa luhur.'}
            </p>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-red-700 transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('articles')} className="hover:text-red-700 transition-colors">
                  Artikel & Warta Silat
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('schedules')} className="hover:text-red-700 transition-colors">
                  Jadwal Latihan di Gresik
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('belts')} className="hover:text-red-700 transition-colors">
                  Tingkatan Sabuk & Kurikulum
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('branches')} className="hover:text-red-700 transition-colors">
                  Ranting & Tempat Latihan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Keanggotaan & Portal */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Portal Pesilat</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onOpenAuth('login')} className="hover:text-red-700 transition-colors">
                  Login Anggota / Admin
                </button>
              </li>
              {config.enablePublicRegistration && (
                <li>
                  <button onClick={() => onOpenAuth('register')} className="hover:text-red-700 transition-colors">
                    Pendaftaran Anggota Baru
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigateTab('schedules')} className="hover:text-red-700 transition-colors">
                  Pendaftaran Latihan Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('profile')} className="hover:text-red-700 transition-colors">
                  Kartu Tanda Anggota (KTA Digital)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Sekretariat */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Sekretariat Pengcab</h4>
            <div className="space-y-1.5 text-slate-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{config.secretariatAddress || config.contactAddress || config.address || 'Padepokan PAMUR Cabang Gresik, Jawa Timur'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.phone || config.contactPhone || '+62 812-3456-7890'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.email || config.contactEmail || 'gresik@pamur.id'}</span>
              </div>
            </div>
            <div className="pt-1">
              <button
                id="footer-whatsapp-btn"
                onClick={() => openWhatsAppChat(config.phone || config.contactPhone || '0812-3456-7890', `Halo Admin ${config.appName}, saya ingin berkonsultasi mengenai kegiatan silat PAMUR Gresik.`)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WhatsApp Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            {config.copyrightText ? config.copyrightText : (
              <>&copy; {new Date().getFullYear()} {config.appName}. Hak Cipta Dilindungi.</>
            )}
          </div>
          <div>
            <span>{config.footerTagline || 'Melestarikan Warisan Pencak Silat Nusantara • Cabang Gresik'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
