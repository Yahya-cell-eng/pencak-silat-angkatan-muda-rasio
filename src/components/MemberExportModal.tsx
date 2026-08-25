import React, { useState, useMemo } from 'react';
import { User, BranchInfo, BeltInfo } from '../types';
import { 
  ALL_MEMBER_EXPORT_COLUMNS, 
  exportMembersToExcel, 
  exportMembersToCSV 
} from '../utils/excelExport';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  CheckSquare, 
  Square, 
  Users, 
  FileText, 
  CheckCircle2, 
  Search, 
  Edit, 
  SlidersHorizontal,
  FileCheck,
  Building2,
  Award,
  Calendar
} from 'lucide-react';

interface MemberExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  branches: BranchInfo[];
  beltRanks: BeltInfo[];
  onEditUser?: (user: User) => void;
}

export const MemberExportModal: React.FC<MemberExportModalProps> = ({
  isOpen,
  onClose,
  users,
  branches,
  beltRanks,
  onEditUser
}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('Semua');
  const [beltFilter, setBeltFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [yearFilter, setYearFilter] = useState('Semua');
  const [roleFilter, setRoleFilter] = useState('Semua');

  // Selected column IDs for export
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>(
    ALL_MEMBER_EXPORT_COLUMNS.filter(c => c.default).map(c => c.id)
  );

  // Custom File & Report naming
  const [customFilename, setCustomFilename] = useState(
    `Laporan_Data_Anggota_PAMUR_Gresik_${new Date().toISOString().split('T')[0]}`
  );
  const [reportTitle, setReportTitle] = useState(
    'LAPORAN DATABASE ANGGOTA RESMI PERGURUAN PENCAK SILAT PAMUR CABANG GRESIK'
  );

  const [activeTab, setActiveTab] = useState<'preview' | 'columns' | 'settings'>('preview');

  // Available unique years from users
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    users.forEach(u => {
      if (u.joinYear) years.add(String(u.joinYear));
      else if (u.joinDate) years.add(u.joinDate.split('-')[0]);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [users]);

  // Filtered members calculation
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Role filter
      if (roleFilter !== 'Semua') {
        if (u.role !== roleFilter) return false;
      }

      // Branch filter
      if (branchFilter !== 'Semua') {
        if (u.branch !== branchFilter) return false;
      }

      // Belt filter
      if (beltFilter !== 'Semua') {
        if (u.beltRank !== beltFilter) return false;
      }

      // Status filter
      if (statusFilter !== 'Semua') {
        if (u.status !== statusFilter) return false;
      }

      // Year filter
      if (yearFilter !== 'Semua') {
        const uYear = u.joinYear ? String(u.joinYear) : u.joinDate ? u.joinDate.split('-')[0] : '';
        if (uYear !== yearFilter) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const mName = (u.name || '').toLowerCase().includes(q);
        const mId = (u.memberId || '').toLowerCase().includes(q);
        const mNik = (u.nik || '').toLowerCase().includes(q);
        const mEmail = (u.email || '').toLowerCase().includes(q);
        const mPhone = (u.phone || '').toLowerCase().includes(q);
        const mBranch = (u.branch || '').toLowerCase().includes(q);
        if (!mName && !mId && !mNik && !mEmail && !mPhone && !mBranch) return false;
      }

      return true;
    });
  }, [users, roleFilter, branchFilter, beltFilter, statusFilter, yearFilter, searchTerm]);

  // Toggle column selection
  const toggleColumn = (colId: string) => {
    if (selectedColumnIds.includes(colId)) {
      if (selectedColumnIds.length === 1) return; // keep at least 1
      setSelectedColumnIds(selectedColumnIds.filter(id => id !== colId));
    } else {
      setSelectedColumnIds([...selectedColumnIds, colId]);
    }
  };

  const selectAllColumns = () => {
    setSelectedColumnIds(ALL_MEMBER_EXPORT_COLUMNS.map(c => c.id));
  };

  const selectDefaultColumns = () => {
    setSelectedColumnIds(ALL_MEMBER_EXPORT_COLUMNS.filter(c => c.default).map(c => c.id));
  };

  // Export handlers
  const handleDownloadExcel = () => {
    exportMembersToExcel(filteredUsers, {
      filename: customFilename.trim() || 'Laporan_Data_Anggota_PAMUR.xlsx',
      reportTitle: reportTitle.trim(),
      selectedColumnIds: selectedColumnIds
    });
  };

  const handleDownloadCSV = () => {
    exportMembersToCSV(filteredUsers, {
      filename: customFilename.trim() || 'Laporan_Data_Anggota_PAMUR.csv',
      reportTitle: reportTitle.trim(),
      selectedColumnIds: selectedColumnIds
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Unduh & Laporan Data Anggota PAMUR</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Excel & CSV
                </span>
              </div>
              <p className="text-xs text-red-100/80">
                Ekspor data pesilat terdaftar untuk kebutuhan arsip, laporan ranting, IPSI, dan pengurus perguruan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Filter className="w-4 h-4 text-red-700" />
              <span>Filter Data Yang Ingin Diunduh:</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-mono text-[11px]">
                {filteredUsers.length} dari {users.length} Anggota Terpilih
              </span>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pratinjau Data ({filteredUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('columns')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'columns' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pilihan Kolom ({selectedColumnIds.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'settings' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nama File & Header
              </button>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {/* Search */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, NIA, NIK, WA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-red-700"
              />
            </div>

            {/* Ranting Filter */}
            <div>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Semua">Semua Ranting</option>
                {branches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Sabuk Filter */}
            <div>
              <select
                value={beltFilter}
                onChange={(e) => setBeltFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Semua">Semua Sabuk</option>
                {beltRanks.map(b => (
                  <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Semua">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="pending">Menunggu Verifikasi</option>
                <option value="inactive">Non-Aktif</option>
              </select>
            </div>

            {/* Tahun Masuk Filter */}
            <div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Semua">Semua Tahun</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>Tahun {y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: DATA PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-slate-600 font-medium">
                  Menampilkan <strong className="text-slate-900">{filteredUsers.length}</strong> data pesilat yang siap diunduh:
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  💡 Klik tombol "Edit" di tabel untuk mengubah data anggota sebelum dicetak/diunduh.
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                      <tr>
                        <th className="p-2.5 w-10 text-center">No</th>
                        <th className="p-2.5">Nomor Anggota (NIA)</th>
                        <th className="p-2.5">Nama Lengkap</th>
                        <th className="p-2.5">Ranting</th>
                        <th className="p-2.5">Sabuk</th>
                        <th className="p-2.5">Tahun</th>
                        <th className="p-2.5">No. HP / WA</th>
                        <th className="p-2.5">Status</th>
                        {onEditUser && <th className="p-2.5 text-right">Ubah Data</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400">
                            Tidak ada data anggota yang sesuai dengan filter pencarian saat ini.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, idx) => (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-mono font-bold text-red-700 bg-red-50/50">
                              {u.memberId || '-'}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-900">
                              {u.name}
                              <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                            </td>
                            <td className="p-2.5 font-medium">{u.branch || 'Cabang Gresik'}</td>
                            <td className="p-2.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                                {u.beltRank || 'Putih'}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-slate-600">
                              {u.joinYear || (u.joinDate ? u.joinDate.split('-')[0] : '-')}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600">{u.phone || '-'}</td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                u.status === 'active' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : u.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {u.status === 'active' ? 'Aktif' : u.status === 'pending' ? 'Pending' : 'Non-Aktif'}
                              </span>
                            </td>
                            {onEditUser && (
                              <td className="p-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => onEditUser(u)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 rounded font-semibold text-[10px] inline-flex items-center gap-1 transition-colors"
                                  title="Ubah data pesilat ini"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Ubah</span>
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLUMN CUSTOMIZATION */}
          {activeTab === 'columns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <div>
                  <div className="font-bold text-amber-900 text-xs">Pilih Kolom Yang Ingin Disertakan di File Excel/CSV</div>
                  <div className="text-[11px] text-amber-800">
                    Centang atau hilangkan centang kolom sesuai kebutuhan pelaporan pengurus perguruan atau IPSI.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllColumns}
                    className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold rounded-lg text-[11px]"
                  >
                    Pilih Semua ({ALL_MEMBER_EXPORT_COLUMNS.length})
                  </button>
                  <button
                    type="button"
                    onClick={selectDefaultColumns}
                    className="px-2.5 py-1 bg-amber-700 text-white hover:bg-amber-800 font-bold rounded-lg text-[11px]"
                  >
                    Standar Pengurus
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ALL_MEMBER_EXPORT_COLUMNS.map((col) => {
                  const isChecked = selectedColumnIds.includes(col.id);
                  return (
                    <div
                      key={col.id}
                      onClick={() => toggleColumn(col.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-red-50/70 border-red-300 text-red-950 font-semibold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-red-700 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="text-xs">{col.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {col.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FILE SETTINGS & HEADER */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-xl">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama File Dokumen Unduhan
                  </label>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-red-700"
                    placeholder="Laporan_Data_Anggota_PAMUR_Gresik"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Ekstensi .xlsx atau .csv akan ditambahkan secara otomatis.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Judul Header Laporan Pengurus
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-red-700"
                    placeholder="LAPORAN DATA ANGGOTA RESMI PAMUR"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Download Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Siap mengunduh <strong>{filteredUsers.length} anggota</strong> dengan <strong>{selectedColumnIds.length} kolom</strong> terpilih.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Batal / Tutup
            </button>

            {/* CSV Download Button */}
            <button
              type="button"
              id="export-csv-direct-btn"
              onClick={handleDownloadCSV}
              disabled={filteredUsers.length === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>

            {/* Excel Download Button */}
            <button
              type="button"
              id="export-excel-direct-btn"
              onClick={handleDownloadExcel}
              disabled={filteredUsers.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh File Excel (.xlsx)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
