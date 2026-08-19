import React, { useState } from 'react';
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
  RegistrationStatus 
} from '../types';
import { BELT_RANKS, BRANCHES_LIST } from '../data/initialData';
import { 
  Lock, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  ShieldCheck, 
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
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    users, 
    articles, 
    schedules, 
    registrations,
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
    resetAllDataToDefault
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'articles' | 'schedules' | 'members' | 'registrations'>('overview');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
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

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('user123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('anggota');
  const [newUserPhone, setNewUserPhone] = useState('0812-3456-7890');
  const [newUserBranch, setNewUserBranch] = useState(BRANCHES_LIST[0].name);
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
  const [schBranch, setSchBranch] = useState(BRANCHES_LIST[0].name);
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

  // Export Members to CSV
  const handleExportMembersCSV = () => {
    const headers = ['Nomor Anggota', 'Nama', 'Email', 'No Telepon', 'Ranting', 'Sabuk', 'Role', 'Status', 'Tanggal Bergabung'];
    const rows = users.map(u => [
      `"${u.memberId}"`,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.branch}"`,
      `"${u.beltRank}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.joinDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_anggota_pamur_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Data anggota berhasil diexport ke CSV.');
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
            { id: 'users', label: 'Kelola Pengguna & Password', icon: Key },
            { id: 'articles', label: 'Kelola Artikel & Foto', icon: BookOpen },
            { id: 'schedules', label: 'Kelola Jadwal Latihan', icon: Calendar },
            { id: 'members', label: 'Data Anggota Silat', icon: Users },
            { id: 'registrations', label: 'Verifikasi Pendaftar', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setEditingArticleId(null);
                  setArtTitle('');
                  setArtExcerpt('');
                  setArtContent('');
                  setArtImageUrl(presetPhotos[0].url);
                  setIsArticleModalOpen(true);
                }}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Buat Artikel Baru dengan Foto</div>
                <div className="text-[11px] text-slate-500">Tulis panduan jurus, liputan tanding, atau warta resmi.</div>
              </button>

              <button
                onClick={() => {
                  setEditingScheduleId(null);
                  setSchTitle('Latihan Reguler & Fisik');
                  setIsScheduleModalOpen(true);
                }}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Tambah Sesi Latihan Baru</div>
                <div className="text-[11px] text-slate-500">Atur hari, jam, lokasi ranting, pelatih, dan kuota.</div>
              </button>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left space-y-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Tambah Anggota / Admin Baru</div>
                <div className="text-[11px] text-slate-500">Registrasi manual anggota atau buat akun pengurus admin.</div>
              </button>
            </div>
          </div>
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

            <button
              id="admin-add-user-btn"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
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
                        {BELT_RANKS.map(b => (
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
                        {BRANCHES_LIST.map(b => (
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
                        {BELT_RANKS.map(b => (
                          <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ranting</label>
                      <select
                        value={newUserBranch}
                        onChange={(e) => setNewUserBranch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      >
                        {BRANCHES_LIST.map(b => (
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
                        joinDate: new Date().toISOString().split('T')[0],
                        status: 'active',
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUserName)}`
                      });
                      showNotification(res.success ? 'success' : 'error', res.message);
                      if (res.success) {
                        setIsAddUserModalOpen(false);
                        setNewUserName('');
                        setNewUserEmail('');
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
                setSchBranch(BRANCHES_LIST[0].name);
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
                        {BRANCHES_LIST.map(b => (
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

            <button
              onClick={handleExportMembersCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV Anggota</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nomor PMR ID</th>
                    <th className="p-3.5">Nama Pesilat</th>
                    <th className="p-3.5">Ranting Asal</th>
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
    </div>
  );
};
