import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  User, 
  Article, 
  TrainingSchedule, 
  TrainingRegistration, 
  UserRole, 
  BeltRankLevel, 
  ArticleCategory, 
  TrainingCategory,
  RegistrationStatus,
  AppConfig,
  BranchInfo,
  BeltInfo
} from '../types';
import { 
  downloadBulkImportTemplateExcel, 
  downloadBulkImportTemplateCSV, 
  exportMembersToExcel, 
  exportMembersToCSV 
} from '../utils/excelExport';
import { BulkImportModal } from './BulkImportModal';
import { 
  Lock, 
  Users, 
  UserPlus,
  BookOpen, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  Key, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Eye, 
  X, 
  UserCheck, 
  Activity, 
  Sparkles,
  Sliders,
  Settings,
  FileSpreadsheet,
  Copy,
  Check,
  RotateCcw,
  Building2,
  Bell,
  Palette,
  CreditCard,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  Award,
  QrCode,
  Send,
  MapPin,
  ArrowUp,
  ArrowDown,
  MoveVertical,
  ListOrdered,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    users, 
    articles, 
    schedules, 
    registrations,
    branches,
    beltRanks,
    config,
    updateConfig,
    createBranch,
    updateBranch,
    deleteBranch,
    createBeltRank,
    updateBeltRank,
    reorderBeltRank,
    moveBeltRankToPosition,
    deleteBeltRank,
    resetBeltRanksToDefault,
    adminBulkImportMembers,
    adminUpdateUser, 
    adminResetPassword, 
    adminCreateUser, 
    adminDeleteUser,
    createArticle,
    updateArticle,
    deleteArticle,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    updateRegistrationStatus,
    deleteDemoAccounts,
    resetAllDataToDefault
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'new_members' | 'members' | 'branches' | 'belts' | 'import' | 'users' | 'articles' | 'schedules' | 'registrations' | 'settings'>('overview');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ----------------------------------------------------
  // BRANCH / RANTING MANAGEMENT STATE
  // ----------------------------------------------------
  const [branchSearch, setBranchSearch] = useState('');
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    city: 'Kab. Gresik',
    address: '',
    headCoach: '',
    contact: '0812-3456-7890',
    memberCount: 20
  });

  const [editingBranch, setEditingBranch] = useState<BranchInfo | null>(null);
  const [editBranchForm, setEditBranchForm] = useState({
    name: '',
    city: 'Kab. Gresik',
    address: '',
    headCoach: '',
    contact: '',
    memberCount: 0
  });
  const [isSavingBranch, setIsSavingBranch] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<BranchInfo | null>(null);
  const [quickRenameBranchId, setQuickRenameBranchId] = useState<string | null>(null);
  const [quickRenameValue, setQuickRenameValue] = useState('');

  const handleOpenEditBranch = (branch: BranchInfo) => {
    setEditingBranch(branch);
    setEditBranchForm({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      headCoach: branch.headCoach,
      contact: branch.contact,
      memberCount: branch.memberCount
    });
  };

  const handleSaveEditBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !editBranchForm.name.trim()) return;

    setIsSavingBranch(true);
    const res = await updateBranch(editingBranch.id, {
      name: editBranchForm.name.trim(),
      city: editBranchForm.city.trim(),
      address: editBranchForm.address.trim(),
      headCoach: editBranchForm.headCoach.trim(),
      contact: editBranchForm.contact.trim(),
      memberCount: Number(editBranchForm.memberCount) || 0
    });
    setIsSavingBranch(false);

    if (res.success) {
      showNotification('success', `Nama ranting berhasil diperbarui menjadi "${editBranchForm.name.trim()}". Seluruh data anggota silat dan jadwal terkait telah disinkronkan.`);
      setEditingBranch(null);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleSaveNewBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchForm.name.trim()) return;

    setIsSavingBranch(true);
    const res = await createBranch({
      name: newBranchForm.name.trim(),
      city: newBranchForm.city.trim() || 'Kab. Gresik',
      address: newBranchForm.address.trim() || 'Gresik',
      headCoach: newBranchForm.headCoach.trim() || 'Pelatih Ranting',
      contact: newBranchForm.contact.trim() || '0812-3456-7890',
      memberCount: Number(newBranchForm.memberCount) || 0
    });
    setIsSavingBranch(false);

    if (res.success) {
      showNotification('success', `Ranting "${newBranchForm.name.trim()}" berhasil ditambahkan!`);
      setIsAddBranchModalOpen(false);
      setNewBranchForm({
        name: '',
        city: 'Kab. Gresik',
        address: '',
        headCoach: '',
        contact: '0812-3456-7890',
        memberCount: 20
      });
    } else {
      showNotification('error', res.message);
    }
  };

  const handleQuickRename = async (branchId: string) => {
    if (!quickRenameValue.trim()) {
      setQuickRenameBranchId(null);
      return;
    }
    setIsSavingBranch(true);
    const res = await updateBranch(branchId, { name: quickRenameValue.trim() });
    setIsSavingBranch(false);
    if (res.success) {
      showNotification('success', `Nama ranting berhasil diubah menjadi "${quickRenameValue.trim()}".`);
      setQuickRenameBranchId(null);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleDeleteBranchSubmit = async () => {
    if (!branchToDelete) return;
    setIsSavingBranch(true);
    const res = await deleteBranch(branchToDelete.id);
    setIsSavingBranch(false);
    if (res.success) {
      showNotification('success', res.message);
      setBranchToDelete(null);
    } else {
      showNotification('error', res.message);
    }
  };

  // ----------------------------------------------------
  // BELT RANK & HIERARCHY MANAGEMENT STATE
  // ----------------------------------------------------
  const [beltSearch, setBeltSearch] = useState('');
  const [isAddBeltModalOpen, setIsAddBeltModalOpen] = useState(false);
  const [newBeltForm, setNewBeltForm] = useState({
    level: '',
    meaning: '',
    stage: 'Tingkat Menengah',
    colorHex: '#eab308',
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-600',
    description: ''
  });

  const [editingBelt, setEditingBelt] = useState<BeltInfo | null>(null);
  const [editBeltForm, setEditBeltForm] = useState({
    level: '',
    meaning: '',
    stage: '',
    colorHex: '#ffffff',
    bgColor: '',
    textColor: '',
    borderColor: '',
    description: '',
    order: 1
  });
  const [isSavingBelt, setIsSavingBelt] = useState(false);
  const [beltToDelete, setBeltToDelete] = useState<BeltInfo | null>(null);
  const [quickRenameBeltId, setQuickRenameBeltId] = useState<string | null>(null);
  const [quickRenameBeltValue, setQuickRenameBeltValue] = useState('');

  const beltColorPresets = [
    { label: 'Putih / Dasar', hex: '#f8fafc', bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300' },
    { label: 'Kuning', hex: '#eab308', bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-600' },
    { label: 'Hijau', hex: '#16a34a', bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700' },
    { label: 'Biru', hex: '#2563eb', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
    { label: 'Cokelat', hex: '#78350f', bg: 'bg-amber-900', text: 'text-white', border: 'border-amber-950' },
    { label: 'Merah', hex: '#dc2626', bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' },
    { label: 'Hitam', hex: '#0f172a', bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-700' },
    { label: 'Emas / Strip', hex: '#d97706', bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600' },
    { label: 'Ungu', hex: '#7c3aed', bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' }
  ];

  const handleOpenEditBelt = (belt: BeltInfo) => {
    setEditingBelt(belt);
    setEditBeltForm({
      level: belt.level,
      meaning: belt.meaning || '',
      stage: belt.stage || '',
      colorHex: belt.colorHex || '#ffffff',
      bgColor: belt.bgColor || 'bg-slate-100',
      textColor: belt.textColor || 'text-slate-900',
      borderColor: belt.borderColor || 'border-slate-300',
      description: belt.description || '',
      order: belt.order
    });
  };

  const handleSaveEditBelt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBelt || !editBeltForm.level.trim()) return;

    setIsSavingBelt(true);
    const res = await updateBeltRank(editingBelt.id, {
      level: editBeltForm.level.trim() as BeltRankLevel,
      meaning: editBeltForm.meaning.trim(),
      stage: editBeltForm.stage.trim(),
      colorHex: editBeltForm.colorHex,
      bgColor: editBeltForm.bgColor,
      textColor: editBeltForm.textColor,
      borderColor: editBeltForm.borderColor,
      description: editBeltForm.description.trim(),
      order: Number(editBeltForm.order) || editingBelt.order
    });
    setIsSavingBelt(false);

    if (res.success) {
      showNotification('success', `Tingkat sabuk berhasil diperbarui menjadi "${editBeltForm.level.trim()}". Seluruh profil anggota dan jadwal latihan otomatis disinkronkan.`);
      setEditingBelt(null);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleSaveNewBelt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeltForm.level.trim()) return;

    setIsSavingBelt(true);
    const res = await createBeltRank({
      level: newBeltForm.level.trim() as BeltRankLevel,
      meaning: newBeltForm.meaning.trim() || `Tingkat Sabuk ${newBeltForm.level.trim()}`,
      stage: newBeltForm.stage.trim() || 'Tingkat Pembinaan',
      colorHex: newBeltForm.colorHex || '#eab308',
      bgColor: newBeltForm.bgColor || 'bg-yellow-500',
      textColor: newBeltForm.textColor || 'text-white',
      borderColor: newBeltForm.borderColor || 'border-yellow-600',
      description: newBeltForm.description.trim() || `Penguasaan materi jurus dan fisik tingkat ${newBeltForm.level.trim()}`
    });
    setIsSavingBelt(false);

    if (res.success) {
      showNotification('success', `Sabuk "${newBeltForm.level.trim()}" berhasil ditambahkan ke urutan tingkatan PAMUR!`);
      setIsAddBeltModalOpen(false);
      setNewBeltForm({
        level: '',
        meaning: '',
        stage: 'Tingkat Menengah',
        colorHex: '#eab308',
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        borderColor: 'border-yellow-600',
        description: ''
      });
    } else {
      showNotification('error', res.message);
    }
  };

  const handleQuickRenameBelt = async (beltId: string) => {
    if (!quickRenameBeltValue.trim()) {
      setQuickRenameBeltId(null);
      return;
    }
    setIsSavingBelt(true);
    const res = await updateBeltRank(beltId, { level: quickRenameBeltValue.trim() as BeltRankLevel });
    setIsSavingBelt(false);
    if (res.success) {
      showNotification('success', `Nama sabuk berhasil diubah menjadi "${quickRenameBeltValue.trim()}".`);
      setQuickRenameBeltId(null);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleMoveBelt = async (beltId: string, direction: 'up' | 'down') => {
    setIsSavingBelt(true);
    const res = await reorderBeltRank(beltId, direction);
    setIsSavingBelt(false);
    if (res.success) {
      showNotification('success', 'Urutan sabuk berhasil diperbarui.');
    } else {
      showNotification('error', res.message);
    }
  };

  const handleMoveBeltToPosition = async (beltId: string, targetOrder: number) => {
    setIsSavingBelt(true);
    const res = await moveBeltRankToPosition(beltId, targetOrder);
    setIsSavingBelt(false);
    if (res.success) {
      showNotification('success', `Posisi urutan sabuk berhasil dipindahkan ke peringkat ${targetOrder}.`);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleDeleteBeltSubmit = async () => {
    if (!beltToDelete) return;
    setIsSavingBelt(true);
    const res = await deleteBeltRank(beltToDelete.id);
    setIsSavingBelt(false);
    if (res.success) {
      showNotification('success', res.message);
      setBeltToDelete(null);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleResetBeltDefault = async () => {
    if (window.confirm('Kembalikan urutan & nama sabuk ke standar resmi 7 Tingkatan PAMUR (Dasar, Putih, Kuning, Hijau, Biru, Merah, Hitam)?')) {
      setIsSavingBelt(true);
      const res = await resetBeltRanksToDefault();
      setIsSavingBelt(false);
      if (res.success) {
        showNotification('success', 'Urutan dan nama sabuk berhasil direset ke standar resmi PAMUR.');
      } else {
        showNotification('error', res.message);
      }
    }
  };

  // ----------------------------------------------------
  // APP CONFIG & LOGO SETTINGS STATE
  // ----------------------------------------------------
  const [configForm, setConfigForm] = useState<AppConfig>(config);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    if (config) {
      setConfigForm(config);
    }
  }, [config]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const res = await updateConfig(configForm);
    setIsSavingConfig(false);
    if (res.success) {
      showNotification('success', 'Pengaturan aplikasi dan logo berhasil diperbarui.');
    } else {
      showNotification('error', 'Gagal memperbarui konfigurasi: ' + res.message);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigForm(prev => ({ ...prev, logoUrl: reader.result as string }));
        showNotification('success', 'Logo berhasil diunggah dari file gambar.');
      };
      reader.readAsDataURL(file);
    }
  };

  // ----------------------------------------------------
  // MEMBER BULK IMPORT & AUTO PASSWORD STATE
  // ----------------------------------------------------
  const [importRawText, setImportRawText] = useState('');
  const [importParsedList, setImportParsedList] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{ member: any; generatedPassword: string }[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [hasCopiedCredentials, setHasCopiedCredentials] = useState(false);

  const sampleCSVTemplate = `Nama,Email,NIK,Tempat Lahir,Tanggal Lahir,No Telepon,Sabuk,Ranting
Ahmad Fauzi,ahmad.fauzi@gmail.com,3525011205980001,Gresik,1998-05-12,081234567801,Kuning,Ranting Kebomas
Budi Santoso,budi.santoso@yahoo.com,3525021508000002,Gresik,2000-08-15,081234567802,Hijau,Ranting Manyar
Citra Dewi,citra.dewi@gmail.com,3525032001020003,Gresik,2002-01-20,081234567803,Putih,Ranting Driyorejo
Dimas Pratama,dimas.pratama@gmail.com,3525041003990004,Surabaya,1999-03-10,081234567804,Biru,Ranting Menganti
Eka Rahmawati,eka.rahmawati@gmail.com,3525052511010005,Gresik,2001-11-25,081234567805,Merah,Ranting Cerme`;

  const handleParseCSV = (rawText: string) => {
    if (!rawText.trim()) {
      setImportParsedList([]);
      return;
    }

    const lines = rawText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      showNotification('error', 'Format data tidak valid atau minimal butuh 1 baris judul dan 1 baris anggota.');
      return;
    }

    const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase().replace(/["']/g, ''));
    const parsed: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      const obj: any = {};

      headers.forEach((h, idx) => {
        obj[h] = cols[idx] || '';
      });

      // Map to standard fields
      const name = obj['nama'] || obj['name'] || obj['nama lengkap'] || cols[0] || '';
      const email = obj['email'] || obj['alamat email'] || cols[1] || '';
      const nik = obj['nik'] || obj['nomor induk'] || obj['no ktp'] || cols[2] || '';
      const birthPlace = obj['tempat lahir'] || obj['tempat_lahir'] || obj['birthplace'] || cols[3] || 'Gresik';
      const birthDate = obj['tanggal lahir'] || obj['tanggal_lahir'] || obj['birthdate'] || cols[4] || '2000-01-01';
      const phone = obj['no telepon'] || obj['telepon'] || obj['phone'] || obj['no wa'] || cols[5] || '0812-3456-7890';
      const beltRank = (obj['sabuk'] || obj['tingkat sabuk'] || obj['belt'] || cols[6] || 'Putih') as BeltRankLevel;
      const ranting = obj['ranting'] || obj['cabang'] || cols[7] || 'Ranting Kebomas';
      const role = (obj['role'] || 'anggota') as UserRole;
      const emergencyContact = obj['kontak darurat'] || obj['wali'] || '';

      if (name) {
        parsed.push({
          name,
          email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@pamur.id`,
          nik,
          birthPlace,
          birthDate,
          phone,
          beltRank,
          branch: ranting,
          role,
          emergencyContact
        });
      }
    }

    setImportParsedList(parsed);
    showNotification('success', `Berhasil memuat ${parsed.length} data calon pesilat untuk diimpor.`);
  };

  const handleFileUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setImportRawText(text);
        handleParseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const handleRunBulkImport = async () => {
    if (importParsedList.length === 0) {
      showNotification('error', 'Belum ada data anggota yang siap diimpor.');
      return;
    }

    setIsImporting(true);
    const res = await adminBulkImportMembers(importParsedList);
    setIsImporting(false);

    if (res.success && res.results) {
      setImportResults(res.results);
      setImportParsedList([]);
      setImportRawText('');
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message || 'Gagal mengimpor anggota.');
    }
  };

  const handleCopyCredentials = () => {
    if (!importResults) return;
    const textLines = importResults.map(r => 
      `Nama: ${r.member.name} | PMR ID: ${r.member.memberId} | Email/Login: ${r.member.email} | Kata Sandi: ${r.generatedPassword} | Sabuk: ${r.member.beltRank} | Ranting: ${r.member.branch}`
    ).join('\n');

    navigator.clipboard.writeText(textLines);
    setHasCopiedCredentials(true);
    setTimeout(() => setHasCopiedCredentials(false), 3000);
    showNotification('success', 'Semua kredensial berhasil disalin ke clipboard.');
  };

  const handleDownloadCredentialsCSV = () => {
    if (!importResults) return;
    const headers = ['Nomor Anggota (PMR ID)', 'Nama Pesilat', 'Email Login', 'Kata Sandi Otomatis', 'NIK', 'Tempat Lahir', 'Tanggal Lahir', 'No Telepon', 'Tingkat Sabuk', 'Ranting Gresik', 'Role'];
    const rows = importResults.map(r => [
      `"${r.member.memberId}"`,
      `"${r.member.name}"`,
      `"${r.member.email}"`,
      `"${r.generatedPassword}"`,
      `"${r.member.nik || '-'}"`,
      `"${r.member.birthPlace || '-'}"`,
      `"${r.member.birthDate || '-'}"`,
      `"${r.member.phone || '-'}"`,
      `"${r.member.beltRank}"`,
      `"${r.member.branch}"`,
      `"${r.member.role}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kredensial_login_pesilat_pamur_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'File kredensial akun login berhasil diunduh.');
  };

  // ----------------------------------------------------
  // NEW MEMBERS MANAGEMENT STATE & HELPERS
  // ----------------------------------------------------
  const [newMemberSearch, setNewMemberSearch] = useState('');
  const [newMemberStatusFilter, setNewMemberStatusFilter] = useState<string>('Semua');
  const [newMemberBranchFilter, setNewMemberBranchFilter] = useState<string>('Semua');
  const [newMemberBeltFilter, setNewMemberBeltFilter] = useState<string>('Semua');
  const [newMemberTimeFilter, setNewMemberTimeFilter] = useState<string>('all');
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<User | null>(null);
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);

  // Form state for adding new member
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [addMemName, setAddMemName] = useState('');
  const [addMemEmail, setAddMemEmail] = useState('');
  const [addMemPassword, setAddMemPassword] = useState('');
  const [addMemPhone, setAddMemPhone] = useState('');
  const [addMemNik, setAddMemNik] = useState('');
  const [addMemBirthPlace, setAddMemBirthPlace] = useState('Gresik');
  const [addMemBirthDate, setAddMemBirthDate] = useState('2005-01-01');
  const [addMemBranch, setAddMemBranch] = useState(branches[0]?.name || 'Ranting Kebomas');
  const [addMemBelt, setAddMemBelt] = useState<BeltRankLevel>('Dasar');
  const [addMemStatus, setAddMemStatus] = useState<'active' | 'pending' | 'inactive'>('active');
  const [addMemEmergency, setAddMemEmergency] = useState('');
  const [addMemBio, setAddMemBio] = useState('');

  // Auto generator helper for new member registration
  const generateRandomPassword = () => {
    const prefix = config.defaultPasswordPrefix || 'pamur';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randDigits}`;
  };

  const handleVerifyAndActivateMember = async (member: User) => {
    const res = await adminUpdateUser(member.id, { status: 'active' });
    if (res.success) {
      showNotification('success', `Pesilat ${member.name} (${member.memberId}) berhasil diverifikasi & diaktifkan!`);
    } else {
      showNotification('error', 'Gagal memverifikasi: ' + res.message);
    }
  };

  const handleSendWhatsAppNotification = (member: User) => {
    const rawPhone = (member.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : (rawPhone.startsWith('62') ? rawPhone : (rawPhone.length >= 8 ? '62' + rawPhone : ''));
    const loginPass = member.password || 'pamur2026';
    const appUrl = window.location.origin;

    const messageText = 
`Salam Persaudaraan PAMUR! 🙏

Selamat, pendaftaran Anda sebagai pesilat di *Perguruan Pencak Silat Angkatan Muda Rasio (PAMUR) Cabang Gresik* telah terverifikasi dan resmi aktif.

Berikut data keanggotaan resmi Anda:
• *Nomor Anggota (PMR ID)*: ${member.memberId}
• *Nama Lengkap*: ${member.name}
• *Tingkat Sabuk*: Sabuk ${member.beltRank}
• *Ranting / Unit*: ${member.branch || 'Cabang Gresik'}
• *Email Login*: ${member.email}
• *Kata Sandi*: ${loginPass}

Silakan masuk ke portal resmi PAMUR untuk melihat Kartu Tanda Anggota (KTA) Digital dan pendaftaran jadwal latihan:
👉 ${appUrl}

Tetap semangat berlatih, junjung tinggi budi luhur dan ketajaman rasio silat!`;

    if (cleanPhone && cleanPhone.length >= 10) {
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(url, '_blank');
      showNotification('success', `Membuka WhatsApp untuk ${member.name}...`);
    } else {
      navigator.clipboard.writeText(messageText);
      showNotification('success', 'Nomor WA tidak valid. Format pesan resmi & kredensial telah disalin ke clipboard!');
    }
  };

  const handleCopySingleCredential = (member: User) => {
    const text = `Pesilat: ${member.name} | PMR ID: ${member.memberId} | Email: ${member.email} | Sandi: ${member.password || 'pamur2026'} | Sabuk: ${member.beltRank} | Ranting: ${member.branch}`;
    navigator.clipboard.writeText(text);
    setCopiedMemberId(member.id);
    setTimeout(() => setCopiedMemberId(null), 2500);
    showNotification('success', `Kredensial login ${member.name} berhasil disalin.`);
  };

  // ----------------------------------------------------
  // USER & PASSWORD MANAGEMENT STATE
  // ----------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('Semua');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('user123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('anggota');
  const [newUserPhone, setNewUserPhone] = useState('0812-3456-7890');
  const [newUserBirthPlace, setNewUserBirthPlace] = useState('Gresik');
  const [newUserBirthDate, setNewUserBirthDate] = useState('2000-01-01');
  const [newUserNik, setNewUserNik] = useState('');
  const [newUserBranch, setNewUserBranch] = useState(branches[0]?.name || 'Ranting Kebomas');
  const [newUserBelt, setNewUserBelt] = useState<BeltRankLevel>('Putih');

  // ----------------------------------------------------
  // ARTICLE MANAGEMENT STATE
  // ----------------------------------------------------
  const [articleSearch, setArticleSearch] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  // Article Form Fields
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>('Berita & Kegiatan');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artImageUrl, setArtImageUrl] = useState('');
  const [artTags, setArtTags] = useState('PAMUR, Pencak Silat, Latihan');
  const [artStatus, setArtStatus] = useState<'published' | 'draft'>('published');

  // Preset Photos
  const presetPhotos = [
    { label: 'Jurus & Latihan', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80' },
    { label: 'Fisik & UKT', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kejuaraan & Tanding', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80' },
    { label: 'Padepokan & Dojo', url: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&auto=format&fit=crop&q=80' },
    { label: 'Seni Silat Nusantara', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80' }
  ];

  // ----------------------------------------------------
  // SCHEDULE MANAGEMENT STATE
  // ----------------------------------------------------
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  
  // Schedule Form Fields
  const [schTitle, setSchTitle] = useState('');
  const [schDay, setSchDay] = useState('Sabtu');
  const [schDate, setSchDate] = useState(new Date().toISOString().split('T')[0]);
  const [schTimeStart, setSchTimeStart] = useState('16:00');
  const [schTimeEnd, setSchTimeEnd] = useState('18:00');
  const [schLocation, setSchLocation] = useState('Padepokan PAMUR Pusat');
  const [schBranch, setSchBranch] = useState(branches[0]?.name || 'Ranting Kebomas');
  const [schCoach, setSchCoach] = useState('Dewan Guru PAMUR');
  const [schTargetBelt, setSchTargetBelt] = useState('Semua Tingkatan');
  const [schCategory, setSchCategory] = useState<TrainingCategory>('Latihan Reguler');
  const [schMaxQuota, setSchMaxQuota] = useState(30);
  const [schStatus, setSchStatus] = useState<'buka' | 'tutup' | 'dibatalkan'>('buka');
  const [schRequirements, setSchRequirements] = useState('Seragam silat PAMUR lengkap + Sabuk');
  const [schDescription, setSchDescription] = useState('Fokus latihan teknik gerak dasar dan aplikasi.');

  // ----------------------------------------------------
  // REGISTRATIONS MANAGEMENT STATE
  // ----------------------------------------------------
  const [regFilterScheduleId, setRegFilterScheduleId] = useState<string>('Semua');

  // Handle local image file upload preview
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtImageUrl(reader.result as string);
        showNotification('success', 'Foto artikel berhasil dimuat dari file lokal.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Members to Excel (.xlsx)
  const handleExportMembersExcel = () => {
    try {
      exportMembersToExcel(users, `Data_Anggota_PAMUR_Gresik_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification('success', `Berhasil mengekspor ${users.length} data anggota ke file Excel (.xlsx).`);
    } catch (err: any) {
      showNotification('error', 'Gagal membuat file Excel: ' + (err?.message || 'Error'));
    }
  };

  // Export Members to CSV
  const handleExportMembersCSV = () => {
    try {
      exportMembersToCSV(users, `Data_Anggota_PAMUR_Gresik_${new Date().toISOString().split('T')[0]}.csv`);
      showNotification('success', `Berhasil mengekspor ${users.length} data anggota ke file CSV.`);
    } catch (err: any) {
      showNotification('error', 'Gagal membuat file CSV: ' + (err?.message || 'Error'));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SISTEM ADMINISTRASI PERGURUAN PAMUR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
              Panel Kendali Admin
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Kelola akun pengguna & reset password, terbitkan artikel dengan foto, kelola jadwal latihan, serta pantau verifikasi pendaftaran sesi latihan online.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={async () => {
                if (window.confirm('Reset semua data artikel, user, jadwal, dan pendaftaran ke awal di cloud database?')) {
                  await resetAllDataToDefault();
                  showNotification('success', 'Data berhasil direset ke seed default di online database.');
                }
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset Data Awal
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100">
          {[
            { id: 'overview', label: 'Ringkasan', icon: Activity },
            { 
              id: 'new_members', 
              label: 'Daftar Anggota Baru', 
              icon: UserPlus, 
              badge: users.filter(u => u.status === 'pending').length > 0 
                ? `${users.filter(u => u.status === 'pending').length} Baru` 
                : undefined,
              badgeColor: 'bg-amber-500'
            },
            { id: 'members', label: 'Data Anggota Silat', icon: Users },
            { id: 'branches', label: 'Kelola Ranting & Sasana', icon: MapPin },
            { id: 'belts', label: 'Kelola Sabuk & Urutan', icon: Award },
            { id: 'import', label: 'Impor Anggota (Auto Sandi)', icon: FileSpreadsheet },
            { id: 'users', label: 'Kelola Pengguna & Password', icon: Key },
            { id: 'articles', label: 'Kelola Artikel & Foto', icon: BookOpen },
            { id: 'schedules', label: 'Kelola Jadwal Latihan', icon: Calendar },
            { id: 'registrations', label: 'Verifikasi Pendaftar', icon: UserCheck },
            { id: 'settings', label: 'Pengaturan Fitur & Logo', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-red-700' : 'bg-red-600 text-white animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-xs ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & STATS */}
      {/* ======================================================== */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Total Pengguna</span>
                <Users className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-serif">{users.length}</div>
              <div className="text-[11px] text-slate-500">
                {users.filter(u => u.role === 'admin').length} Admin &bull; {users.filter(u => u.role === 'anggota').length} Anggota
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-xs bg-linear-to-br from-amber-50/50 to-white">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Anggota Baru / Pending</span>
                <UserPlus className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900 font-serif">
                {users.filter(u => u.status === 'pending' || u.beltRank === 'Dasar' || u.beltRank === 'Putih').length}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                <span>{users.filter(u => u.status === 'pending').length} butuh verifikasi</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Artikel Terbit</span>
                <BookOpen className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-serif">{articles.length}</div>
              <div className="text-[11px] text-slate-500">
                {articles.reduce((acc, a) => acc + a.views, 0)} total pembaca
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Sesi Jadwal Latihan</span>
                <Calendar className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-serif">{schedules.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {schedules.filter(s => s.status === 'buka').length} Sesi Terbuka
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Pendaftaran Online</span>
                <UserCheck className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-serif">{registrations.length}</div>
              <div className="text-[11px] text-slate-500">
                {registrations.filter(r => r.status === 'Terkonfirmasi').length} Menunggu Hadir
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Pintasan Manajemen Cepat:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setActiveAdminTab('new_members')}
                className="p-4 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left space-y-1.5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-amber-950 flex items-center justify-between">
                  <span>Kelola Anggota Baru</span>
                  {users.filter(u => u.status === 'pending').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  )}
                </div>
                <div className="text-[11px] text-amber-800">Verifikasi pendaftar baru, tetapkan PMR ID, dan kirim pesan WA selamat datang.</div>
              </button>

              <button
                onClick={() => setActiveAdminTab('import')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Impor Data Anggota Massal</div>
                <div className="text-[11px] text-slate-500">Upload Excel & otomatis buatkan akun serta kata sandi login.</div>
              </button>

              <button
                onClick={() => setActiveAdminTab('settings')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Ubah Logo & Pengaturan Fitur</div>
                <div className="text-[11px] text-slate-500">Kustomisasi logo perguruan, nama, tema, dan toggle modul.</div>
              </button>

              <button
                onClick={() => {
                  setEditingArticleId(null);
                  setArtTitle('');
                  setArtExcerpt('');
                  setArtContent('');
                  setArtImageUrl(presetPhotos[0].url);
                  setIsArticleModalOpen(true);
                }}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Buat Artikel & Foto Baru</div>
                <div className="text-[11px] text-slate-500">Tulis panduan jurus, liputan tanding, atau warta resmi.</div>
              </button>

              <button
                onClick={() => {
                  setEditingScheduleId(null);
                  setSchTitle('Latihan Reguler & Fisik');
                  setIsScheduleModalOpen(true);
                }}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Tambah Sesi Latihan Baru</div>
                <div className="text-[11px] text-slate-500">Atur hari, jam, ranting di Gresik, dan kuota.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KELOLA & DAFTAR ANGGOTA BARU */}
      {/* ======================================================== */}
      {activeAdminTab === 'new_members' && (() => {
        // Compute filtered members for this view
        const filteredMembers = users.filter((u) => {
          // Exclude admin unless specifically searching
          if (u.role === 'admin' && newMemberStatusFilter !== 'admin') return false;

          // Search term
          const q = newMemberSearch.toLowerCase().trim();
          if (q) {
            const mName = (u.name || '').toLowerCase().includes(q);
            const mEmail = (u.email || '').toLowerCase().includes(q);
            const mPmr = (u.memberId || '').toLowerCase().includes(q);
            const mNik = (u.nik || '').toLowerCase().includes(q);
            const mPhone = (u.phone || '').toLowerCase().includes(q);
            const mBranch = (u.branch || '').toLowerCase().includes(q);
            if (!mName && !mEmail && !mPmr && !mNik && !mPhone && !mBranch) {
              return false;
            }
          }

          // Status filter
          if (newMemberStatusFilter !== 'Semua') {
            if (u.status !== newMemberStatusFilter) return false;
          }

          // Belt filter
          if (newMemberBeltFilter !== 'Semua') {
            if (u.beltRank !== newMemberBeltFilter) return false;
          }

          // Branch filter
          if (newMemberBranchFilter !== 'Semua') {
            if (u.branch !== newMemberBranchFilter) return false;
          }

          // Time filter
          if (newMemberTimeFilter === '7days' && u.joinDate) {
            const diff = (Date.now() - new Date(u.joinDate).getTime()) / (1000 * 3600 * 24);
            if (diff > 7) return false;
          } else if (newMemberTimeFilter === '30days' && u.joinDate) {
            const diff = (Date.now() - new Date(u.joinDate).getTime()) / (1000 * 3600 * 24);
            if (diff > 30) return false;
          }

          return true;
        });

        const pendingCount = users.filter(u => u.status === 'pending').length;
        const activeCount = users.filter(u => u.status === 'active' && u.role === 'anggota').length;
        const basicBeltCount = users.filter(u => u.beltRank === 'Dasar' || u.beltRank === 'Putih').length;

        return (
          <div className="space-y-6">
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Kelola Daftar Anggota Baru PAMUR</h2>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      {pendingCount} Perlu Verifikasi
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Verifikasi pendaftaran anggota/pesilat baru, kelola PMR ID, tetapkan sabuk awal (Dasar/Putih), serta kirim kredensial login via WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="admin-add-new-member-btn"
                  onClick={() => {
                    const nextNum = Math.floor(1000 + Math.random() * 9000);
                    setAddMemName('');
                    setAddMemEmail('');
                    setAddMemPassword(generateRandomPassword());
                    setAddMemPhone('');
                    setAddMemNik('');
                    setAddMemBirthPlace('Gresik');
                    setAddMemBirthDate('2005-01-01');
                    setAddMemBranch(branches[0]?.name || 'Ranting Kebomas');
                    setAddMemBelt('Dasar');
                    setAddMemStatus('active');
                    setAddMemEmergency('');
                    setAddMemBio('');
                    setIsAddMemberModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Daftarkan Anggota Baru</span>
                </button>

                <button
                  onClick={() => setIsBulkImportModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Impor Massal (Excel)</span>
                </button>

                <button
                  onClick={() => exportMembersToExcel(filteredMembers, `Pendaftar_Anggota_Baru_PAMUR_${new Date().toISOString().split('T')[0]}.xlsx`)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ekspor Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Total Anggota Terdaftar</span>
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-serif">
                  {users.filter(u => u.role === 'anggota').length}
                </div>
                <div className="text-[11px] text-slate-500">Semua pesilat cabang Gresik</div>
              </div>

              <div className={`border rounded-xl p-4 space-y-1 shadow-xs ${
                pendingCount > 0 
                  ? 'bg-amber-50/80 border-amber-300' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={pendingCount > 0 ? 'text-amber-800 font-bold' : 'text-slate-500'}>
                    Menunggu Verifikasi
                  </span>
                  <AlertCircle className={`w-4 h-4 ${pendingCount > 0 ? 'text-amber-700 animate-bounce' : 'text-slate-400'}`} />
                </div>
                <div className={`text-2xl font-bold font-serif ${pendingCount > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
                  {pendingCount}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {pendingCount > 0 ? 'Butuh konfirmasi admin' : 'Semua pendaftar terverifikasi'}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Anggota Aktif Resmi</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-800 font-serif">
                  {activeCount}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">Memiliki KTA & akses latihan</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Sabuk Dasar & Putih</span>
                  <Award className="w-4 h-4 text-red-700" />
                </div>
                <div className="text-2xl font-bold text-red-700 font-serif">
                  {basicBeltCount}
                </div>
                <div className="text-[11px] text-slate-500">Tingkat pemula / calon pesilat</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newMemberSearch}
                    onChange={(e) => setNewMemberSearch(e.target.value)}
                    placeholder="Cari nama pesilat, email, PMR ID, NIK, atau nomor WhatsApp..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                  {newMemberSearch && (
                    <button 
                      onClick={() => setNewMemberSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
                  <select
                    value={newMemberStatusFilter}
                    onChange={(e) => setNewMemberStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="pending">Menunggu Verifikasi (Pending)</option>
                    <option value="active">Aktif / Terverifikasi</option>
                    <option value="inactive">Non-Aktif</option>
                  </select>
                </div>

                {/* Belt Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Sabuk:</span>
                  <select
                    value={newMemberBeltFilter}
                    onChange={(e) => setNewMemberBeltFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  >
                    <option value="Semua">Semua Sabuk</option>
                    {beltRanks.map(b => (
                      <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                    ))}
                  </select>
                </div>

                {/* Branch Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Ranting:</span>
                  <select
                    value={newMemberBranchFilter}
                    onChange={(e) => setNewMemberBranchFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  >
                    <option value="Semua">Semua Ranting Gresik</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Time Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Waktu:</span>
                  <select
                    value={newMemberTimeFilter}
                    onChange={(e) => setNewMemberTimeFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="7days">7 Hari Terakhir</option>
                    <option value="30days">30 Hari Terakhir</option>
                  </select>
                </div>
              </div>

              {/* Active filters chips */}
              {(newMemberSearch || newMemberStatusFilter !== 'Semua' || newMemberBeltFilter !== 'Semua' || newMemberBranchFilter !== 'Semua' || newMemberTimeFilter !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">Filter Aktif:</span>
                  {newMemberSearch && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium flex items-center gap-1">
                      Cari: "{newMemberSearch}"
                      <button onClick={() => setNewMemberSearch('')}><X className="w-3 h-3 text-slate-500" /></button>
                    </span>
                  )}
                  {newMemberStatusFilter !== 'Semua' && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium flex items-center gap-1">
                      Status: {newMemberStatusFilter === 'pending' ? 'Menunggu Verifikasi' : newMemberStatusFilter === 'active' ? 'Aktif' : 'Non-Aktif'}
                      <button onClick={() => setNewMemberStatusFilter('Semua')}><X className="w-3 h-3 text-amber-600" /></button>
                    </span>
                  )}
                  {newMemberBeltFilter !== 'Semua' && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded-md font-medium flex items-center gap-1">
                      Sabuk: {newMemberBeltFilter}
                      <button onClick={() => setNewMemberBeltFilter('Semua')}><X className="w-3 h-3 text-red-600" /></button>
                    </span>
                  )}
                  {newMemberBranchFilter !== 'Semua' && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium flex items-center gap-1">
                      Ranting: {newMemberBranchFilter}
                      <button onClick={() => setNewMemberBranchFilter('Semua')}><X className="w-3 h-3 text-slate-500" /></button>
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      setNewMemberSearch('');
                      setNewMemberStatusFilter('Semua');
                      setNewMemberBeltFilter('Semua');
                      setNewMemberBranchFilter('Semua');
                      setNewMemberTimeFilter('all');
                    }}
                    className="text-red-700 hover:text-red-800 font-bold ml-auto"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )}
            </div>

            {/* Main Members Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span>Menampilkan {filteredMembers.length} dari total {users.filter(u => u.role === 'anggota').length} Pesilat</span>
                  {filteredMembers.length === 0 && (
                    <span className="text-red-600 font-normal">(Tidak ditemukan data yang sesuai)</span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Pesilat Baru</th>
                      <th className="p-3.5">Nomor PMR ID</th>
                      <th className="p-3.5">NIK & Tempat/Tgl Lahir</th>
                      <th className="p-3.5">Ranting & Kontak WA</th>
                      <th className="p-3.5">Tingkat Sabuk</th>
                      <th className="p-3.5">Status Akun</th>
                      <th className="p-3.5 text-right">Aksi Kelola & Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredMembers.map((mem) => {
                      const isPending = mem.status === 'pending';
                      const isBasic = mem.beltRank === 'Dasar' || mem.beltRank === 'Putih';
                      const isCopied = copiedMemberId === mem.id;

                      return (
                        <tr key={mem.id} className={`hover:bg-slate-50/70 transition-colors ${
                          isPending ? 'bg-amber-50/30' : ''
                        }`}>
                          {/* Pesilat Info */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={mem.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mem.name)}`}
                                alt={mem.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{mem.name}</span>
                                  {isPending && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-white">
                                      BARU
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">{mem.email}</div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>Daftar: {mem.joinDate || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* PMR ID */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                {mem.memberId}
                              </span>
                              <button
                                onClick={() => handleCopySingleCredential(mem)}
                                title="Salin Kredensial Lengkap"
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          {/* NIK & Birth */}
                          <td className="p-3.5">
                            <div className="font-mono text-slate-800 font-medium">{mem.nik || '-'}</div>
                            <div className="text-[11px] text-slate-500">
                              {mem.birthPlace ? `${mem.birthPlace}, ` : ''}{mem.birthDate || '-'}
                            </div>
                          </td>

                          {/* Branch & Contact */}
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{mem.branch || 'Cabang Gresik'}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-slate-600">{mem.phone || '-'}</span>
                              {mem.phone && (
                                <button
                                  onClick={() => handleSendWhatsAppNotification(mem)}
                                  title="Kirim pesan konfirmasi WA"
                                  className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 hover:underline"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>WA</span>
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Belt Rank */}
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              mem.beltRank === 'Dasar'
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : mem.beltRank === 'Putih'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : mem.beltRank === 'Kuning'
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
                                : mem.beltRank === 'Hijau'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : mem.beltRank === 'Biru'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : mem.beltRank === 'Merah'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-slate-900 text-white border-slate-900'
                            }`}>
                              Sabuk {mem.beltRank}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            {isPending ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                                Menunggu Verifikasi
                              </span>
                            ) : mem.status === 'active' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Aktif / Terverifikasi
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                Non-Aktif
                              </span>
                            )}
                          </td>

                          {/* Admin Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Verify Button */}
                              {isPending && (
                                <button
                                  onClick={() => handleVerifyAndActivateMember(mem)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                                  title="Verifikasi & Aktifkan Anggota Sekarang"
                                >
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verifikasi</span>
                                </button>
                              )}

                              {/* WhatsApp Direct Greeting */}
                              <button
                                onClick={() => handleSendWhatsAppNotification(mem)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md transition-colors"
                                title="Kirim Data Login & Pesan Sambutan ke WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              {/* View KTA Preview & Detail */}
                              <button
                                onClick={() => setSelectedMemberForDetail(mem)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                title="Lihat KTA Digital & Data Lengkap"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Member */}
                              <button
                                onClick={() => setSelectedUserForEdit(mem)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                title="Edit Data Pesilat"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Reset Password */}
                              <button
                                onClick={() => {
                                  setResetPasswordUserId(mem.id);
                                  setNewPasswordValue(generateRandomPassword());
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                title="Reset Kata Sandi"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Member */}
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Hapus pendaftaran pesilat ${mem.name} (${mem.memberId})?`)) {
                                    const res = await adminDeleteUser(mem.id);
                                    showNotification(res.success ? 'success' : 'error', res.message);
                                  }
                                }}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
                                title="Hapus / Tolak Pendaftaran"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL: DAFTARKAN ANGGOTA BARU OLEH ADMIN */}
      {/* ======================================================== */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Form Pendaftaran Anggota Baru</h3>
                  <p className="text-[11px] text-slate-500">Daftarkan pesilat baru PAMUR Cabang Gresik secara resmi.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap Pesilat *</label>
                <input
                  type="text"
                  value={addMemName}
                  onChange={(e) => setAddMemName(e.target.value)}
                  placeholder="Contoh: Muhammad Bintang Rasio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  required
                />
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email / Akun Login *</label>
                  <input
                    type="email"
                    value={addMemEmail}
                    onChange={(e) => setAddMemEmail(e.target.value)}
                    placeholder="nama@pamur.id"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Kata Sandi Akun *</label>
                    <button
                      type="button"
                      onClick={() => setAddMemPassword(generateRandomPassword())}
                      className="text-[10px] text-red-700 hover:underline font-bold"
                    >
                      Acak Sandi
                    </button>
                  </div>
                  <input
                    type="text"
                    value={addMemPassword}
                    onChange={(e) => setAddMemPassword(e.target.value)}
                    placeholder="Sandi login"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* NIK & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    value={addMemNik}
                    onChange={(e) => setAddMemNik(e.target.value)}
                    placeholder="16 digit NIK (KTP / KK)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / HP Pesilat *</label>
                  <input
                    type="text"
                    value={addMemPhone}
                    onChange={(e) => setAddMemPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={addMemBirthPlace}
                    onChange={(e) => setAddMemBirthPlace(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={addMemBirthDate}
                    onChange={(e) => setAddMemBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Ranting, Sabuk & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ranting Latihan</label>
                  <select
                    value={addMemBranch}
                    onChange={(e) => setAddMemBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tingkat Sabuk Awal</label>
                  <select
                    value={addMemBelt}
                    onChange={(e) => setAddMemBelt(e.target.value as BeltRankLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium"
                  >
                    {beltRanks.map(b => (
                      <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Keaktifan</label>
                  <select
                    value={addMemStatus}
                    onChange={(e) => setAddMemStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium text-emerald-700 font-bold"
                  >
                    <option value="active">Langsung Aktif</option>
                    <option value="pending">Menunggu Verifikasi</option>
                  </select>
                </div>
              </div>

              {/* Kontak Darurat */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kontak Darurat (Orang Tua / Wali)</label>
                <input
                  type="text"
                  value={addMemEmergency}
                  onChange={(e) => setAddMemEmergency(e.target.value)}
                  placeholder="Nama wali & Nomor telepon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddMemberModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                id="submit-add-new-member-form"
                onClick={async () => {
                  if (!addMemName.trim()) {
                    showNotification('error', 'Nama lengkap pesilat wajib diisi.');
                    return;
                  }
                  
                  // Auto generate clean email if empty
                  let finalEmail = addMemEmail.trim();
                  if (!finalEmail) {
                    const slug = addMemName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
                    const rand = Math.floor(1000 + Math.random() * 9000);
                    finalEmail = `${slug || 'pesilat'}${rand}@pamur.id`;
                  }

                  const finalPassword = addMemPassword.trim() || generateRandomPassword();
                  const currentYear = new Date().getFullYear();
                  const randomMemberId = `PMR-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;

                  const res = await adminCreateUser({
                    name: addMemName.trim(),
                    email: finalEmail,
                    password: finalPassword,
                    role: 'anggota',
                    memberId: randomMemberId,
                    phone: addMemPhone.trim() || '-',
                    nik: addMemNik.trim(),
                    birthPlace: addMemBirthPlace.trim(),
                    birthDate: addMemBirthDate.trim(),
                    branch: addMemBranch,
                    beltRank: addMemBelt,
                    joinDate: new Date().toISOString().split('T')[0],
                    status: addMemStatus,
                    emergencyContact: addMemEmergency.trim(),
                    bio: addMemBio.trim(),
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(addMemName)}`
                  });

                  if (res.success && res.user) {
                    showNotification('success', `Anggota baru ${res.user.name} (${res.user.memberId}) berhasil didaftarkan!`);
                    setIsAddMemberModalOpen(false);

                    // Ask if admin wants to open WhatsApp or copy credentials
                    if (res.user.phone && res.user.phone.length >= 8) {
                      if (window.confirm(`Anggota ${res.user.name} berhasil didaftarkan. Kirim kredensial dan pesan sambutan ke WhatsApp ${res.user.phone} sekarang?`)) {
                        handleSendWhatsAppNotification(res.user);
                      }
                    }
                  } else {
                    showNotification('error', res.message);
                  }
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Simpan & Terbitkan Anggota</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DETAIL & KTA PREVIEW ANGGOTA BARU */}
      {/* ======================================================== */}
      {selectedMemberForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Rincian & KTA Digital Pesilat</h3>
                  <p className="text-[11px] text-slate-500">Kartu Tanda Anggota Resmi PAMUR Cabang Gresik</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMemberForDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Digital KTA Visual Card */}
            <div className="bg-linear-to-br from-red-800 via-red-900 to-slate-900 text-white rounded-xl p-5 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <ShieldCheck className="w-40 h-40" />
              </div>

              <div className="flex items-center justify-between relative z-10 border-b border-white/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white p-1 shrink-0">
                    <img 
                      src={config.logoUrl} 
                      alt="Logo PAMUR" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{config.appName}</div>
                    <div className="text-[10px] text-white/80">{selectedMemberForDetail.branch || 'Cabang Gresik'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                    KTA DIGITAL
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <img
                  src={selectedMemberForDetail.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedMemberForDetail.name)}`}
                  alt={selectedMemberForDetail.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/60 bg-white/20 shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{selectedMemberForDetail.name}</div>
                  <div className="text-xs font-mono font-bold text-amber-300">{selectedMemberForDetail.memberId}</div>
                  <div className="text-[11px] text-white/90">
                    Sabuk {selectedMemberForDetail.beltRank} &bull; {selectedMemberForDetail.role === 'admin' ? 'Dewan Guru' : 'Pesilat'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-white/80 border-t border-white/20 pt-3 relative z-10">
                <div>
                  <span className="text-white/60 block">NIK Kependudukan:</span>
                  <span className="font-mono text-white font-semibold">{selectedMemberForDetail.nik || '-'}</span>
                </div>
                <div>
                  <span className="text-white/60 block">Tempat, Tgl Lahir:</span>
                  <span className="text-white font-semibold">
                    {selectedMemberForDetail.birthPlace ? `${selectedMemberForDetail.birthPlace}, ` : ''}{selectedMemberForDetail.birthDate || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block">Tanggal Terbit:</span>
                  <span className="text-white font-semibold">{selectedMemberForDetail.joinDate}</span>
                </div>
                <div>
                  <span className="text-white/60 block">Status Keanggotaan:</span>
                  <span className={`font-bold ${selectedMemberForDetail.status === 'active' ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {selectedMemberForDetail.status === 'active' ? 'Aktif Resmi' : 'Menunggu Verifikasi'}
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Kredensial Akun Login:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Email / Username:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedMemberForDetail.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Kata Sandi:</span>
                  <span className="font-mono text-red-700 font-bold">{selectedMemberForDetail.password || 'pamur2026'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">No. WhatsApp:</span>
                  <span className="font-mono text-slate-800">{selectedMemberForDetail.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Kontak Darurat:</span>
                  <span className="text-slate-800">{selectedMemberForDetail.emergencyContact || '-'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedMemberForDetail.status === 'pending' && (
                  <button
                    onClick={async () => {
                      const res = await adminUpdateUser(selectedMemberForDetail.id, { status: 'active' });
                      if (res.success) {
                        showNotification('success', `Pesilat ${selectedMemberForDetail.name} berhasil diaktifkan!`);
                        setSelectedMemberForDetail({ ...selectedMemberForDetail, status: 'active' });
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verifikasi & Aktifkan</span>
                  </button>
                )}
                <button
                  onClick={() => handleSendWhatsAppNotification(selectedMemberForDetail)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim via WA</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedMemberForDetail(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: KELOLA & UBAH NAMA RANTING / SASANA */}
      {/* ======================================================== */}
      {activeAdminTab === 'branches' && (
        <div className="space-y-6">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Kelola & Ubah Ranting / Sasana PAMUR</h2>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold font-mono">
                  {branches.length} Ranting
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin memiliki otoritas penuh menambah ranting baru, mengubah nama ranting, mengganti alamat padepokan, pelatih, kontak WhatsApp, dan menghapus ranting.
              </p>
            </div>

            <button
              id="admin-add-branch-btn"
              onClick={() => {
                setNewBranchForm({
                  name: '',
                  city: 'Kab. Gresik',
                  address: '',
                  headCoach: '',
                  contact: '0812-3456-7890',
                  memberCount: 20
                });
                setIsAddBranchModalOpen(true);
              }}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Ranting Baru</span>
            </button>
          </div>

          {/* Important Admin Info Banner */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-amber-950">Sinkronisasi Otomatis Database Perubahan Nama Ranting</div>
              <p className="text-amber-800 leading-relaxed">
                Ketika Anda <strong>mengubah nama ranting</strong>, sistem secara otomatis memperbarui seluruh data pesilat yang terdaftar di ranting tersebut, riwayat pendaftaran pendaftar baru, serta seluruh jadwal latihan terkait di database.
              </p>
            </div>
          </div>

          {/* Stats Bar & Search Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Total Ranting Aktif</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{branches.length} Ranting</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Total Pesilat Terdata</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{users.length} Pesilat</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Total Sesi Latihan</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{schedules.length} Sesi</div>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                placeholder="Cari nama ranting, wilayah/kota, alamat sasana, atau pelatih..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
              {branchSearch && (
                <button
                  onClick={() => setBranchSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Branches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches
              .filter(b => {
                if (!branchSearch.trim()) return true;
                const q = branchSearch.toLowerCase();
                return (
                  b.name.toLowerCase().includes(q) ||
                  b.city.toLowerCase().includes(q) ||
                  b.address.toLowerCase().includes(q) ||
                  b.headCoach.toLowerCase().includes(q) ||
                  b.contact.toLowerCase().includes(q)
                );
              })
              .map(branch => {
                const memberCountInBranch = users.filter(u => u.branch === branch.name).length;
                const scheduleCountInBranch = schedules.filter(s => s.branch === branch.name).length;
                const isQuickRenaming = quickRenameBranchId === branch.id;

                const rawPhone = (branch.contact || '').replace(/\D/g, '');
                const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : (rawPhone.startsWith('62') ? rawPhone : (rawPhone.length >= 8 ? '62' + rawPhone : ''));

                return (
                  <div
                    key={branch.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
                  >
                    <div className="space-y-3.5">
                      {/* Top Bar: Icon & Name or Rename input */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {isQuickRenaming ? (
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-red-700 uppercase">Ubah Nama Ranting:</label>
                                <input
                                  type="text"
                                  value={quickRenameValue}
                                  onChange={(e) => setQuickRenameValue(e.target.value)}
                                  className="w-full px-2.5 py-1 text-xs font-bold border border-red-500 rounded-md bg-red-50/40 text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                                  autoFocus
                                />
                                <div className="flex items-center gap-1.5 pt-1">
                                  <button
                                    onClick={() => handleQuickRename(branch.id)}
                                    disabled={isSavingBranch}
                                    className="px-2 py-0.5 bg-red-700 text-white rounded text-[11px] font-bold hover:bg-red-800"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setQuickRenameBranchId(null)}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] hover:bg-slate-200"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 group">
                                <h3 className="font-bold text-sm text-slate-900 truncate" title={branch.name}>
                                  {branch.name}
                                </h3>
                                <button
                                  onClick={() => {
                                    setQuickRenameBranchId(branch.id);
                                    setQuickRenameValue(branch.name);
                                  }}
                                  className="text-slate-400 hover:text-red-700 p-0.5 rounded transition-colors opacity-80 group-hover:opacity-100"
                                  title="Ubah Cepat Nama Ranting"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <div className="text-[11px] text-slate-500 font-medium">{branch.city}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold shrink-0">
                          {branch.id}
                        </span>
                      </div>

                      {/* Details List */}
                      <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                        <div className="flex items-start gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-slate-700 text-[11px]">{branch.address}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-800 font-semibold text-[11px] truncate">
                            Pelatih: {branch.headCoach}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono text-slate-700">{branch.contact}</span>
                          </div>

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 transition-colors"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats Badges */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <div className="flex-1 p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                          <div className="text-[10px] text-slate-500 font-medium">Pesilat Terdaftar</div>
                          <div className="font-bold text-xs text-slate-900 font-mono">
                            {memberCountInBranch} Orang
                          </div>
                        </div>

                        <div className="flex-1 p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                          <div className="text-[10px] text-slate-500 font-medium">Jadwal Sesi</div>
                          <div className="font-bold text-xs text-slate-900 font-mono">
                            {scheduleCountInBranch} Sesi
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditBranch(branch)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                        title="Edit Data & Ubah Nama Ranting"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600" />
                        <span>Ubah Nama & Data</span>
                      </button>

                      <button
                        onClick={() => setBranchToDelete(branch)}
                        className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-red-100"
                        title="Hapus Ranting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {branches.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">Belum ada ranting terdaftar</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tambahkan ranting latihan silat pertama untuk menampung data anggota dan jadwal latihan.
              </p>
              <button
                onClick={() => setIsAddBranchModalOpen(true)}
                className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Ranting Sekarang</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: KELOLA TINGKATAN, NAMA & URUTAN SABUK PAMUR */}
      {/* ======================================================== */}
      {activeAdminTab === 'belts' && (
        <div className="space-y-6">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Kelola Tingkatan, Nama & Urutan Sabuk PAMUR</h2>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold font-mono">
                  {beltRanks.length} Tingkatan Sabuk
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin memiliki otoritas penuh mengubah urutan tingkatan sabuk (Naik/Turun), mengganti nama sabuk, mengubah filosofi/arti, serta menambah sabuk baru. Perubahan nama sabuk otomatis disinkronkan ke seluruh data anggota, jadwal latihan, dan pendaftaran.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetBeltDefault}
                disabled={isSavingBelt}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Kembalikan urutan dan nama sabuk ke standar PAMUR 7 tingkat"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Standar PAMUR</span>
              </button>

              <button
                id="admin-add-belt-btn"
                onClick={() => {
                  setNewBeltForm({
                    level: '',
                    meaning: '',
                    stage: 'Tingkat Menengah',
                    colorHex: '#eab308',
                    bgColor: 'bg-yellow-500',
                    textColor: 'text-white',
                    borderColor: 'border-yellow-600',
                    description: ''
                  });
                  setIsAddBeltModalOpen(true);
                }}
                className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Sabuk Baru</span>
              </button>
            </div>
          </div>

          {/* Visual Progression Hierarchy Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">
                  Alur & Jenjang Kenaikan Tingkat (Hierarki Sabuk Aktif)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tingkat Terendah &rarr; Tingkat Tertinggi
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
              {beltRanks.map((b, idx) => (
                <React.Fragment key={b.id || idx}>
                  <div className="flex items-center gap-2 shrink-0 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" 
                      style={{ backgroundColor: b.colorHex || '#ffffff' }}
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white whitespace-nowrap">
                        Sabuk {b.level}
                      </div>
                      <div className="text-[10px] text-slate-400 whitespace-nowrap">
                        {users.filter(u => u.beltRank === b.level).length} Pesilat
                      </div>
                    </div>
                  </div>
                  {idx < beltRanks.length - 1 && (
                    <span className="text-slate-500 text-xs font-bold shrink-0">&rarr;</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Search Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={beltSearch}
                onChange={(e) => setBeltSearch(e.target.value)}
                placeholder="Cari nama sabuk, tingkatan (Dasar, Menengah, Mahir), atau makna filosofi..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
              />
              {beltSearch && (
                <button
                  onClick={() => setBeltSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-xs text-slate-500 whitespace-nowrap">
              Menampilkan {beltRanks.filter(b => 
                !beltSearch || 
                b.level.toLowerCase().includes(beltSearch.toLowerCase()) ||
                (b.meaning && b.meaning.toLowerCase().includes(beltSearch.toLowerCase())) ||
                (b.stage && b.stage.toLowerCase().includes(beltSearch.toLowerCase()))
              ).length} dari {beltRanks.length} sabuk
            </div>
          </div>

          {/* Belt Hierarchy Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-24 text-center">Urutan</th>
                    <th className="p-3.5">Tingkatan & Nama Sabuk</th>
                    <th className="p-3.5">Fase & Makna Filosofis</th>
                    <th className="p-3.5 text-center">Jumlah Pesilat</th>
                    <th className="p-3.5 text-center w-36">Pindah Urutan</th>
                    <th className="p-3.5 text-right w-44">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {beltRanks
                    .filter(b => 
                      !beltSearch || 
                      b.level.toLowerCase().includes(beltSearch.toLowerCase()) ||
                      (b.meaning && b.meaning.toLowerCase().includes(beltSearch.toLowerCase())) ||
                      (b.stage && b.stage.toLowerCase().includes(beltSearch.toLowerCase()))
                    )
                    .map((belt, index) => {
                      const memberCount = users.filter(u => u.beltRank === belt.level).length;
                      const isFirst = index === 0;
                      const isLast = index === beltRanks.length - 1;
                      const isQuickRenaming = quickRenameBeltId === belt.id;

                      return (
                        <tr key={belt.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Order index badge */}
                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold font-mono text-xs">
                              #{belt.order}
                            </div>
                          </td>

                          {/* Belt Visual & Name (with quick rename) */}
                          <td className="p-3.5">
                            {isQuickRenaming ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={quickRenameBeltValue}
                                  onChange={(e) => setQuickRenameBeltValue(e.target.value)}
                                  placeholder="Nama sabuk baru"
                                  className="px-2.5 py-1 bg-white border-2 border-red-600 rounded-md text-xs font-bold text-slate-900 focus:outline-none w-44"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuickRenameBelt(belt.id);
                                    if (e.key === 'Escape') setQuickRenameBeltId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleQuickRenameBelt(belt.id)}
                                  className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                                  title="Simpan Nama Sabuk"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setQuickRenameBeltId(null)}
                                  className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
                                  title="Batal"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-7 h-7 rounded-lg border-2 border-slate-300 shadow-xs shrink-0 flex items-center justify-center"
                                  style={{ backgroundColor: belt.colorHex || '#ffffff' }}
                                >
                                  <Award className={`w-4 h-4 ${belt.colorHex === '#ffffff' || belt.colorHex === '#f8fafc' ? 'text-slate-800' : 'text-white'}`} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-sm">
                                      Sabuk {belt.level}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setQuickRenameBeltId(belt.id);
                                        setQuickRenameBeltValue(belt.level);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                      title="Ubah Cepat Nama Sabuk"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 mt-0.5">
                                    {belt.stage || 'Tingkat Pembinaan'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Meaning & description */}
                          <td className="p-3.5 max-w-xs">
                            <div className="font-medium text-slate-800 line-clamp-1">{belt.meaning || '-'}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{belt.description || '-'}</div>
                          </td>

                          {/* Member count */}
                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold font-mono text-xs border border-slate-200">
                              <Users className="w-3 h-3 text-slate-500" />
                              <span>{memberCount} Pesilat</span>
                            </div>
                          </td>

                          {/* Move up / down arrows & position selector */}
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleMoveBelt(belt.id, 'up')}
                                disabled={isFirst || isSavingBelt}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isFirst 
                                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                                    : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200 shadow-xs cursor-pointer'
                                }`}
                                title="Naikkan Urutan (Tingkat Lebih Rendah/Awal)"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleMoveBelt(belt.id, 'down')}
                                disabled={isLast || isSavingBelt}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isLast 
                                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                                    : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200 shadow-xs cursor-pointer'
                                }`}
                                title="Turunkan Urutan (Tingkat Lebih Tinggi/Lanjut)"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Direct Jump Selector */}
                              <select
                                value={belt.order}
                                onChange={(e) => handleMoveBeltToPosition(belt.id, Number(e.target.value))}
                                disabled={isSavingBelt}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-red-700 cursor-pointer"
                                title="Pindahkan langsung ke nomor urutan"
                              >
                                {beltRanks.map((_, oIdx) => (
                                  <option key={oIdx + 1} value={oIdx + 1}>
                                    Posisi #{oIdx + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditBelt(belt)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                                title="Ubah Nama, Makna, dan Warna Sabuk"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-600" />
                                <span>Edit Detail</span>
                              </button>

                              <button
                                onClick={() => setBeltToDelete(belt)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors border border-red-100 cursor-pointer"
                                title="Hapus Sabuk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH SABUK BARU */}
      {/* ======================================================== */}
      {isAddBeltModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Tambah Tingkat Sabuk Baru</h3>
                  <p className="text-[11px] text-slate-500">Tambahkan jenjang sabuk ke dalam hierarki tingkatan PAMUR.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddBeltModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBelt} className="space-y-3.5 text-xs">
              {/* Nama Tingkat Sabuk */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Tingkat Sabuk *</label>
                <input
                  type="text"
                  value={newBeltForm.level}
                  onChange={(e) => setNewBeltForm(prev => ({ ...prev, level: e.target.value }))}
                  placeholder="Contoh: Kuning Muda, Hijau Strip, dll"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-700 focus:bg-white"
                  required
                />
              </div>

              {/* Fase / Tahapan & Warna */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fase / Jenjang</label>
                  <select
                    value={newBeltForm.stage}
                    onChange={(e) => setNewBeltForm(prev => ({ ...prev, stage: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium"
                  >
                    <option value="Tingkat Dasar">Tingkat Dasar (Pemula)</option>
                    <option value="Tingkat Pembinaan">Tingkat Pembinaan</option>
                    <option value="Tingkat Menengah">Tingkat Menengah</option>
                    <option value="Tingkat Mahir">Tingkat Mahir</option>
                    <option value="Tingkat Pelatih">Tingkat Pelatih / Dewan Guru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kode Warna Sabuk (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBeltForm.colorHex}
                      onChange={(e) => setNewBeltForm(prev => ({ ...prev, colorHex: e.target.value }))}
                      className="w-9 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={newBeltForm.colorHex}
                      onChange={(e) => setNewBeltForm(prev => ({ ...prev, colorHex: e.target.value }))}
                      placeholder="#eab308"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-red-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Color Chips */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Preset Warna Sabuk Cepat:</label>
                <div className="flex flex-wrap gap-1.5">
                  {beltColorPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewBeltForm(prev => ({
                        ...prev,
                        colorHex: preset.hex,
                        bgColor: preset.bg,
                        textColor: preset.text,
                        borderColor: preset.border
                      }))}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        newBeltForm.colorHex === preset.hex
                          ? 'border-red-600 bg-red-50 text-red-800 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400 shrink-0" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Makna & Filosofi */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Makna Filosofis Sabuk</label>
                <input
                  type="text"
                  value={newBeltForm.meaning}
                  onChange={(e) => setNewBeltForm(prev => ({ ...prev, meaning: e.target.value }))}
                  placeholder="Contoh: Melambangkan kesucian niat dan kerendahan hati..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              {/* Deskripsi Materi / Kurikulum */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deskripsi Materi & Syarat UKT</label>
                <textarea
                  rows={2}
                  value={newBeltForm.description}
                  onChange={(e) => setNewBeltForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Materi jurus tangan kosong, jurus senjata, ketahanan fisik, dan filosofi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBeltModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBelt}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSavingBelt ? 'Menyimpan...' : 'Simpan Sabuk Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT TINGKAT SABUK & UBAH NAMA */}
      {/* ======================================================== */}
      {editingBelt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Edit Data & Ubah Nama Sabuk</h3>
                  <p className="text-[11px] text-slate-500">Ubah nama sabuk, posisi urutan hierarki, dan filosofi.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingBelt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Cascade Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Sinkronisasi Otomatis Seluruh Data:</span>
              </div>
              <p>
                Jika Anda mengubah nama sabuk <strong>"{editingBelt.level}"</strong>, sistem akan secara otomatis memperbarui <strong>{users.filter(u => u.beltRank === editingBelt.level).length} profil anggota</strong> dan seluruh jadwal latihan terkait ke nama baru.
              </p>
            </div>

            <form onSubmit={handleSaveEditBelt} className="space-y-3.5 text-xs">
              {/* Nama Tingkat Sabuk */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Tingkat Sabuk *</label>
                <input
                  type="text"
                  value={editBeltForm.level}
                  onChange={(e) => setEditBeltForm(prev => ({ ...prev, level: e.target.value }))}
                  placeholder="Nama sabuk..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-700 focus:bg-white text-sm"
                  required
                />
              </div>

              {/* Posisi Urutan & Fase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Posisi Urutan Hierarki</label>
                  <select
                    value={editBeltForm.order}
                    onChange={(e) => setEditBeltForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono font-bold"
                  >
                    {beltRanks.map((_, oIdx) => (
                      <option key={oIdx + 1} value={oIdx + 1}>
                        Peringkat #{oIdx + 1} {oIdx === 0 ? '(Awal)' : oIdx === beltRanks.length - 1 ? '(Tertinggi)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fase / Jenjang</label>
                  <input
                    type="text"
                    value={editBeltForm.stage}
                    onChange={(e) => setEditBeltForm(prev => ({ ...prev, stage: e.target.value }))}
                    placeholder="misal: Tingkat Dasar / Pembinaan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Warna Sabuk */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Warna Sabuk (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editBeltForm.colorHex}
                    onChange={(e) => setEditBeltForm(prev => ({ ...prev, colorHex: e.target.value }))}
                    className="w-9 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={editBeltForm.colorHex}
                    onChange={(e) => setEditBeltForm(prev => ({ ...prev, colorHex: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-red-700 font-bold"
                  />
                </div>
              </div>

              {/* Preset Color Chips */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Preset Warna Sabuk:</label>
                <div className="flex flex-wrap gap-1.5">
                  {beltColorPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditBeltForm(prev => ({
                        ...prev,
                        colorHex: preset.hex,
                        bgColor: preset.bg,
                        textColor: preset.text,
                        borderColor: preset.border
                      }))}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        editBeltForm.colorHex === preset.hex
                          ? 'border-red-600 bg-red-50 text-red-800 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400 shrink-0" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Makna Filosofis */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Makna Filosofis Sabuk</label>
                <input
                  type="text"
                  value={editBeltForm.meaning}
                  onChange={(e) => setEditBeltForm(prev => ({ ...prev, meaning: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              {/* Deskripsi Materi */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Materi & Kurikulum UKT</label>
                <textarea
                  rows={2}
                  value={editBeltForm.description}
                  onChange={(e) => setEditBeltForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBelt(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBelt}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingBelt ? 'Menyimpan...' : 'Simpan & Sinkronkan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: HAPUS SABUK */}
      {/* ======================================================== */}
      {beltToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Hapus Tingkat Sabuk</h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan jenjang sabuk</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>Sabuk {beltToDelete.level}</strong> dari hierarki tingkatan perguruan PAMUR?
            </p>

            {users.filter(u => u.beltRank === beltToDelete.level).length > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Peringatan Data Anggota:</span>
                </div>
                <p>
                  Terdapat <strong>{users.filter(u => u.beltRank === beltToDelete.level).length} anggota</strong> yang saat ini memiliki sabuk {beltToDelete.level}. Anggota tersebut akan dialihkan ke sabuk pertama secara otomatis jika sabuk ini dihapus.
                </p>
              </div>
            ) : null}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBeltToDelete(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteBeltSubmit}
                disabled={isSavingBelt}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
              >
                {isSavingBelt ? 'Menghapus...' : 'Ya, Hapus Sabuk'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: PENGATURAN FITUR & LOGO PERGURUAN */}
      {/* ======================================================== */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pengaturan Fitur & Identitas Logo PAMUR</h2>
              <p className="text-xs text-slate-500">
                Admin memiliki wewenang penuh mengubah logo perguruan, nama aplikasi, alamat sekretariat Gresik, dan mengaktifkan/menonaktifkan fitur sistem.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isSavingConfig ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Branding & Logo */}
            <div className="lg:col-span-6 space-y-6">
              {/* Logo Settings Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Palette className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Logo & Visual Perguruan</h3>
                </div>

                {/* Current Logo Preview */}
                <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                    {configForm.logoUrl ? (
                      <img
                        src={configForm.logoUrl}
                        alt="Logo PAMUR"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-700 text-white font-bold text-lg flex items-center justify-center font-serif">
                        PMR
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900">Pratinjau Logo Aktif</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Logo ini ditampilkan pada Navbar, Footer, Kartu Tanda Anggota (KTA Digital), dan E-Ticket.
                    </p>
                  </div>
                </div>

                {/* Direct URL Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">URL Gambar Logo:</label>
                  <input
                    type="url"
                    value={configForm.logoUrl}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://domain.com/logo-pamur.png"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  />
                </div>

                {/* Upload File Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Atau Unggah File Logo dari Komputer:</label>
                  <div className="flex items-center gap-3">
                    <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih File Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">Format PNG, JPG, WEBP, atau SVG</span>
                  </div>
                </div>

                {/* Preset Emblems */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700">Pilihan Lambang / Badge Preset:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Lambang Resmi PAMUR', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=200&auto=format&fit=crop&q=80' },
                      { label: 'Badge Tradisi Silat', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setConfigForm(prev => ({ ...prev, logoUrl: p.url }))}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-[11px] font-medium text-slate-700 flex items-center gap-2 transition-colors"
                      >
                        <img src={p.url} alt={p.label} className="w-6 h-6 rounded object-cover" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* App Identity Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Identitas Nama & Slogan Aplikasi</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Nama Aplikasi:</label>
                    <input
                      type="text"
                      value={configForm.appName}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, appName: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Nama Singkat (Header):</label>
                    <input
                      type="text"
                      value={configForm.shortName}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, shortName: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Slogan / Motto Perguruan:</label>
                  <input
                    type="text"
                    value={configForm.slogan}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, slogan: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Feature Toggles & Branch Details */}
            <div className="lg:col-span-6 space-y-6">
              {/* Feature Switches Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sliders className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Kontrol Fitur Sistem (Aktif / Non-Aktif)</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'enablePublicRegistration', label: 'Pendaftaran Akun Anggota Baru', desc: 'Buka atau tutup formulir registrasi mandiri untuk calon pesilat baru di Gresik.' },
                    { key: 'enableTrainingRegistration', label: 'Pendaftaran Jadwal Latihan Online', desc: 'Izinkan anggota mendaftar sesi latihan, UKT, dan tanding secara online.' },
                    { key: 'enableDigitalKTA', label: 'Kartu Tanda Anggota (KTA) Digital & QR', desc: 'Tampilkan KTA digital interaktif dan generator QR Code pada profil pesilat.' },
                    { key: 'enableETicket', label: 'Sistem E-Ticket & Validasi Kehadiran', desc: 'Keluarkan e-ticket otomatis setelah registrasi sesi latihan berhasil.' },
                    { key: 'enableArticles', label: 'Warta, Artikel, & Panduan Jurus', desc: 'Buka modul publikasi artikel, materi silat, dan liputan kejuaraan.' },
                  ].map((feat) => {
                    const isChecked = (configForm as any)[feat.key] ?? true;
                    return (
                      <label
                        key={feat.key}
                        className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setConfigForm(prev => ({ ...prev, [feat.key]: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-700 accent-red-700"
                        />
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">{feat.label}</div>
                          <div className="text-[11px] text-slate-500 leading-normal">{feat.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Announcement Bar Settings */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Bell className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Papan Pengumuman & Info Penting</h3>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configForm.showAnnouncement ?? true}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, showAnnouncement: e.target.checked }))}
                    className="w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-700 accent-red-700"
                  />
                  <span className="text-xs font-bold text-slate-900">Tampilkan Bilah Pengumuman di Atas Header</span>
                </label>

                {configForm.showAnnouncement && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">Teks Pengumuman Berjalan:</label>
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = { ...configForm, showAnnouncement: false, announcementText: '' };
                          setConfigForm(updated);
                          const res = await updateConfig(updated);
                          showNotification(res.success ? 'success' : 'error', 'Pengumuman berhasil dinonaktifkan & dihapus.');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus / Kosongkan Pengumuman</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={configForm.announcementText || ''}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, announcementText: e.target.value }))}
                      placeholder="Contoh: Pendaftaran UKT Semester Genap Cabang Gresik telah dibuka!"
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                    />
                  </div>
                )}
              </div>

              {/* Secretariat & Contact Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Kontak Sekretariat Cabang Gresik</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Alamat Sekretariat:</label>
                  <input
                    type="text"
                    value={configForm.address || 'Jl. Raya Kebomas No. 45, Kabupaten Gresik, Jawa Timur 61124'}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp:</label>
                    <input
                      type="text"
                      value={configForm.phone || '0812-3456-7890'}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Email Resmi:</label>
                    <input
                      type="email"
                      value={configForm.email || 'gresik@pamur.id'}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB: IMPORT DATA ANGGOTA & GENERATE PASSWORD OTOMATIS */}
      {/* ======================================================== */}
      {activeAdminTab === 'import' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Impor Data Anggota Massal & Auto Kata Sandi</h2>
              <p className="text-xs text-slate-500">
                Impor daftar calon pesilat PAMUR Cabang Gresik secara serentak. Sistem akan otomatis men-generate Nomor Induk Anggota (PMR ID) dan kata sandi login acak yang aman untuk setiap anggota.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsBulkImportModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Buka Wizard Input Masal Excel</span>
              </button>

              <button
                onClick={() => downloadBulkImportTemplateExcel()}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Download template spreadsheet Excel format resmi"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Template Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => {
                  setImportRawText(sampleCSVTemplate);
                  handleParseCSV(sampleCSVTemplate);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Muat Contoh Teks</span>
              </button>
            </div>
          </div>

          {/* Import Upload & Textarea Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-red-700" />
                    <h3 className="font-bold text-sm text-slate-900">Unggah File CSV / Excel</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Pilih File CSV dari Komputer:</label>
                  <input
                    type="file"
                    accept=".csv, text/csv, .txt"
                    onChange={handleFileUploadCSV}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Kolom yang didukung: Nama, Email, NIK, Tempat Lahir, Tanggal Lahir, No Telepon, Sabuk, Ranting.</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">Atau Tempel (Paste) Teks CSV / Tabel:</label>
                    <button
                      type="button"
                      onClick={() => handleParseCSV(importRawText)}
                      className="text-[11px] text-red-700 hover:underline font-semibold"
                    >
                      Perbarui Pratinjau &rarr;
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={importRawText}
                    onChange={(e) => {
                      setImportRawText(e.target.value);
                      handleParseCSV(e.target.value);
                    }}
                    placeholder={`Nama,Email,NIK,Tempat Lahir,Tanggal Lahir,No Telepon,Sabuk,Ranting\nAhmad Fauzi,ahmad@gmail.com,3525011205980001,Gresik,1998-05-12,081234567801,Kuning,Ranting Kebomas`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[11px] text-slate-900 focus:outline-none focus:border-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sparkles className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-sm text-slate-900">Mekanisme Otomatisasi Akun & Kata Sandi</h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</div>
                    <p><strong>PMR ID Otomatis:</strong> Setiap pesilat mendapatkan Nomor Induk unik berformat <code className="bg-slate-100 px-1 py-0.5 rounded text-red-700 font-bold">PMR-XXXXXX</code>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</div>
                    <p><strong>Kata Sandi Acak Aman:</strong> Sistem men-generate kata sandi acak (misal: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-bold">PMR_8k3x9</code>) untuk tiap anggota.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</div>
                    <p><strong>Cabang & Ranting:</strong> Cabang terkunci pada <strong>Gresik</strong>, dan ranting disesuaikan dengan sasana pesilat.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">4</div>
                    <p><strong>Ekspor Kredensial:</strong> Setelah impor berhasil, Anda dapat mengunduh CSV atau menyalin daftar kata sandi untuk dibagikan ke anggota.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pemberitahuan:</strong> Data yang diimpor akan langsung tersimpan di Cloud Firestore online dan siap digunakan anggota untuk login.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parsed Preview Table */}
          {importParsedList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Pratinjau Data Anggota Siap Diimpor ({importParsedList.length} Calon Pesilat)
                  </h3>
                </div>

                <button
                  onClick={handleRunBulkImport}
                  disabled={isImporting}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>{isImporting ? 'Sedang Memproses Akun...' : `Proses & Buat ${importParsedList.length} Akun Otomatis`}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Email Login</th>
                      <th className="p-3">NIK</th>
                      <th className="p-3">Tempat / Tgl Lahir</th>
                      <th className="p-3">No WhatsApp</th>
                      <th className="p-3">Sabuk</th>
                      <th className="p-3">Ranting Gresik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {importParsedList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{item.name}</td>
                        <td className="p-3 font-mono text-red-700">{item.email}</td>
                        <td className="p-3 font-mono">{item.nik || '-'}</td>
                        <td className="p-3">{item.birthPlace || 'Gresik'}, {item.birthDate || '-'}</td>
                        <td className="p-3 font-mono">{item.phone || '-'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100">
                            {item.beltRank}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{item.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Results Modal / Banner after Import with Credentials */}
          {importResults && importResults.length > 0 && (
            <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-6 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SUKSES MEMBUAT {importResults.length} AKUN PESILAT</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Daftar Kredensial Login Pesilat Baru</h3>
                  <p className="text-xs text-slate-500">
                    Simpan dan bagikan informasi nomor anggota serta kata sandi ini kepada pesilat agar mereka dapat segera masuk ke aplikasi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCredentials}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {hasCopiedCredentials ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedCredentials ? 'Tersalin!' : 'Salin Semua'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCredentialsCSV}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh CSV Kredensial</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nomor Anggota (PMR ID)</th>
                      <th className="p-3">Nama Pesilat</th>
                      <th className="p-3">Email Login</th>
                      <th className="p-3 bg-amber-50 text-amber-900 font-bold">Kata Sandi Otomatis</th>
                      <th className="p-3">Sabuk</th>
                      <th className="p-3">Ranting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {importResults.map((res, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-red-700">{res.member.memberId}</td>
                        <td className="p-3 font-bold text-slate-900">{res.member.name}</td>
                        <td className="p-3 font-mono text-slate-600">{res.member.email}</td>
                        <td className="p-3 bg-amber-50/60 font-mono font-bold text-amber-900">
                          <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
                            {res.generatedPassword}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700">
                            {res.member.beltRank}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">{res.member.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KELOLA PENGGUNA & PASSWORD */}
      {/* ======================================================== */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola Pengguna & Kata Sandi</h2>
              <p className="text-xs text-slate-500">
                Admin memiliki otoritas penuh merubah data user, mengatur peran (Role), dan mereset kata sandi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="admin-bulk-import-users-btn"
                onClick={() => setIsBulkImportModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Impor banyak anggota via file Excel atau salin tabel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Input Masal (Excel/CSV)</span>
              </button>

              <button
                id="admin-export-users-excel-btn"
                onClick={handleExportMembersExcel}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Download data anggota ke format Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ekspor Excel (.xlsx)</span>
              </button>

              <button
                id="admin-delete-demo-users-btn"
                onClick={async () => {
                  if (window.confirm('Hapus semua akun dummy demo dari cloud database?')) {
                    const res = await deleteDemoAccounts();
                    showNotification('success', res.message);
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                title="Hapus akun demo bawaan"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Hapus Akun Demo</span>
              </button>

              <button
                id="admin-add-user-btn"
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna Baru</span>
              </button>
            </div>
          </div>

          {/* Search & Role Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                id="search-users-input"
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari nama, email, nomor anggota (PMR ID), atau ranting..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
            >
              <option value="Semua">Semua Peran (Role)</option>
              <option value="admin">Admin Saja</option>
              <option value="anggota">Anggota Saja</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Pengguna</th>
                    <th className="p-3.5">PMR ID</th>
                    <th className="p-3.5">Ranting & Sabuk</th>
                    <th className="p-3.5">Peran (Role)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users
                    .filter(u => {
                      const matchesRole = userRoleFilter === 'Semua' || u.role === userRoleFilter;
                      const matchesSearch = 
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.memberId.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.branch.toLowerCase().includes(userSearch.toLowerCase());
                      return matchesRole && matchesSearch;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                              alt={user.name}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                              <div className="text-[11px] text-slate-500">{user.email}</div>
                              <div className="text-[10px] text-slate-400 font-mono">Password: ••••••••</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-red-700">
                          {user.memberId}
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-slate-800">{user.branch}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">Sabuk {user.beltRank}</div>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'admin'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {user.role === 'admin' ? 'Dewan Guru (Admin)' : 'Pesilat (Anggota)'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {user.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reset Password Button */}
                            <button
                              id={`btn-reset-pw-${user.id}`}
                              onClick={() => {
                                setResetPasswordUserId(user.id);
                                setNewPasswordValue('pamur2026');
                              }}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Reset Kata Sandi User Ini"
                            >
                              <Key className="w-3 h-3" />
                              <span className="hidden sm:inline">Reset Password</span>
                            </button>

                            {/* Edit User Button */}
                            <button
                              id={`btn-edit-user-${user.id}`}
                              onClick={() => setSelectedUserForEdit(user)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
                              title="Ubah Data User & Role"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete User Button */}
                            <button
                              onClick={async () => {
                                if (window.confirm(`Yakin hapus akun user ${user.name}?`)) {
                                  const res = await adminDeleteUser(user.id);
                                  showNotification(res.success ? 'success' : 'error', res.message);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors border border-red-100"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Reset Password */}
          {resetPasswordUserId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Key className="w-4 h-4 text-red-700" />
                    <span>Reset Password Pengguna</span>
                  </div>
                  <button onClick={() => setResetPasswordUserId(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  Masukkan kata sandi baru untuk akun: <strong>{users.find(u => u.id === resetPasswordUserId)?.name}</strong>
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                  <input
                    id="admin-reset-pw-input"
                    type="text"
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setResetPasswordUserId(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="confirm-admin-reset-pw-btn"
                    onClick={async () => {
                      const res = await adminResetPassword(resetPasswordUserId, newPasswordValue);
                      showNotification(res.success ? 'success' : 'error', res.message);
                      setResetPasswordUserId(null);
                    }}
                    className="px-4 py-1.5 bg-red-700 text-white font-bold rounded-lg text-xs hover:bg-red-800"
                  >
                    Simpan Password Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit User & Role */}
          {selectedUserForEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl my-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Ubah Data Pengguna</h3>
                  <button onClick={() => setSelectedUserForEdit(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={selectedUserForEdit.name}
                      onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedUserForEdit.email}
                      onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Peran (Role)</label>
                      <select
                        value={selectedUserForEdit.role}
                        onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, role: e.target.value as UserRole })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-bold text-red-700"
                      >
                        <option value="anggota">Anggota</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Status Akun</label>
                      <select
                        value={selectedUserForEdit.status}
                        onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Non-Aktif (Suspend)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tingkat Sabuk</label>
                      <select
                        value={selectedUserForEdit.beltRank}
                        onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, beltRank: e.target.value as BeltRankLevel })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {beltRanks.map(b => (
                          <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ranting</label>
                      <select
                        value={selectedUserForEdit.branch}
                        onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, branch: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / HP</label>
                    <input
                      type="text"
                      value={selectedUserForEdit.phone}
                      onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedUserForEdit(null)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="save-edit-user-btn"
                    onClick={async () => {
                      const res = await adminUpdateUser(selectedUserForEdit.id, selectedUserForEdit);
                      showNotification(res.success ? 'success' : 'error', res.message);
                      setSelectedUserForEdit(null);
                    }}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Add User */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl my-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Tambah Pengguna Baru</h3>
                  <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Nama lengkap pesilat/pengurus"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email *</label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="email@pamur.id"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Kata Sandi Awal *</label>
                      <input
                        type="text"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Peran (Role)</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-bold text-red-700"
                      >
                        <option value="anggota">Anggota</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tingkat Sabuk</label>
                      <select
                        value={newUserBelt}
                        onChange={(e) => setNewUserBelt(e.target.value as BeltRankLevel)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {beltRanks.map(b => (
                          <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ranting (Gresik)</label>
                      <select
                        value={newUserBranch}
                        onChange={(e) => setNewUserBranch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp</label>
                      <input
                        type="text"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nomor Induk Kependudukan (NIK)</label>
                    <input
                      type="text"
                      value={newUserNik}
                      onChange={(e) => setNewUserNik(e.target.value)}
                      placeholder="16 digit NIK pesilat"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={newUserBirthPlace}
                        onChange={(e) => setNewUserBirthPlace(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={newUserBirthDate}
                        onChange={(e) => setNewUserBirthDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="submit-admin-add-user"
                    onClick={async () => {
                      if (!newUserName || !newUserEmail || !newUserPassword) {
                        showNotification('error', 'Semua kolom bertanda * wajib diisi.');
                        return;
                      }
                      const randomId = Math.floor(1000 + Math.random() * 9000);
                      const res = await adminCreateUser({
                        name: newUserName,
                        email: newUserEmail,
                        password: newUserPassword,
                        role: newUserRole,
                        memberId: `PMR-2026-${randomId}`,
                        phone: newUserPhone,
                        branch: newUserBranch,
                        beltRank: newUserBelt,
                        nik: newUserNik,
                        birthPlace: newUserBirthPlace,
                        birthDate: newUserBirthDate,
                        joinDate: new Date().toISOString().split('T')[0],
                        status: 'active',
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUserName)}`
                      });
                      showNotification(res.success ? 'success' : 'error', res.message);
                      if (res.success) {
                        setIsAddUserModalOpen(false);
                        setNewUserName('');
                        setNewUserEmail('');
                        setNewUserNik('');
                      }
                    }}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    Buat Akun Pengguna
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: KELOLA ARTIKEL DENGAN FOTO */}
      {/* ======================================================== */}
      {activeAdminTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola & Pembuatan Artikel dengan Foto</h2>
              <p className="text-xs text-slate-500">
                Publikasikan artikel, materi jurus, dan berita perguruan lengkap dengan cover foto.
              </p>
            </div>

            <button
              id="admin-create-article-btn"
              onClick={() => {
                setEditingArticleId(null);
                setArtTitle('');
                setArtExcerpt('');
                setArtContent('');
                setArtImageUrl(presetPhotos[0].url);
                setArtTags('PAMUR, Pencak Silat, Jurus');
                setIsArticleModalOpen(true);
              }}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Artikel Baru</span>
            </button>
          </div>

          {/* Articles Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Foto & Judul Artikel</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Penulis</th>
                    <th className="p-3.5">Tanggal / Pembaca</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="max-w-xs sm:max-w-sm">
                            <div className="font-bold text-slate-900 text-xs line-clamp-1">{art.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{art.excerpt}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100">
                          {art.category}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-800">
                        {art.author}
                      </td>

                      <td className="p-3.5">
                        <div>{art.publishedDate}</div>
                        <div className="text-[10px] text-slate-400">{art.views} dibaca</div>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          art.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {art.status === 'published' ? 'Terbit' : 'Draft'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingArticleId(art.id);
                              setArtTitle(art.title);
                              setArtCategory(art.category);
                              setArtExcerpt(art.excerpt);
                              setArtContent(art.content);
                              setArtImageUrl(art.imageUrl);
                              setArtTags(art.tags.join(', '));
                              setArtStatus(art.status);
                              setIsArticleModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
                            title="Edit Artikel"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Hapus artikel "${art.title}"?`)) {
                                const res = await deleteArticle(art.id);
                                showNotification(res.success ? 'success' : 'error', res.message);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors border border-red-100"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Create / Edit Article with Photo */}
          {isArticleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-2xl space-y-4 shadow-xl my-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingArticleId ? 'Edit Artikel Silat PAMUR' : 'Buat Artikel Baru dengan Foto'}
                  </h3>
                  <button onClick={() => setIsArticleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Judul Artikel *</label>
                    <input
                      id="article-title-input"
                      type="text"
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="misal: Rahasia Ketepatan Jurus Rasio PAMUR"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white text-sm font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Kategori Artikel</label>
                      <select
                        value={artCategory}
                        onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        <option value="Berita & Kegiatan">Berita & Kegiatan</option>
                        <option value="Teknik & Jurus">Teknik & Jurus</option>
                        <option value="Filosofi Silat">Filosofi Silat</option>
                        <option value="Prestasi & Kejuaraan">Prestasi & Kejuaraan</option>
                        <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Status Publikasi</label>
                      <select
                        value={artStatus}
                        onChange={(e) => setArtStatus(e.target.value as 'published' | 'draft')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        <option value="published">Publikasikan (Terbit)</option>
                        <option value="draft">Simpan Sebagai Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Photo Upload Section */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 font-bold flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-700" />
                        <span>Foto Sampul Artikel (Cover Photo) *</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Pilih preset, URL, atau upload</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          id="article-image-url-input"
                          type="url"
                          value={artImageUrl}
                          onChange={(e) => setArtImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <label className="cursor-pointer px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-medium text-slate-700 flex items-center gap-1">
                            <Upload className="w-3 h-3 text-slate-500" />
                            <span>Upload File Lokal</span>
                            <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Photo Preview */}
                      <div className="h-24 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden relative flex items-center justify-center">
                        {artImageUrl ? (
                          <img src={artImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-400 text-[10px]">Preview foto akan tampil di sini</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 self-center">Pilihan Foto Cepat:</span>
                      {presetPhotos.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setArtImageUrl(preset.url)}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Ringkasan Singkat (Excerpt) *</label>
                    <textarea
                      id="article-excerpt-input"
                      value={artExcerpt}
                      onChange={(e) => setArtExcerpt(e.target.value)}
                      rows={2}
                      placeholder="Ringkasan 1-2 kalimat untuk preview di halaman utama..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Isi Lengkap Konten Artikel *</label>
                    <textarea
                      id="article-content-input"
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      rows={6}
                      placeholder="Tuliskan materi teknik, tata cara latihan, atau laporan warta selengkapnya..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tagar / Kata Kunci (Dipisah koma)</label>
                    <input
                      type="text"
                      value={artTags}
                      onChange={(e) => setArtTags(e.target.value)}
                      placeholder="PAMUR, Jurus, Sabuk Merah, Tanding"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="save-article-submit-btn"
                    onClick={async () => {
                      if (!artTitle || !artExcerpt || !artContent) {
                        showNotification('error', 'Mohon lengkapi judul, foto, ringkasan, dan isi artikel.');
                        return;
                      }

                      const tagsArray = artTags.split(',').map(t => t.trim()).filter(Boolean);
                      const finalPhoto = artImageUrl || presetPhotos[0].url;

                      if (editingArticleId) {
                        const res = await updateArticle(editingArticleId, {
                          title: artTitle,
                          category: artCategory,
                          excerpt: artExcerpt,
                          content: artContent,
                          imageUrl: finalPhoto,
                          tags: tagsArray,
                          status: artStatus
                        });
                        showNotification(res.success ? 'success' : 'error', res.message);
                      } else {
                        const res = await createArticle({
                          title: artTitle,
                          category: artCategory,
                          excerpt: artExcerpt,
                          content: artContent,
                          imageUrl: finalPhoto,
                          tags: tagsArray,
                          status: artStatus,
                          author: currentUser?.name || 'Dewan Guru PAMUR',
                          publishedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        });
                        showNotification(res.success ? 'success' : 'error', res.message);
                      }

                      setIsArticleModalOpen(false);
                    }}
                    className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    {editingArticleId ? 'Simpan Perubahan Artikel' : 'Terbitkan Artikel Sekarang'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: KELOLA JADWAL LATIHAN */}
      {/* ======================================================== */}
      {activeAdminTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola Jadwal Latihan & Kuota</h2>
              <p className="text-xs text-slate-500">
                Atur jadwal latihan berkala, lokasi padepokan ranting, pembatasan kuota, dan pelatih bertugas.
              </p>
            </div>

            <button
              id="admin-create-schedule-btn"
              onClick={() => {
                setEditingScheduleId(null);
                setSchTitle('Latihan Reguler & Fisik');
                setSchDay('Sabtu');
                setSchDate(new Date().toISOString().split('T')[0]);
                setSchTimeStart('16:00');
                setSchTimeEnd('18:00');
                setSchLocation('Padepokan PAMUR Pusat');
                setSchBranch(branches[0]?.name || 'Ranting Kebomas');
                setSchCoach('Dewan Guru PAMUR');
                setSchTargetBelt('Semua Tingkatan');
                setSchCategory('Latihan Reguler');
                setSchMaxQuota(30);
                setSchStatus('buka');
                setIsScheduleModalOpen(true);
              }}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Jadwal Latihan</span>
            </button>
          </div>

          {/* Schedules Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nama Sesi Latihan</th>
                    <th className="p-3.5">Waktu & Tanggal</th>
                    <th className="p-3.5">Ranting & Lokasi</th>
                    <th className="p-3.5">Pelatih & Tingkat</th>
                    <th className="p-3.5">Kuota / Pendaftar</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {schedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-xs">{sch.title}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{sch.category}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{sch.day}, {sch.date}</div>
                        <div className="text-[11px] text-slate-500">{sch.timeStart} - {sch.timeEnd} WIB</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-red-700">{sch.branch}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{sch.location}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{sch.coach}</div>
                        <div className="text-[10px] text-slate-500">{sch.targetBelt}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">
                          {sch.registeredCount} / {sch.maxQuota}
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              sch.registeredCount >= sch.maxQuota ? 'bg-red-600' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (sch.registeredCount / sch.maxQuota) * 100)}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sch.status === 'buka'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sch.status === 'tutup'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {sch.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingScheduleId(sch.id);
                              setSchTitle(sch.title);
                              setSchDay(sch.day);
                              setSchDate(sch.date);
                              setSchTimeStart(sch.timeStart);
                              setSchTimeEnd(sch.timeEnd);
                              setSchLocation(sch.location);
                              setSchBranch(sch.branch);
                              setSchCoach(sch.coach);
                              setSchTargetBelt(sch.targetBelt);
                              setSchCategory(sch.category);
                              setSchMaxQuota(sch.maxQuota);
                              setSchStatus(sch.status);
                              setSchRequirements(sch.requirements);
                              setSchDescription(sch.description);
                              setIsScheduleModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
                            title="Edit Jadwal"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Hapus jadwal latihan "${sch.title}"?`)) {
                                const res = await deleteSchedule(sch.id);
                                showNotification(res.success ? 'success' : 'error', res.message);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors border border-red-100"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Schedule Edit / Create */}
          {isScheduleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-xl space-y-4 shadow-xl my-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingScheduleId ? 'Edit Sesi Jadwal Latihan' : 'Tambah Jadwal Latihan Baru'}
                  </h3>
                  <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Sesi Latihan *</label>
                    <input
                      id="schedule-title-input"
                      type="text"
                      value={schTitle}
                      onChange={(e) => setSchTitle(e.target.value)}
                      placeholder="misal: Latihan Jurus Rasio & Sambut"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Kategori Sesi</label>
                      <select
                        value={schCategory}
                        onChange={(e) => setSchCategory(e.target.value as TrainingCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        <option value="Latihan Reguler">Latihan Reguler</option>
                        <option value="Pemusatan Tanding (TC)">Pemusatan Tanding (TC)</option>
                        <option value="Latihan Seni & Jurus">Latihan Seni & Jurus</option>
                        <option value="Fisik & Daya Tahan">Fisik & Daya Tahan</option>
                        <option value="Ujian Kenaikan Tingkat (UKT)">Ujian Kenaikan Tingkat (UKT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ranting Penyelenggara</label>
                      <select
                        value={schBranch}
                        onChange={(e) => setSchBranch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Hari</label>
                      <select
                        value={schDay}
                        onChange={(e) => setSchDay(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={schDate}
                        onChange={(e) => setSchDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Jam Latihan</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={schTimeStart}
                          onChange={(e) => setSchTimeStart(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-center"
                          placeholder="16:00"
                        />
                        <span>-</span>
                        <input
                          type="text"
                          value={schTimeEnd}
                          onChange={(e) => setSchTimeEnd(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-center"
                          placeholder="18:00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Pelatih / Instruktur</label>
                      <input
                        type="text"
                        value={schCoach}
                        onChange={(e) => setSchCoach(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Target Tingkatan Sabuk</label>
                      <input
                        type="text"
                        value={schTargetBelt}
                        onChange={(e) => setSchTargetBelt(e.target.value)}
                        placeholder="misal: Semua Tingkatan atau Sabuk Hijau Keatas"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Kapasitas Kuota Pesilat</label>
                      <input
                        type="number"
                        min={5}
                        max={100}
                        value={schMaxQuota}
                        onChange={(e) => setSchMaxQuota(parseInt(e.target.value) || 20)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Status Pendaftaran</label>
                      <select
                        value={schStatus}
                        onChange={(e) => setSchStatus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        <option value="buka">Buka (Menerima Pendaftar)</option>
                        <option value="tutup">Tutup (Penuh/Selesai)</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Lokasi Latihan *</label>
                    <input
                      type="text"
                      value={schLocation}
                      onChange={(e) => setSchLocation(e.target.value)}
                      placeholder="Alamat / Sasana latihan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Perlengkapan / Syarat</label>
                    <input
                      type="text"
                      value={schRequirements}
                      onChange={(e) => setSchRequirements(e.target.value)}
                      placeholder="Seragam silat lengkap, pelindung kaki..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Deskripsi / Materi Latihan</label>
                    <textarea
                      value={schDescription}
                      onChange={(e) => setSchDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="save-schedule-submit-btn"
                    onClick={async () => {
                      if (!schTitle || !schLocation) {
                        showNotification('error', 'Mohon isi nama sesi dan lokasi latihan.');
                        return;
                      }

                      if (editingScheduleId) {
                        const res = await updateSchedule(editingScheduleId, {
                          title: schTitle,
                          day: schDay,
                          date: schDate,
                          timeStart: schTimeStart,
                          timeEnd: schTimeEnd,
                          location: schLocation,
                          branch: schBranch,
                          coach: schCoach,
                          targetBelt: schTargetBelt,
                          category: schCategory,
                          maxQuota: schMaxQuota,
                          status: schStatus,
                          requirements: schRequirements,
                          description: schDescription
                        });
                        showNotification(res.success ? 'success' : 'error', res.message);
                      } else {
                        const res = await createSchedule({
                          title: schTitle,
                          day: schDay,
                          date: schDate,
                          timeStart: schTimeStart,
                          timeEnd: schTimeEnd,
                          location: schLocation,
                          branch: schBranch,
                          coach: schCoach,
                          targetBelt: schTargetBelt,
                          category: schCategory,
                          maxQuota: schMaxQuota,
                          status: schStatus,
                          requirements: schRequirements,
                          description: schDescription
                        });
                        showNotification(res.success ? 'success' : 'error', res.message);
                      }

                      setIsScheduleModalOpen(false);
                    }}
                    className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    {editingScheduleId ? 'Simpan Perubahan Jadwal' : 'Simpan Jadwal Baru'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: DATA ANGGOTA */}
      {/* ======================================================== */}
      {activeAdminTab === 'members' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola Data Anggota Silat PAMUR</h2>
              <p className="text-xs text-slate-500">
                Daftar lengkap anggota terdaftar, status keaktifan, nomor PMR ID, dan riwayat ranting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="members-bulk-import-btn"
                onClick={() => setIsBulkImportModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Input Masal (Excel/CSV)</span>
              </button>

              <button
                id="members-export-excel-btn"
                onClick={handleExportMembersExcel}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download File Excel (.xlsx)</span>
              </button>

              <button
                id="members-export-csv-btn"
                onClick={handleExportMembersCSV}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nomor PMR ID</th>
                    <th className="p-3.5">Nama Pesilat</th>
                    <th className="p-3.5">NIK & Tempat/Tgl Lahir</th>
                    <th className="p-3.5">Ranting Gresik</th>
                    <th className="p-3.5">Tingkat Sabuk</th>
                    <th className="p-3.5">Kontak WA</th>
                    <th className="p-3.5">Tgl Bergabung</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((mem) => (
                    <tr key={mem.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-red-700">
                        {mem.memberId}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{mem.name}</div>
                        <div className="text-[11px] text-slate-500">{mem.email}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-slate-700">{mem.nik || '-'}</div>
                        <div className="text-[11px] text-slate-500">
                          {mem.birthPlace ? `${mem.birthPlace}, ` : ''}{mem.birthDate || '-'}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {mem.branch}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100">
                          Sabuk {mem.beltRank}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">
                        {mem.phone || '-'}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {mem.joinDate}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mem.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {mem.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: VERIFIKASI PENDAFTARAN LATIHAN */}
      {/* ======================================================== */}
      {activeAdminTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Verifikasi Pendaftar Latihan Online</h2>
              <p className="text-xs text-slate-500">
                Pantau tiket pendaftaran online peserta dan validasi presensi kehadiran di sasana.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Sesi:</span>
              <select
                value={regFilterScheduleId}
                onChange={(e) => setRegFilterScheduleId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Semua">Semua Sesi Jadwal</option>
                {schedules.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.date})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Kode Tiket</th>
                    <th className="p-3.5">Nama Pesilat</th>
                    <th className="p-3.5">Sesi Jadwal</th>
                    <th className="p-3.5">Waktu & Lokasi</th>
                    <th className="p-3.5">Status Presensi</th>
                    <th className="p-3.5 text-right">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {registrations
                    .filter(r => regFilterScheduleId === 'Semua' || r.scheduleId === regFilterScheduleId)
                    .map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-red-700">
                          {reg.ticketCode}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{reg.userName}</div>
                          <div className="text-[11px] text-slate-500">PMR ID: {reg.memberId} &bull; Sabuk {reg.beltRank}</div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">
                          {reg.scheduleTitle}
                        </td>
                        <td className="p-3.5">
                          <div>{reg.scheduleDate} ({reg.scheduleTime} WIB)</div>
                          <div className="text-[11px] text-slate-500">{reg.location}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.status === 'Terkonfirmasi'
                              ? 'bg-emerald-50 text-emerald-700'
                              : reg.status === 'Hadir'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status === 'Terkonfirmasi' && (
                              <button
                                onClick={async () => {
                                  const res = await updateRegistrationStatus(reg.id, 'Hadir');
                                  showNotification(res.success ? 'success' : 'error', 'Presensi pesilat diset Hadir.');
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold rounded-md text-[11px] transition-colors"
                              >
                                Set Hadir
                              </button>
                            )}

                            {reg.status !== 'Dibatalkan' && (
                              <button
                                onClick={async () => {
                                  if (window.confirm('Batalkan pendaftaran tiket ini?')) {
                                    const res = await updateRegistrationStatus(reg.id, 'Dibatalkan');
                                    showNotification(res.success ? 'success' : 'error', 'Pendaftaran dibatalkan.');
                                  }
                                }}
                                className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
                                title="Batalkan"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit / Ubah Nama Ranting */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ubah Nama & Data Ranting</h3>
                  <div className="text-[11px] text-slate-500 font-mono">ID: {editingBranch.id}</div>
                </div>
              </div>
              <button 
                onClick={() => setEditingBranch(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBranch} className="space-y-4 text-xs">
              {/* Cascade Notification Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Sinkronisasi Otomatis Anggota & Jadwal</span>
                </div>
                <p className="leading-relaxed">
                  Jika Anda mengubah <strong>Nama Ranting</strong>, seluruh pesilat terdaftar pada ranting ini dan sesi latihan terkait akan otomatis disinkronkan ke nama ranting yang baru.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Ranting / Sasana *</label>
                <input
                  type="text"
                  value={editBranchForm.name}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                  placeholder="misal: Ranting Kebomas (Padepokan Cabang)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-red-700 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={editBranchForm.city}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, city: e.target.value })}
                    placeholder="misal: Kab. Gresik"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pelatih Kepala / Dewan Guru</label>
                  <input
                    type="text"
                    value={editBranchForm.headCoach}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, headCoach: e.target.value })}
                    placeholder="misal: Pendekar Ahmad Fauzi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap Sasana / Padepokan</label>
                <textarea
                  rows={2}
                  value={editBranchForm.address}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, address: e.target.value })}
                  placeholder="misal: Kompleks Olahraga, Jl. Sunan Giri No. 12, Kebomas"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kontak WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editBranchForm.contact}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, contact: e.target.value })}
                    placeholder="misal: 0812-3456-7890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kapasitas / Estimasi Pesilat</label>
                  <input
                    type="number"
                    min={0}
                    value={editBranchForm.memberCount}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, memberCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBranch}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingBranch ? 'Menyimpan...' : 'Simpan Perubahan Ranting'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Ranting Baru */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tambah Ranting / Sasana PAMUR Baru</h3>
                  <div className="text-[11px] text-slate-500">Cabang Gresik & Sekitarnya</div>
                </div>
              </div>
              <button 
                onClick={() => setIsAddBranchModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBranch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Ranting Baru *</label>
                <input
                  type="text"
                  value={newBranchForm.name}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  placeholder="misal: Ranting Duduksampeyan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-red-700 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={newBranchForm.city}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, city: e.target.value })}
                    placeholder="misal: Kab. Gresik"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Pelatih Kepala</label>
                  <input
                    type="text"
                    value={newBranchForm.headCoach}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, headCoach: e.target.value })}
                    placeholder="misal: Pelatih Wahyu Pratama"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Sasana / Lokasi Latihan</label>
                <textarea
                  rows={2}
                  value={newBranchForm.address}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, address: e.target.value })}
                  placeholder="misal: Balai Desa / Lapangan Serbaguna..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={newBranchForm.contact}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, contact: e.target.value })}
                    placeholder="misal: 0812-3456-7890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Jumlah Anggota</label>
                  <input
                    type="number"
                    min={0}
                    value={newBranchForm.memberCount}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, memberCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBranch}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSavingBranch ? 'Menyimpan...' : 'Tambah Ranting'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Ranting */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">Hapus Ranting Silat?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong>"{branchToDelete.name}"</strong>?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 text-left space-y-1">
                <div>&bull; Wilayah: <span className="font-semibold">{branchToDelete.city}</span></div>
                <div>&bull; Pelatih: <span className="font-semibold">{branchToDelete.headCoach}</span></div>
                <div>&bull; Pesilat Terdaftar: <span className="font-semibold">{users.filter(u => u.branch === branchToDelete.name).length} Orang</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteBranchSubmit}
                disabled={isSavingBranch}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold"
              >
                {isSavingBranch ? 'Menghapus...' : 'Ya, Hapus Ranting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImport={adminBulkImportMembers}
      />
    </div>
  );
};
