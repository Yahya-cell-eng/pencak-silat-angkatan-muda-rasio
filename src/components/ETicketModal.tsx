import React, { useRef } from 'react';
import { TrainingRegistration } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Award, 
  Printer, 
  CheckCircle, 
  Shield, 
  QrCode
} from 'lucide-react';

interface ETicketModalProps {
  registration: TrainingRegistration | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({ registration, isOpen, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-slate-900 my-6">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-700">
            <Shield className="w-4 h-4" />
            <span>E-TIKET RESMI PENDAFTARAN LATIHAN PAMUR</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Card */}
        <div className="p-6 bg-slate-50" ref={ticketRef}>
          <div className="border border-slate-200 rounded-xl p-5 bg-white relative overflow-hidden shadow-xs">
            
            {/* Ticket Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-serif tracking-wider">PENCAK SILAT PAMUR</h4>
                  <p className="text-[10px] text-slate-500">Angkatan Muda Rasio &bull; Tiket Latihan Resmi</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <CheckCircle className="w-3 h-3" />
                  {registration.status}
                </span>
                <p className="text-[9px] text-slate-400 mt-1">Kode: {registration.ticketCode}</p>
              </div>
            </div>

            {/* Session Info */}
            <div className="py-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Materi Sesi Latihan:</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {registration.scheduleTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400">Tanggal Pelaksanaan</div>
                    <div className="text-xs font-bold text-slate-800">{registration.scheduleDate}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400">Waktu Latihan</div>
                    <div className="text-xs font-bold text-slate-800">{registration.scheduleTime} WIB</div>
                  </div>
                </div>

                <div className="col-span-2 flex items-start gap-2 pt-2 border-t border-slate-200/60">
                  <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400">Lokasi & Ranting</div>
                    <div className="text-xs font-semibold text-slate-800">{registration.location}</div>
                    <div className="text-[10px] text-red-700 font-medium">Cabang: {registration.branch}</div>
                  </div>
                </div>
              </div>

              {/* Member Details in Ticket */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    Nama Pesilat:
                  </span>
                  <div className="font-bold text-slate-900 mt-0.5">{registration.userName}</div>
                  <div className="text-[10px] text-red-700 font-mono">{registration.userMemberId}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-slate-400" />
                    Tingkat Sabuk:
                  </span>
                  <div className="font-bold text-slate-800 mt-0.5">Sabuk {registration.userBelt}</div>
                  <div className="text-[10px] text-slate-400">Tercatat: {registration.registeredAt}</div>
                </div>

                {registration.notes && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-600">
                    <span className="text-slate-400">Catatan: </span>
                    {registration.notes}
                  </div>
                )}
              </div>

            </div>

            {/* QR Code & Barcode Area */}
            <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shadow-2xs">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tunjukkan ke Pelatih</div>
                  <div className="text-[10px] text-slate-500">Scan kode di pintu masuk sasana</div>
                  <div className="font-mono text-xs font-bold text-red-700 tracking-wider mt-0.5">{registration.ticketCode}</div>
                </div>
              </div>

              {/* Barcode Visual */}
              <div className="hidden sm:flex flex-col items-end">
                <div className="h-7 flex items-center gap-0.5 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <div className="w-1 h-5 bg-slate-800"></div>
                  <div className="w-0.5 h-5 bg-slate-800"></div>
                  <div className="w-1.5 h-5 bg-slate-800"></div>
                  <div className="w-0.5 h-5 bg-slate-800"></div>
                  <div className="w-1 h-5 bg-slate-800"></div>
                  <div className="w-2 h-5 bg-slate-800"></div>
                  <div className="w-0.5 h-5 bg-slate-800"></div>
                  <div className="w-1 h-5 bg-slate-800"></div>
                </div>
                <span className="text-[8px] text-slate-400 font-mono mt-0.5">PAMUR-VERIFIED</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Simpan atau cetak tiket ini sebagai tanda bukti absensi resmi.
          </p>
          <div className="flex items-center gap-2">
            <button
              id="print-ticket-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak Tiket</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
