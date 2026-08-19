import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const sanitizeWhatsAppNumber = (phoneStr: string): string => {
  if (!phoneStr) return '6281234567890';
  // Remove all non-digits
  let digits = phoneStr.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  } else if (digits.startsWith('8')) {
    digits = '62' + digits;
  } else if (!digits.startsWith('62')) {
    digits = '62' + digits;
  }
  return digits;
};

export const openWhatsAppChat = (phoneNumber: string, message: string) => {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const WhatsAppContact: React.FC = () => {
  const { config } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('pendaftaran');
  const [customMessage, setCustomMessage] = useState<string>('');

  const adminPhone = config.phone || '0812-3456-7890';

  const topics = [
    {
      id: 'pendaftaran',
      title: 'Pendaftaran Anggota Baru',
      desc: 'Informasi syarat, biaya seragam, dan formulir',
      preset: `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin menanyakan informasi pendaftaran calon anggota baru silat PAMUR.`
    },
    {
      id: 'jadwal',
      title: 'Jadwal & Tempat Latihan Ranting',
      desc: 'Lokasi padepokan & ranting di wilayah Gresik',
      preset: `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya ingin menanyakan jadwal latihan serta lokasi ranting terdekat di Gresik.`
    },
    {
      id: 'ukt',
      title: 'Ujian Kenaikan Tingkat (UKT)',
      desc: 'Info materi sabuk, jadwal UKT, dan sertifikasi',
      preset: `Halo Pengurus ${config.appName || 'PAMUR Gresik'}, saya ingin konsultasi mengenai jadwal Ujian Kenaikan Tingkat (UKT) dan kenaikan sabuk.`
    },
    {
      id: 'bantuan',
      title: 'Bantuan Akun & Layanan Admin',
      desc: 'Reset sandi, KTA digital, atau kendala portal',
      preset: `Halo Admin ${config.appName || 'PAMUR Gresik'}, saya butuh bantuan terkait akun pesilat / layanan administrasi perguruan.`
    }
  ];

  const handleSendMessage = () => {
    const topicObj = topics.find(t => t.id === selectedTopic);
    let finalMessage = topicObj?.preset || `Halo Admin ${config.appName || 'PAMUR Gresik'}, salam persaudaraan silat.`;
    if (customMessage.trim()) {
      finalMessage += `\n\nCatatan Tambahan:\n${customMessage.trim()}`;
    }
    openWhatsAppChat(adminPhone, finalMessage);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Popup Modal */}
        {isOpen && (
          <div className="mb-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Hubungi Kami (Admin PAMUR)</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-100 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                      <span>WhatsApp Aktif &bull; Respons Cepat</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-emerald-50 mt-2 leading-relaxed">
                Punya pertanyaan seputar pendaftaran, latihan, atau kegiatan perguruan? Kirim pesan langsung ke Admin WhatsApp kami.
              </p>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5 max-h-[65vh] overflow-y-auto">
              <div className="text-xs font-semibold text-slate-700">
                Pilih Topik Pertanyaan:
              </div>

              <div className="space-y-2">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopic(t.id)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-start gap-2.5 ${
                      selectedTopic === t.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        selectedTopic === t.id ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-500">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Note input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Tulis Catatan / Pertanyaan Spesifik (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ketik pertanyaan Anda di sini..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Contact phone info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>No. WhatsApp: {adminPhone}</span>
                </span>
                <span className="font-semibold text-slate-700">Pengcab Gresik</span>
              </div>
            </div>

            {/* Footer Submit Button */}
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <button
                id="btn-send-whatsapp"
                onClick={handleSendMessage}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Mulai Chat di WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          id="btn-floating-whatsapp"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Hubungi Admin WhatsApp"
          className="group flex items-center gap-2.5 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-600 animate-pulse"></span>
          </div>
          <span className="text-xs tracking-wide hidden sm:inline">Hubungi Kami (WhatsApp)</span>
        </button>
      </div>
    </>
  );
};
