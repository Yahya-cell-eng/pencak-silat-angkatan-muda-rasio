import React from 'react';
import { useData } from '../context/DataContext';
import { MapPin, User, Phone, Users, Calendar } from 'lucide-react';

export const BranchesView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { branches, users } = useData();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Padepokan & Sasana Latihan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
            Ranting & Cabang Latihan PAMUR
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Temukan sasana dan padepokan silat PAMUR terdekat dari tempat tinggal Anda. Seluruh ranting dinaungi oleh pelatih bersertifikasi resmi.
          </p>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((branch) => {
          const registeredCount = users.filter(u => u.branch === branch.name && u.role === 'anggota').length;
          const displayCount = registeredCount > 0 ? registeredCount : branch.memberCount;

          return (
            <div
              key={branch.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                    {branch.city}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {displayCount} Pesilat
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {branch.name}
                </h3>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Pelatih: <strong className="text-slate-800">{branch.headCoach}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Kontak: <strong className="text-slate-800">{branch.contact}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('schedules')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Lihat Jadwal di Ranting Ini</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
