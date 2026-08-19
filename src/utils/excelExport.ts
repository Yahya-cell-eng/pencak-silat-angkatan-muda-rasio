import * as XLSX from 'xlsx';
import { User, TrainingRegistration } from '../types';

/**
 * Exports all members data to a formatted Microsoft Excel (.xlsx) file.
 */
export function exportMembersToExcel(users: User[], filename = 'Data_Anggota_PAMUR_Gresik.xlsx') {
  const data = users.map((u, idx) => ({
    'No': idx + 1,
    'Nomor Anggota (PMR ID)': u.memberId || '-',
    'Nama Lengkap': u.name,
    'Peran (Role)': u.role === 'admin' ? 'Dewan Guru (Admin)' : 'Pesilat (Anggota)',
    'Tingkat Sabuk': u.beltRank || 'Putih',
    'Ranting / Unit': u.branch || 'Cabang Gresik',
    'Email': u.email,
    'No. WhatsApp / HP': u.phone || '-',
    'NIK (KTP/KIA)': u.nik || '-',
    'Tempat Lahir': u.birthPlace || '-',
    'Tanggal Lahir': u.birthDate || '-',
    'Tanggal Bergabung': u.joinDate || '-',
    'Status Akun': u.status === 'active' ? 'Aktif' : 'Non-Aktif',
    'Kontak Darurat': u.emergencyContact || '-',
    'Keterangan / Bio': u.bio || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for clean readability
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 18 }, // PMR ID
    { wch: 26 }, // Nama Lengkap
    { wch: 20 }, // Peran
    { wch: 14 }, // Sabuk
    { wch: 22 }, // Ranting
    { wch: 28 }, // Email
    { wch: 18 }, // No HP/WA
    { wch: 20 }, // NIK
    { wch: 16 }, // Tempat Lahir
    { wch: 14 }, // Tanggal Lahir
    { wch: 16 }, // Tanggal Gabung
    { wch: 12 }, // Status
    { wch: 18 }, // Kontak Darurat
    { wch: 30 }, // Bio
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Anggota PAMUR');
  XLSX.writeFile(workbook, filename);
}

/**
 * Exports members data to UTF-8 CSV with BOM for direct Excel compatibility.
 */
export function exportMembersToCSV(users: User[], filename = 'Data_Anggota_PAMUR_Gresik.csv') {
  const headers = [
    'No',
    'PMR ID',
    'Nama Lengkap',
    'Role',
    'Sabuk',
    'Ranting',
    'Email',
    'No WhatsApp',
    'NIK',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Tanggal Bergabung',
    'Status'
  ];

  const rows = users.map((u, idx) => [
    idx + 1,
    `"${(u.memberId || '').replace(/"/g, '""')}"`,
    `"${(u.name || '').replace(/"/g, '""')}"`,
    `"${u.role}"`,
    `"${u.beltRank || 'Putih'}"`,
    `"${(u.branch || '').replace(/"/g, '""')}"`,
    `"${(u.email || '').replace(/"/g, '""')}"`,
    `"${(u.phone || '').replace(/"/g, '""')}"`,
    `"${(u.nik || '').replace(/"/g, '""')}"`,
    `"${(u.birthPlace || '').replace(/"/g, '""')}"`,
    `"${(u.birthDate || '').replace(/"/g, '""')}"`,
    `"${(u.joinDate || '').replace(/"/g, '""')}"`,
    `"${u.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
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
