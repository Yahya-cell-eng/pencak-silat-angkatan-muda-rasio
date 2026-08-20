import React from 'react';
import { useData } from '../context/DataContext';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';

export const BeltProgressionView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { beltRanks } = useData();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Kurikulum Keilmuan Silat PAMUR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
            Jenjang Tingkatan Sabuk & Kurikulum
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Sistem pembinaan pesilat PAMUR terbagi dalam {beltRanks.length} tahapan sabuk berjenjang terstruktur dari tingkat awal hingga dewan pendekar.
          </p>
        </div>
      </div>

      {/* Belts Detailed List */}
      <div className="space-y-4">
        {beltRanks.map((belt, idx) => (
          <div
            key={belt.id || belt.level}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Belt Color Emblem Visual */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-xs border"
                style={{
                  backgroundColor: belt.colorHex,
                  color: (belt.textColor?.includes('slate-800') || belt.colorHex === '#f8fafc' || belt.colorHex === '#94a3b8') ? '#0f172a' : '#ffffff',
                  borderColor: '#cbd5e1'
                }}
              >
                {belt.order || idx + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Sabuk {belt.level}
                </h3>
                <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider">
                  Tingkat {belt.order || idx + 1}
                </span>
              </div>
            </div>

            {/* Description & Stage */}
            <div className="lg:col-span-9 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Fase & Materi Kurikulum:
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {belt.stage}
                </h4>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider block">
                  Filosofi & Makna:
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{belt.meaning}"
                </p>
              </div>

              {/* Requirement Checklist */}
              <div className="pt-1">
                <div className="text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Syarat Kelayakan Ujian Kenaikan Tingkat (UKT):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700"></div>
                    <span>Kehadiran latihan minimal 80% per semester</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700"></div>
                    <span>Hafal jurus baku & aplikasi sambut tingkat {belt.order || idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700"></div>
                    <span>Lulus tes ketahanan fisik & sprint daya tahan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700"></div>
                    <span>Wawancara etika & kode kehormatan pesilat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <p className="text-xs text-slate-600">
          Tertarik mengikuti Ujian Kenaikan Tingkat berikutnya? Pastikan Anda rutin mendaftar jadwal latihan online.
        </p>
        <button
          onClick={() => onNavigateTab('schedules')}
          className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
        >
          <span>Lihat Jadwal Latihan & UKT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
