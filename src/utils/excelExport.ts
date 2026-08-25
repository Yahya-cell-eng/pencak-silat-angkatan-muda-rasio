import * as XLSX from 'xlsx';
import { User, TrainingRegistration } from '../types';

export interface MemberExportColumn {
  id: string;
  label: string;
  default: boolean;
  width: number;
  getValue: (u: User, index: number) => string | number;
}

export const ALL_MEMBER_EXPORT_COLUMNS: MemberExportColumn[] = [
  { id: 'no', label: 'No.', default: true, width: 6, getValue: (_, idx) => idx + 1 },
  { id: 'memberId', label: 'Nomor Induk Anggota (NIA / PMR ID)', default: true, width: 22, getValue: (u) => u.memberId || '-' },
  { id: 'name', label: 'Nama Lengkap', default: true, width: 28, getValue: (u) => u.name },
  { id: 'role', label: 'Peran (Role)', default: true, width: 20, getValue: (u) => u.role === 'admin' ? 'Dewan Guru (Admin)' : 'Pesilat (Anggota)' },
  { id: 'beltRank', label: 'Tingkat Sabuk', default: true, width: 16, getValue: (u) => u.beltRank ? `Sabuk ${u.beltRank}` : 'Sabuk Putih' },
  { id: 'branch', label: 'Ranting / Unit Latihan', default: true, width: 26, getValue: (u) => u.branch || 'Cabang Gresik' },
  { id: 'joinYear', label: 'Tahun Masuk (Angkatan)', default: true, width: 18, getValue: (u) => u.joinYear || (u.joinDate ? u.joinDate.split('-')[0] : '-') },
  { id: 'nik', label: 'NIK (KTP / KIA)', default: true, width: 22, getValue: (u) => u.nik || '-' },
  { id: 'phone', label: 'No. WhatsApp / HP', default: true, width: 20, getValue: (u) => u.phone || '-' },
  { id: 'email', label: 'Email Terdaftar', default: true, width: 28, getValue: (u) => u.email },
  { id: 'birthPlace', label: 'Tempat Lahir', default: true, width: 18, getValue: (u) => u.birthPlace || '-' },
  { id: 'birthDate', label: 'Tanggal Lahir', default: true, width: 16, getValue: (u) => u.birthDate || '-' },
  { id: 'joinDate', label: 'Tanggal Bergabung', default: true, width: 18, getValue: (u) => u.joinDate || '-' },
  { id: 'status', label: 'Status Keaktifan', default: true, width: 16, getValue: (u) => u.status === 'active' ? 'Aktif' : u.status === 'pending' ? 'Menunggu Verifikasi' : 'Non-Aktif' },
  { id: 'emergencyContact', label: 'Kontak Darurat', default: false, width: 22, getValue: (u) => u.emergencyContact || '-' },
  { id: 'bio', label: 'Keterangan / Bio', default: false, width: 32, getValue: (u) => u.bio || '-' }
];

export interface MemberExportOptions {
  filename?: string;
  reportTitle?: string;
  selectedColumnIds?: string[];
  filterSummary?: string;
}

/**
 * Exports members data to Microsoft Excel (.xlsx) file with optional column selection and custom header.
 */
export function exportMembersToExcel(
  users: User[], 
  filenameOrOptions: string | MemberExportOptions = 'Laporan_Data_Anggota_PAMUR.xlsx'
) {
  const options: MemberExportOptions = typeof filenameOrOptions === 'string'
    ? { filename: filenameOrOptions }
    : filenameOrOptions;

  const filename = options.filename || `Laporan_Data_Anggota_PAMUR_${new Date().toISOString().split('T')[0]}.xlsx`;
  const selectedIds = options.selectedColumnIds && options.selectedColumnIds.length > 0
    ? options.selectedColumnIds
    : ALL_MEMBER_EXPORT_COLUMNS.filter(c => c.default).map(c => c.id);

  const activeColumns = ALL_MEMBER_EXPORT_COLUMNS.filter(col => selectedIds.includes(col.id));

  // Build rows based on active columns
  const dataRows = users.map((u, idx) => {
    const rowObj: Record<string, any> = {};
    activeColumns.forEach(col => {
      rowObj[col.label] = col.getValue(u, idx);
    });
    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  // Set column widths
  worksheet['!cols'] = activeColumns.map(col => ({ wch: col.width }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Anggota PAMUR');
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Exports members data to UTF-8 CSV with BOM for universal Excel compatibility.
 */
export function exportMembersToCSV(
  users: User[], 
  filenameOrOptions: string | MemberExportOptions = 'Laporan_Data_Anggota_PAMUR.csv'
) {
  const options: MemberExportOptions = typeof filenameOrOptions === 'string'
    ? { filename: filenameOrOptions }
    : filenameOrOptions;

  const filename = options.filename || `Laporan_Data_Anggota_PAMUR_${new Date().toISOString().split('T')[0]}.csv`;
  const selectedIds = options.selectedColumnIds && options.selectedColumnIds.length > 0
    ? options.selectedColumnIds
    : ALL_MEMBER_EXPORT_COLUMNS.filter(c => c.default).map(c => c.id);

  const activeColumns = ALL_MEMBER_EXPORT_COLUMNS.filter(col => selectedIds.includes(col.id));

  const headers = activeColumns.map(c => `"${c.label.replace(/"/g, '""')}"`);

  const rows = users.map((u, idx) => {
    return activeColumns.map(col => {
      const val = String(col.getValue(u, idx) ?? '');
      return `"${val.replace(/"/g, '""')}"`;
    });
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a pre-formatted Excel template for bulk member import.
 */
export function downloadBulkImportTemplateExcel(filename = 'Template_Import_Anggota_PAMUR.xlsx') {
  const templateRows = [
    {
      'Nama Lengkap *': 'Ahmad Fauzi',
      'Email (Opsional)': 'ahmad.fauzi@pamur.id',
      'No. WhatsApp *': '081234567891',
      'Ranting': 'Ranting Kebomas',
      'Tingkat Sabuk': 'Kuning',
      'NIK': '3515012345670001',
      'Tempat Lahir': 'Gresik',
      'Tanggal Lahir (YYYY-MM-DD)': '2005-08-17',
      'Kata Sandi (Opsional)': 'pamur2026'
    },
    {
      'Nama Lengkap *': 'Siti Nurhaliza',
      'Email (Opsional)': '',
      'No. WhatsApp *': '085712345678',
      'Ranting': 'Ranting Manyar',
      'Tingkat Sabuk': 'Putih',
      'NIK': '3515025678900002',
      'Tempat Lahir': 'Surabaya',
      'Tanggal Lahir (YYYY-MM-DD)': '2007-04-12',
      'Kata Sandi (Opsional)': ''
    },
    {
      'Nama Lengkap *': 'Budi Santoso',
      'Email (Opsional)': '',
      'No. WhatsApp *': '081398765432',
      'Ranting': 'Padepokan Pusat Gresik',
      'Tingkat Sabuk': 'Hijau',
      'NIK': '3515037890120003',
      'Tempat Lahir': 'Gresik',
      'Tanggal Lahir (YYYY-MM-DD)': '2003-11-20',
      'Kata Sandi (Opsional)': ''
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  worksheet['!cols'] = [
    { wch: 24 }, // Nama Lengkap
    { wch: 26 }, // Email
    { wch: 18 }, // No WA
    { wch: 24 }, // Ranting
    { wch: 16 }, // Sabuk
    { wch: 22 }, // NIK
    { wch: 16 }, // Tempat Lahir
    { wch: 26 }, // Tanggal Lahir
    { wch: 22 }  // Kata Sandi
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format Import Anggota');
  XLSX.writeFile(workbook, filename);
}

/**
 * Downloads a pre-formatted CSV template for bulk member import.
 */
export function downloadBulkImportTemplateCSV(filename = 'Template_Import_Anggota_PAMUR.csv') {
  const headers = [
    'Nama Lengkap *',
    'Email (Opsional)',
    'No. WhatsApp *',
    'Ranting',
    'Tingkat Sabuk',
    'NIK',
    'Tempat Lahir',
    'Tanggal Lahir (YYYY-MM-DD)',
    'Kata Sandi (Opsional)'
  ];

  const sampleRows = [
    '"Ahmad Fauzi","ahmad.fauzi@pamur.id","081234567891","Ranting Kebomas","Kuning","3515012345670001","Gresik","2005-08-17","pamur2026"',
    '"Siti Nurhaliza","","085712345678","Ranting Manyar","Putih","3515025678900002","Surabaya","2007-04-12",""',
    '"Budi Santoso","","081398765432","Padepokan Pusat Gresik","Hijau","3515037890120003","Gresik","2003-11-20",""'
  ];

  const csvContent = '\uFEFF' + [headers.join(','), ...sampleRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parses raw ArrayBuffer / Binary of XLSX/XLS/CSV into array of User partial objects.
 */
export function parseBulkMemberFile(data: ArrayBuffer | string): Array<Partial<User> & { name: string }> {
  const workbook = XLSX.read(data, { type: typeof data === 'string' ? 'string' : 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  return rawRows
    .map(row => {
      // Flexible field mapping
      const name = (row['Nama Lengkap *'] || row['Nama Lengkap'] || row['Nama'] || row['name'] || '').toString().trim();
      if (!name) return null;

      const email = (row['Email (Opsional)'] || row['Email'] || row['email'] || '').toString().trim();
      const phone = (row['No. WhatsApp *'] || row['No WhatsApp'] || row['No. HP'] || row['No HP'] || row['WhatsApp'] || row['phone'] || '').toString().trim();
      const branch = (row['Ranting'] || row['Cabang'] || row['branch'] || 'Cabang Gresik').toString().trim();
      const beltRank = (row['Tingkat Sabuk'] || row['Sabuk'] || row['beltRank'] || 'Putih').toString().trim();
      const nik = (row['NIK'] || row['nik'] || '').toString().trim();
      const birthPlace = (row['Tempat Lahir'] || row['birthPlace'] || 'Gresik').toString().trim();
      const birthDate = (row['Tanggal Lahir (YYYY-MM-DD)'] || row['Tanggal Lahir'] || row['birthDate'] || '').toString().trim();
      const password = (row['Kata Sandi (Opsional)'] || row['Kata Sandi'] || row['Password'] || row['password'] || '').toString().trim();

      return {
        name,
        email: email || undefined,
        phone: phone || '-',
        branch: branch || 'Cabang Gresik',
        beltRank: (beltRank as any) || 'Putih',
        nik,
        birthPlace,
        birthDate,
        password: password || undefined,
        role: 'anggota' as const,
        status: 'active' as const
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null && u.name.length > 0);
}
