import React, { useState, useRef } from 'react';
import { User, BeltRankLevel } from '../types';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText, 
  ClipboardPaste, 
  Trash2,
  Lock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { 
  downloadBulkImportTemplateExcel, 
  downloadBulkImportTemplateCSV, 
  parseBulkMemberFile 
} from '../utils/excelExport';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (members: Array<Partial<User> & { name: string }>) => Promise<{ success: boolean; count: number; users: User[]; message: string }>;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [importMode, setImportMode] = useState<'upload' | 'paste'>('upload');
  const [parsedMembers, setParsedMembers] = useState<Array<Partial<User> & { name: string }>>([]);
  const [pasteText, setPasteText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ count: number; users: User[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        const members = parseBulkMemberFile(arrayBuffer);
        if (members.length === 0) {
          setErrorMsg('File tidak memiliki baris data anggota yang valid atau format kolom tidak sesuai.');
          setParsedMembers([]);
        } else {
          setParsedMembers(members);
        }
      } catch (err) {
        setErrorMsg('Gagal membaca file Excel/CSV. Pastikan format file sesuai.');
        setParsedMembers([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleParsePastedText = () => {
    if (!pasteText.trim()) {
      setErrorMsg('Silakan tempel (paste) data anggota terlebih dahulu.');
      return;
    }
    setErrorMsg(null);

    const lines = pasteText.trim().split(/\r?\n/);
    if (lines.length === 0) {
      setErrorMsg('Tidak ada baris data yang ditemukan.');
      return;
    }

    const members: Array<Partial<User> & { name: string }> = [];

    // Check if first line is a header
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (firstLineLower.includes('nama') || firstLineLower.includes('name') || firstLineLower.includes('lengkap')) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by tab (Excel/Google Sheets copy) or comma or semicolon
      let cols: string[] = [];
      if (line.includes('\t')) {
        cols = line.split('\t');
      } else if (line.includes(';')) {
        cols = line.split(';');
      } else {
        cols = line.split(',');
      }

      const name = (cols[0] || '').trim();
      if (!name) continue;

      const email = (cols[1] || '').trim();
      const phone = (cols[2] || '').trim();
      const branch = (cols[3] || '').trim() || 'Cabang Gresik';
      const beltRank = (cols[4] || '').trim() || 'Putih';
      const nik = (cols[5] || '').trim();
      const birthPlace = (cols[6] || '').trim() || 'Gresik';
      const birthDate = (cols[7] || '').trim();
      const password = (cols[8] || '').trim();

      members.push({
        name,
        email: email || undefined,
        phone: phone || '-',
        branch,
        beltRank: (beltRank as BeltRankLevel) || 'Putih',
        nik,
        birthPlace,
        birthDate,
        password: password || undefined,
        role: 'anggota',
        status: 'active'
      });
    }

    if (members.length === 0) {
      setErrorMsg('Gagal memproses teks. Pastikan minimal kolom pertama berisi Nama Lengkap.');
      setParsedMembers([]);
    } else {
      setParsedMembers(members);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedMembers.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const result = await onImport(parsedMembers);
      if (result.success) {
        setImportResult({ count: result.count, users: result.users });
      } else {
        setErrorMsg(result.message || 'Gagal mengimpor anggota.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setParsedMembers([]);
    setPasteText('');
    setFileName(null);
    setErrorMsg(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 w-full max-w-3xl space-y-5 shadow-2xl my-8 text-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Input Data Anggota Secara Masal</h3>
              <p className="text-xs text-slate-500">Impor data banyak anggota sekaligus via file Excel (.xlsx / .csv) atau salin teks tabel</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Result View */}
        {importResult ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-900">Impor Masal Berhasil!</h4>
              <p className="text-xs text-slate-600">
                Sebanyak <strong className="text-emerald-700 font-bold">{importResult.count} anggota baru</strong> telah berhasil disimpan ke database cloud dan otomatis terdaftar di portal.
              </p>
            </div>

            {/* Credential summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs max-h-48 overflow-y-auto divide-y divide-slate-200/60">
              <div className="pb-2 font-bold text-slate-700 flex items-center justify-between">
                <span>Daftar Akun Dibuat:</span>
                <span className="text-[10px] text-slate-500 font-normal">Password dibuat otomatis jika kosong</span>
              </div>
              {importResult.users.map((u, i) => (
                <div key={i} className="py-1.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">{u.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({u.memberId})</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="font-mono text-red-700 font-bold">{u.email}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Impor Data Lainnya
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Template Download Section */}
            <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-red-950 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-red-700" />
                  <span>Unduh Template Format Data Anggota:</span>
                </div>
                <p className="text-[11px] text-red-800">
                  Gunakan format kolom resmi agar seluruh data (nama, sabuk, ranting, nomor WA) terisi rapi.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => downloadBulkImportTemplateExcel()}
                  className="px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => downloadBulkImportTemplateCSV()}
                  className="px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => { setImportMode('upload'); setErrorMsg(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  importMode === 'upload'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah File Excel / CSV</span>
              </button>

              <button
                onClick={() => { setImportMode('paste'); setErrorMsg(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  importMode === 'paste'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Salin & Tempel (Copy-Paste) Tabel</span>
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {importMode === 'upload' && (
              <div className="space-y-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-red-600 hover:bg-red-50/20 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 bg-slate-50/50"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100/70 text-red-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800">
                      Klik untuk memilih file Excel (.xlsx, .xls) atau .CSV
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">atau drag & drop file data anggota Anda ke sini</p>
                  </div>
                  {fileName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{fileName}</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Mode 2: Paste Table Text */}
            {importMode === 'paste' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">
                    Tempel Data dari Microsoft Excel atau Google Sheets:
                  </label>
                  <span className="text-[11px] text-slate-400">Pisahkan kolom dengan Tab/Koma</span>
                </div>
                <textarea
                  rows={4}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Contoh baris tabel:\nAhmad Fauzi\tahmad@pamur.id\t081234567891\tRanting Kebomas\tKuning\nSiti Rahma\tsiti@pamur.id\t085712345678\tRanting Manyar\tPutih`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleParsePastedText}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Proses & Tampilkan Preview Data</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Preview Table of Parsed Members */}
            {parsedMembers.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      Pratinjau Data Anggota ({parsedMembers.length} Pesilat):
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Siap Diimpor
                    </span>
                  </div>
                  <button
                    onClick={() => setParsedMembers([])}
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Bersihkan Pratinjau</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="p-2">No</th>
                        <th className="p-2">Nama Lengkap</th>
                        <th className="p-2">Ranting</th>
                        <th className="p-2">Sabuk</th>
                        <th className="p-2">No. WhatsApp</th>
                        <th className="p-2">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                      {parsedMembers.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 text-slate-400">{idx + 1}</td>
                          <td className="p-2 font-bold text-slate-900">{m.name}</td>
                          <td className="p-2 text-slate-600">{m.branch || 'Cabang Gresik'}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-50 text-red-700 font-semibold">
                              {m.beltRank || 'Putih'}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-slate-600">{m.phone || '-'}</td>
                          <td className="p-2 font-mono text-slate-500">{m.email || '(auto @pamur.id)'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>

              <button
                type="button"
                id="btn-confirm-bulk-import"
                disabled={parsedMembers.length === 0 || isProcessing}
                onClick={handleExecuteImport}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                  parsedMembers.length === 0 || isProcessing
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-red-700 hover:bg-red-800 text-white cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan ke Cloud Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Impor Sekarang ({parsedMembers.length} Anggota)</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
