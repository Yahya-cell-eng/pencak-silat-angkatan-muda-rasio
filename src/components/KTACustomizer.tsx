import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { KTACardConfig, KTAPresetTheme, User } from '../types';
import { KTACard } from './KTACard';
import { 
  Palette, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  Sliders, 
  Shield, 
  QrCode, 
  FileText, 
  PenTool, 
  Award,
  Layers,
  Layout,
  RefreshCw,
  Printer,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

export const KTACustomizer: React.FC = () => {
  const { ktaConfig, updateKTAConfig, resetKTAConfigToDefault, users, beltRanks, config } = useData();

  // Local draft state for real-time live preview before / with save
  const [formData, setFormData] = useState<KTACardConfig>({ ...ktaConfig });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedUserPreviewId, setSelectedUserPreviewId] = useState<string>(users[0]?.id || '');
  const [activeSection, setActiveSection] = useState<'theme' | 'identity' | 'toggles' | 'signatures' | 'rules'>('theme');

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        setFeedback({ type: 'success', text: 'Logo KTA berhasil diunggah! Klik "Simpan Perubahan" untuk menerapkan.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const previewUser: User = users.find(u => u.id === selectedUserPreviewId) || users[0] || {
    id: 'preview_sample',
    name: 'Budi Santoso, S.Pd',
    memberId: 'PMR-2025-1029',
    beltRank: 'Hijau',
    branch: 'Ranting Kebomas',
    role: 'anggota',
    status: 'active',
    joinDate: '2023-01-15',
    bloodType: 'O',
    email: 'budi@pamur.id',
    phone: '081234567890',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Budi%20Santoso'
  };

  const previewBeltInfo = beltRanks.find(b => b.level === previewUser.beltRank) || beltRanks[0];

  const themePresets: Array<{ id: KTAPresetTheme; name: string; desc: string; bgClass: string; borderClass: string }> = [
    {
      id: 'dark_crimson',
      name: 'Dark Crimson (Resmi)',
      desc: 'Nuansa gelap elegan khas silat tradisi',
      bgClass: 'bg-gradient-to-br from-slate-950 via-red-950 to-zinc-950',
      borderClass: 'border-red-900'
    },
    {
      id: 'classic_red',
      name: 'Classic PAMUR Red',
      desc: 'Warna merah marun kebanggaan perguruan',
      bgClass: 'bg-gradient-to-br from-red-900 via-red-950 to-slate-900',
      borderClass: 'border-red-600'
    },
    {
      id: 'navy_gold',
      name: 'Navy & Golden Sand',
      desc: 'Kombinasi biru malam dan aksen emas',
      bgClass: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
      borderClass: 'border-amber-500'
    },
    {
      id: 'emerald_warrior',
      name: 'Emerald Warrior',
      desc: 'Warna hijau zamrud melambangkan ketenangan jiwa',
      bgClass: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
      borderClass: 'border-emerald-600'
    },
    {
      id: 'obsidian_gold',
      name: 'Obsidian Prestige',
      desc: 'Hitam legam eksklusif dengan sentuhan premium',
      bgClass: 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-black',
      borderClass: 'border-amber-400'
    },
    {
      id: 'clean_white',
      name: 'Minimalist Clean White',
      desc: 'Format terang modern cocok untuk cetak hemat tinta',
      bgClass: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
      borderClass: 'border-slate-400'
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateKTAConfig(formData);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Gagal menyimpan pengaturan desain KTA.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset semua pengaturan desain KTA ke format standar resmi PAMUR?')) {
      const res = await resetKTAConfigToDefault();
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Kustomisasi Identitas Digital</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Desain Kartu Tanda Anggota (KTA) Digital</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuaikan tema kartu, nama perguruan, tanda tangan pengurus, tanda barcode/QR, dan tata tertib kartu secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Status Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border shadow-xs ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span className="font-medium">{feedback.text}</span>
        </div>
      )}

      {/* Main Grid: Left Controls (Form) vs Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Customization Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSection('theme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'theme'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Tema & Warna</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('identity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'identity'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Teks & Identitas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('toggles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'toggles'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Elemen & Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('signatures')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'signatures'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Tanda Tangan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'rules'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tata Tertib Belakang</span>
            </button>
          </div>

          {/* SECTION 1: Theme Presets */}
          {activeSection === 'theme' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pilih Preset Tema KTA</h3>
                <p className="text-xs text-slate-500">Pilihan gradasi warna latar belakang eksklusif untuk kartu tanda anggota.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themePreset: preset.id })}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.themePreset === preset.id
                        ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${preset.bgClass} border ${preset.borderClass} shrink-0 shadow-xs flex items-center justify-center text-white font-bold text-xs`}>
                      P
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{preset.name}</span>
                        {formData.themePreset === preset.id && (
                          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Color Overrides */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warna Utama Logo / Lambang
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#991b1b'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#991b1b'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warna Badge Status (KTA Resmi)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#dc2626'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#dc2626'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Identity & Headings */}
          {activeSection === 'identity' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Logo, Nama Organisasi & Judul Kartu</h3>
                <p className="text-xs text-slate-500">Kustomisasi logo resmi, teks kop surat, dan identitas perguruan yang tampil pada kartu.</p>
              </div>

              {/* Logo KTA Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-700" />
                    <span className="text-xs font-bold text-slate-800">Logo Resmi Kartu (KTA)</span>
                  </div>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                    >
                      Hapus Logo (Gunakan Ikon Perisai)
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Shield className="w-8 h-8 text-red-700" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Unggah File Logo (PNG/JPG/SVG):
                      </label>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-red-700" />
                        <span>Pilih Gambar dari Komputer</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Atau Masukkan URL Gambar Logo:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={formData.logoUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                          placeholder="https://.../logo.png"
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                        {config.logoUrl && config.logoUrl !== formData.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, logoUrl: config.logoUrl }))}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors"
                            title="Gunakan logo dari konfigurasi perguruan"
                          >
                            Logo Perguruan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perguruan / Organisasi</label>
                  <input
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    placeholder="PENCAK SILAT PAMUR"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kepanjangan / Motto Perguruan</label>
                  <input
                    type="text"
                    value={formData.orgSubtitle}
                    onChange={(e) => setFormData({ ...formData, orgSubtitle: e.target.value })}
                    placeholder="Angkatan Muda Rasio Indonesia"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pengurus Cabang / Wilayah</label>
                  <input
                    type="text"
                    value={formData.branchSubtitle}
                    onChange={(e) => setFormData({ ...formData, branchSubtitle: e.target.value })}
                    placeholder="Pengurus Cabang Kabupaten Gresik"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Judul Kartu</label>
                    <input
                      type="text"
                      value={formData.cardTitle}
                      onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
                      placeholder="KARTU TANDA ANGGOTA"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks Badge Sudut</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      placeholder="KTA RESMI"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Kaki Kartu (Footer Note)</label>
                  <input
                    type="text"
                    value={formData.footerNote}
                    onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
                    placeholder="Kartu ini adalah tanda bukti sah keanggotaan resmi Perguruan Silat PAMUR."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Toggles & Visual Elements */}
          {activeSection === 'toggles' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Elemen Visual & Visibilitas Field</h3>
                <p className="text-xs text-slate-500">Aktifkan atau nonaktifkan informasi yang tampil pada bagian depan kartu.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan Garis Warna Sabuk Aktif</span>
                    <p className="text-[11px] text-slate-500">Bilah warna sabuk sesuai tingkatan sabuk masing-masing pesilat.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showBeltColorBar}
                    onChange={(e) => setFormData({ ...formData, showBeltColorBar: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan QR Code Verifikasi</span>
                    <p className="text-[11px] text-slate-500">QR Code keamanan untuk scan verifikasi keabsahan kartu.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showQrCode}
                    onChange={(e) => setFormData({ ...formData, showQrCode: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan Watermark Logo PAMUR Transparan</span>
                    <p className="text-[11px] text-slate-500">Logo monogram "P" halus di tengah latar kartu.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showWatermark}
                    onChange={(e) => setFormData({ ...formData, showWatermark: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan Masa Berlaku</span>
                    <p className="text-[11px] text-slate-500">Status masa aktif kartu (contoh: Seumur Hidup).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showValidity}
                    onChange={(e) => setFormData({ ...formData, showValidity: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>

                {formData.showValidity && (
                  <div className="pl-4 pr-1 py-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Teks Masa Berlaku</label>
                    <input
                      type="text"
                      value={formData.validityText}
                      onChange={(e) => setFormData({ ...formData, validityText: e.target.value })}
                      placeholder="Seumur Hidup"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                )}

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan Tanggal Bergabung (Sejak)</span>
                    <p className="text-[11px] text-slate-500">Tahun/tanggal pertama kali pesilat bergabung.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showJoinDate}
                    onChange={(e) => setFormData({ ...formData, showJoinDate: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Tampilkan Golongan Darah</span>
                    <p className="text-[11px] text-slate-500">Informasi medis darurat untuk keselamatan pesilat saat bertanding.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showBloodType}
                    onChange={(e) => setFormData({ ...formData, showBloodType: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SECTION 4: Signatures */}
          {activeSection === 'signatures' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kolom Tanda Tangan Resmi</h3>
                  <p className="text-xs text-slate-500">Pejabat perguruan yang menandatangani Kartu Tanda Anggota.</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSignatures}
                    onChange={(e) => setFormData({ ...formData, showSignatures: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span>Tampilkan Tanda Tangan</span>
                </label>
              </div>

              {formData.showSignatures ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Signature 1 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                      Tanda Tangan Kiri (Pengurus Cabang)
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jabatan Penandatangan 1</label>
                      <input
                        type="text"
                        value={formData.signatureTitle1}
                        onChange={(e) => setFormData({ ...formData, signatureTitle1: e.target.value })}
                        placeholder="Ketua Pengurus Cabang"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={formData.signatureName1}
                        onChange={(e) => setFormData({ ...formData, signatureName1: e.target.value })}
                        placeholder="Dewan Guru Bambang Sutrisno"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Signature 2 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                      Tanda Tangan Kanan (Dewan Guru / Pelatih)
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jabatan Penandatangan 2</label>
                      <input
                        type="text"
                        value={formData.signatureTitle2}
                        onChange={(e) => setFormData({ ...formData, signatureTitle2: e.target.value })}
                        placeholder="Dewan Guru Utama"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={formData.signatureName2}
                        onChange={(e) => setFormData({ ...formData, signatureName2: e.target.value })}
                        placeholder="Pelatih Bambang S."
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                  Kolom tanda tangan dinonaktifkan. Centang opsi di atas untuk mengaktifkan kembali.
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: Backside Rules */}
          {activeSection === 'rules' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tata Tertib & Panca Prasetya Sisi Belakang</h3>
                <p className="text-xs text-slate-500">Teks yang dicetak pada bagian belakang kartu tanda anggota.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ikrar / Janji & Ketentuan Kartu</label>
                <textarea
                  rows={6}
                  value={formData.backRulesText}
                  onChange={(e) => setFormData({ ...formData, backRulesText: e.target.value })}
                  placeholder="Isi panca prasetya dan tata tertib pemegang kartu..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Interactive Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Preview KTA</span>
            </div>

            {/* Switch preview user */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Pesilat:</span>
              <select
                value={selectedUserPreviewId}
                onChange={(e) => setSelectedUserPreviewId(e.target.value)}
                className="text-xs bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.beltRank})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-inner flex flex-col items-center">
            <KTACard 
              user={previewUser} 
              config={formData} 
              beltInfo={previewBeltInfo} 
              showBackToggle={true} 
            />
          </div>

          {/* Action Reminder Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
              <span>Semua anggota akan langsung melihat tampilan ini pada profil mereka setelah disimpan.</span>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shrink-0 shadow-xs transition-colors"
            >
              Simpan
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
