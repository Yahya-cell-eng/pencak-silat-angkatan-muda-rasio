import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { RegistrationFormConfig, CustomFormField } from '../types';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  RotateCcw, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  CreditCard, 
  ShieldCheck, 
  Phone, 
  Building2, 
  UserPlus, 
  Calendar, 
  Heart, 
  Award, 
  HelpCircle, 
  FileText, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface RegistrationCustomizerProps {
  onShowNotification?: (type: 'success' | 'error', text: string) => void;
}

export const RegistrationCustomizer: React.FC<RegistrationCustomizerProps> = ({ onShowNotification }) => {
  const { 
    registrationConfig, 
    updateRegistrationConfig, 
    addCustomField, 
    updateCustomField, 
    deleteCustomField, 
    resetRegistrationConfigToDefault,
    branches,
    beltRanks,
    config
  } = useData();

  // Local draft state for batch editing
  const [draftConfig, setDraftConfig] = useState<RegistrationFormConfig>(() => ({
    ...registrationConfig,
    fields: { ...registrationConfig.fields },
    customFields: [...(registrationConfig.customFields || [])]
  }));

  // Sync draft when registrationConfig updates from cloud
  React.useEffect(() => {
    setDraftConfig({
      ...registrationConfig,
      fields: { ...registrationConfig.fields },
      customFields: [...(registrationConfig.customFields || [])]
    });
  }, [registrationConfig]);

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'fields' | 'custom' | 'fee' | 'preview'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Custom Field Modal / Form state
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'textarea' | 'select' | 'number' | 'checkbox'>('text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldHelpText, setFieldHelpText] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptionsText, setFieldOptionsText] = useState('');

  // Live preview interactive state
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  const notify = (type: 'success' | 'error', text: string) => {
    if (onShowNotification) {
      onShowNotification(type, text);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const res = await updateRegistrationConfig(draftConfig);
    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      notify('success', res.message);
    } else {
      notify('error', res.message);
    }
  };

  const handleResetDefault = async () => {
    if (window.confirm('Kembalikan seluruh pengaturan formulir pendaftaran ke konfigurasi standar resmi PAMUR?')) {
      const res = await resetRegistrationConfigToDefault();
      if (res.success) {
        notify('success', res.message);
      } else {
        notify('error', res.message);
      }
    }
  };

  const toggleFieldEnabled = (fieldName: keyof typeof draftConfig.fields) => {
    setDraftConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          enabled: !prev.fields[fieldName].enabled
        }
      }
    }));
  };

  const toggleFieldRequired = (fieldName: keyof typeof draftConfig.fields) => {
    setDraftConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          required: !prev.fields[fieldName].required
        }
      }
    }));
  };

  const handleSaveCustomFieldModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim()) {
      notify('error', 'Label pertanyaan wajib diisi.');
      return;
    }

    const optionsArray = fieldType === 'select' 
      ? fieldOptionsText.split('\n').map(o => o.trim()).filter(Boolean)
      : undefined;

    if (fieldType === 'select' && (!optionsArray || optionsArray.length === 0)) {
      notify('error', 'Harap isi minimal satu pilihan untuk tipe dropdown.');
      return;
    }

    if (editingFieldId) {
      // Edit existing
      await updateCustomField(editingFieldId, {
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim(),
        helpText: fieldHelpText.trim(),
        required: fieldRequired,
        options: optionsArray
      });
      notify('success', 'Pertanyaan kustom berhasil diperbarui.');
    } else {
      // Add new
      await addCustomField({
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim(),
        helpText: fieldHelpText.trim(),
        required: fieldRequired,
        options: optionsArray
      });
      notify('success', 'Pertanyaan kustom baru berhasil ditambahkan.');
    }

    // Reset modal
    setIsAddingField(false);
    setEditingFieldId(null);
    setFieldLabel('');
    setFieldType('text');
    setFieldPlaceholder('');
    setFieldHelpText('');
    setFieldRequired(false);
    setFieldOptionsText('');
  };

  const handleEditCustomField = (field: CustomFormField) => {
    setEditingFieldId(field.id);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldPlaceholder(field.placeholder || '');
    setFieldHelpText(field.helpText || '');
    setFieldRequired(!!field.required);
    setFieldOptionsText((field.options || []).join('\n'));
    setIsAddingField(true);
  };

  const STANDARD_FIELD_DESCRIPTIONS: Record<keyof typeof draftConfig.fields, { title: string; desc: string; icon: any }> = {
    nik: {
      title: 'Nomor Induk Kependudukan (NIK 16 Digit)',
      desc: 'Diperlukan untuk data KTA dan verifikasi legal identitas kependudukan pesilat.',
      icon: CreditCard
    },
    birthPlace: {
      title: 'Tempat Lahir',
      desc: 'Kota atau kabupaten kelahiran calon pesilat.',
      icon: Building2
    },
    birthDate: {
      title: 'Tanggal Lahir',
      desc: 'Untuk validasi usia kategori tanding (Usia Dini, Pra-Remaja, Remaja, Dewasa).',
      icon: Calendar
    },
    gender: {
      title: 'Jenis Kelamin (Laki-laki / Perempuan)',
      desc: 'Diperlukan untuk pengelompokan kelas latihan fisik dan bagan tanding silat.',
      icon: ShieldCheck
    },
    address: {
      title: 'Alamat Domisili Lengkap',
      desc: 'Alamat tempat tinggal calon pesilat saat ini di wilayah Gresik dan sekitarnya.',
      icon: Building2
    },
    emergencyContact: {
      title: 'Kontak Darurat (Orang Tua / Wali)',
      desc: 'Nama dan nomor telepon wali pesilat jika terjadi kendala saat latihan.',
      icon: Phone
    },
    bloodType: {
      title: 'Golongan Darah (A / B / AB / O / Belum Tahu)',
      desc: 'Penting untuk penanganan medis dan protokol keselamatan atlet bela diri.',
      icon: Heart
    },
    occupationOrSchool: {
      title: 'Pekerjaan / Asal Sekolah / Instansi',
      desc: 'Mencatat asal instansi, SD/SMP/SMA/Universitas, atau profesi calon pesilat.',
      icon: FileText
    },
    uniformSize: {
      title: 'Ukuran Seragam Silat PAMUR (S, M, L, XL, XXL)',
      desc: 'Memudahkan penyediaan sakral/seragam latihan resmi perguruan.',
      icon: Award
    },
    healthNotes: {
      title: 'Catatan Riwayat Kesehatan / Alergi',
      desc: 'Informasi cedera lampau, asma, atau pantangan fisik saat latihan.',
      icon: AlertCircle
    },
    motivation: {
      title: 'Motivasi & Tujuan Bergabung',
      desc: 'Mengetahui minat calon pesilat (prestasi tanding, seni bela diri, kebugaran, rohani).',
      icon: Sparkles
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Status Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-slate-900">Kustomisasi Formulir Pendaftaran Anggota Baru</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                draftConfig.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${draftConfig.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {draftConfig.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur kolom isian, pertanyaan kustom, alur verifikasi admin, biaya, dan tampilan formulir pendaftaran PAMUR Gresik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetDefault}
            type="button"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reset ke pengaturan default resmi PAMUR"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>
          
          <button
            id="save-registration-config-btn"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : saveSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-200">
                <Check className="w-4 h-4" />
                Tersimpan!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'general'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Status & Pengaturan Umum</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fields')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'fields'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kolom Data Bawaan</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900/10 text-[10px]">
            {Object.values(draftConfig.fields).filter((f: any) => f?.enabled).length} Aktif
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('custom')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'custom'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Pertanyaan Kustom</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900/10 text-[10px]">
            {draftConfig.customFields?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('fee')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'fee'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Biaya & Info Pembayaran</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preview')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'preview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Live Preview Formulir</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: STATUS & PENGATURAN UMUM */}
      {/* ======================================================== */}
      {activeSubTab === 'general' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Master Toggle Pendaftaran */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Buka / Tutup Pendaftaran Online</h3>
                  <p className="text-xs text-slate-500">Jika ditutup, calon anggota tidak dapat mengisi pendaftaran online.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraftConfig(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                  className={`text-2xl transition-colors ${draftConfig.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {draftConfig.isOpen ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer">
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                      <span>Terbuka</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer">
                      <ToggleLeft className="w-5 h-5 text-slate-500" />
                      <span>Ditutup</span>
                    </div>
                  )}
                </button>
              </div>

              {!draftConfig.isOpen && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pesan Ketika Pendaftaran Ditutup:
                  </label>
                  <textarea
                    rows={2}
                    value={draftConfig.closedMessage || ''}
                    onChange={(e) => setDraftConfig(prev => ({ ...prev, closedMessage: e.target.value }))}
                    placeholder="misal: Pendaftaran anggota baru sedang ditutup sementara..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                  />
                </div>
              )}
            </div>

            {/* Approval Flow Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alur Verifikasi Pendaftaran</h3>
                  <p className="text-xs text-slate-500">
                    {draftConfig.requireAdminApproval 
                      ? 'Pendaftaran masuk status "Menunggu Verifikasi" (Admin wajib menyetujui).'
                      : 'Akun langsung Aktif dan pesilat bisa langsung login.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraftConfig(prev => ({ ...prev, requireAdminApproval: !prev.requireAdminApproval }))}
                  className="cursor-pointer"
                >
                  {draftConfig.requireAdminApproval ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Butuh Verifikasi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-900 text-xs font-bold rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      <span>Langsung Aktif</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Admin dapat memverifikasi calon pesilat pada menu <strong>"Pendaftar Baru"</strong> dan langsung mengirimkan pesan sambutan WhatsApp.
                </span>
              </div>
            </div>

          </div>

          {/* Form Titles & Instructions */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Teks & Instruksi Formulir</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Formulir Pendaftaran
                </label>
                <input
                  type="text"
                  value={draftConfig.formTitle || ''}
                  onChange={(e) => setDraftConfig(prev => ({ ...prev, formTitle: e.target.value }))}
                  placeholder="misal: Pendaftaran Anggota Baru PAMUR Gresik"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subjudul / Slogan Formulir
                </label>
                <input
                  type="text"
                  value={draftConfig.formSubtitle || ''}
                  onChange={(e) => setDraftConfig(prev => ({ ...prev, formSubtitle: e.target.value }))}
                  placeholder="misal: Mari bergabung bersama Perguruan Pencak Silat Angkatan Muda Rasio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Petunjuk / Ketentuan Pendaftaran (Ditampilkan di bagian atas form)
              </label>
              <textarea
                rows={3}
                value={draftConfig.formInstructions || ''}
                onChange={(e) => setDraftConfig(prev => ({ ...prev, formInstructions: e.target.value }))}
                placeholder="misal: Isi seluruh data diri dengan benar sesuai KTP/Kartu Keluarga..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan Notifikasi Setelah Berhasil Mendaftar
                </label>
                <input
                  type="text"
                  value={draftConfig.successMessage || ''}
                  onChange={(e) => setDraftConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                  placeholder="misal: Pendaftaran berhasil! Silakan tunggu konfirmasi admin..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Panitia / Hotline Konfirmasi
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={draftConfig.whatsappConfirmationPhone || ''}
                    onChange={(e) => setDraftConfig(prev => ({ ...prev, whatsappConfirmationPhone: e.target.value }))}
                    placeholder="misal: 6281234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Gunakan format angka internasional (contoh: 6281234567890).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: KOLOM DATA BAWAAN */}
      {/* ======================================================== */}
      {activeSubTab === 'fields' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pengaturan Kolom Data Bawaan</h3>
            <p className="text-xs text-slate-500">
              Aktifkan atau sembunyikan kolom pendaftaran, dan tentukan apakah kolom tersebut <strong>Wajib Diisi</strong> atau <strong>Opsional</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(Object.keys(draftConfig.fields) as Array<keyof typeof draftConfig.fields>).map((fieldKey) => {
              const fConfig = draftConfig.fields[fieldKey];
              const meta = STANDARD_FIELD_DESCRIPTIONS[fieldKey] || {
                title: fieldKey,
                desc: 'Kolom formulir pendaftaran',
                icon: FileText
              };
              const IconComp = meta.icon;

              return (
                <div 
                  key={fieldKey}
                  className={`p-4 rounded-xl border transition-all ${
                    fConfig.enabled 
                      ? 'bg-white border-slate-200 shadow-xs' 
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-lg shrink-0 ${fConfig.enabled ? 'bg-red-50 text-red-700' : 'bg-slate-200 text-slate-500'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{meta.title}</div>
                        <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{meta.desc}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100 text-xs">
                    {/* Enable toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFieldEnabled(fieldKey)}
                      className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                        fConfig.enabled ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {fConfig.enabled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Ditampilkan</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-slate-400" />
                          <span>Disembunyikan</span>
                        </>
                      )}
                    </button>

                    {/* Required toggle */}
                    {fConfig.enabled && (
                      <button
                        type="button"
                        onClick={() => toggleFieldRequired(fieldKey)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                          fConfig.required
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {fConfig.required ? '★ Wajib Diisi' : 'Opsional'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: PERTANYAAN KUSTOM TAMBAHAN */}
      {/* ======================================================== */}
      {activeSubTab === 'custom' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pertanyaan & Kolom Kustom Tambahan</h3>
              <p className="text-xs text-slate-500">
                Tambahkan pertanyaan khusus seperti pengalaman bela diri sebelumnya, hobi, ukuran kaos, dsb.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingFieldId(null);
                setFieldLabel('');
                setFieldType('text');
                setFieldPlaceholder('');
                setFieldHelpText('');
                setFieldRequired(false);
                setFieldOptionsText('');
                setIsAddingField(true);
              }}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pertanyaan Kustom</span>
            </button>
          </div>

          {/* List of Custom Fields */}
          {(!draftConfig.customFields || draftConfig.customFields.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Belum ada pertanyaan kustom tambahan</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Klik tombol "Tambah Pertanyaan Kustom" untuk menambahkan input teks, dropdown, angka, atau persetujuan khusus.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {draftConfig.customFields.map((cField, idx) => (
                <div 
                  key={cField.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{cField.label}</span>
                      <span className="px-2 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                        Tipe: {cField.type}
                      </span>
                      {cField.required ? (
                        <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded text-[10px] font-bold">
                          Wajib
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded text-[10px]">
                          Opsional
                        </span>
                      )}
                    </div>
                    {cField.helpText && (
                      <p className="text-[11px] text-slate-500 pl-7">{cField.helpText}</p>
                    )}
                    {cField.options && cField.options.length > 0 && (
                      <div className="text-[10px] text-slate-400 pl-7 flex items-center gap-1">
                        <span>Pilihan:</span>
                        <span className="font-mono text-slate-600">{cField.options.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditCustomField(cField)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      title="Edit Pertanyaan"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Hapus pertanyaan kustom "${cField.label}"?`)) {
                          await deleteCustomField(cField.id);
                          notify('success', `Pertanyaan "${cField.label}" berhasil dihapus.`);
                        }
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                      title="Hapus Pertanyaan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Form: Add or Edit Custom Field */}
          {isAddingField && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">
                    {editingFieldId ? 'Edit Pertanyaan Kustom' : 'Tambah Pertanyaan Kustom Baru'}
                  </h4>
                  <button 
                    onClick={() => setIsAddingField(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveCustomFieldModal} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Label / Teks Pertanyaan *
                    </label>
                    <input
                      type="text"
                      value={fieldLabel}
                      onChange={(e) => setFieldLabel(e.target.value)}
                      placeholder="misal: Pengalaman Bela Diri Sebelumnya"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tipe Kolom Input
                    </label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-medium"
                    >
                      <option value="text">Teks Singkat (Input Teks)</option>
                      <option value="textarea">Paragraf Panjang (Textarea)</option>
                      <option value="select">Pilihan Dropdown (Select Menu)</option>
                      <option value="number">Angka / Numerik</option>
                      <option value="checkbox">Kotak Centang (Persetujuan / Ya-Tidak)</option>
                    </select>
                  </div>

                  {fieldType === 'select' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pilihan Dropdown (1 Baris = 1 Pilihan) *
                      </label>
                      <textarea
                        rows={3}
                        value={fieldOptionsText}
                        onChange={(e) => setFieldOptionsText(e.target.value)}
                        placeholder="Pernah Belajar Silat Lain&#10;Belum Pernah (Pemula)&#10;Pernah Belajar Karate/Taekwondo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white font-mono"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teks Petunjuk / Placeholder
                    </label>
                    <input
                      type="text"
                      value={fieldPlaceholder}
                      onChange={(e) => setFieldPlaceholder(e.target.value)}
                      placeholder="misal: Tuliskan nama perguruan atau tingkatan jika ada"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Bantuan (Help Text)
                    </label>
                    <input
                      type="text"
                      value={fieldHelpText}
                      onChange={(e) => setFieldHelpText(e.target.value)}
                      placeholder="misal: Kosongkan jika baru pertama kali ikut bela diri."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="field-required-checkbox"
                      type="checkbox"
                      checked={fieldRequired}
                      onChange={(e) => setFieldRequired(e.target.checked)}
                      className="w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-700"
                    />
                    <label htmlFor="field-required-checkbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Wajib Diisi oleh Calon Anggota (Required)
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingField(false)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      {editingFieldId ? 'Simpan Perubahan' : 'Tambahkan Field'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: BIAYA & PEMBAYARAN */}
      {/* ======================================================== */}
      {activeSubTab === 'fee' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Biaya Pendaftaran & Info Pembayaran</h3>
            <p className="text-xs text-slate-500">
              Tentukan apakah pendaftaran gratis atau dikenakan biaya administrasi / pembelian sakral seragam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Biaya Pendaftaran (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">Rp</span>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={draftConfig.registrationFee || 0}
                    onChange={(e) => setDraftConfig(prev => ({ ...prev, registrationFee: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-red-700 focus:bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Isi 0 jika pendaftaran gratis tanpa pungutan biaya.
                </p>
              </div>

              {draftConfig.registrationFee > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <CreditCard className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Pendaftaran berbayar sebesar <strong>Rp {(draftConfig.registrationFee || 0).toLocaleString('id-ID')}</strong> akan ditampilkan di formulir.
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Petunjuk / Info Rekening Pembayaran
                </label>
                <textarea
                  rows={4}
                  value={draftConfig.paymentInfo || ''}
                  onChange={(e) => setDraftConfig(prev => ({ ...prev, paymentInfo: e.target.value }))}
                  placeholder="Transfer ke Rekening Bank Jatim Cabang Gresik:&#10;No. Rek: 027xxxxxxxx&#10;A.N: PAMUR Cabang Gresik&#10;Kirim bukti transfer ke WhatsApp admin."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-700 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 5: LIVE PREVIEW FORMULIR */}
      {/* ======================================================== */}
      {activeSubTab === 'preview' && (
        <div className="bg-slate-900 rounded-2xl p-6 space-y-6 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white">Live Simulator Formulir Pendaftaran</h3>
                <p className="text-xs text-slate-400">Tampilan persis yang dilihat oleh calon pesilat saat mendaftar online.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-amber-300 border border-slate-700">
              Mode Pratinjau Interaktif
            </span>
          </div>

          {/* Simulated Auth Modal Card */}
          <div className="max-w-xl mx-auto bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4">
            
            {/* Header Form */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{draftConfig.formTitle || 'Pendaftaran Anggota PAMUR'}</h4>
                <p className="text-[11px] text-slate-500">{draftConfig.formSubtitle || 'Cabang Kabupaten Gresik'}</p>
              </div>
            </div>

            {/* If Closed */}
            {!draftConfig.isOpen ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                <div className="font-bold text-xs text-red-900">Pendaftaran Sedang Ditutup</div>
                <p className="text-[11px] text-red-700">{draftConfig.closedMessage || 'Pendaftaran online saat ini belum dibuka.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Instructions */}
                {draftConfig.formInstructions && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{draftConfig.formInstructions}</span>
                  </div>
                )}

                {/* Fee Badge if berbayar */}
                {draftConfig.registrationFee > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-red-700" />
                      <span className="font-bold text-red-900">Biaya Administrasi Pendaftaran:</span>
                    </div>
                    <span className="font-bold font-mono text-red-700 text-sm">
                      Rp {draftConfig.registrationFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {/* Simulated Fields */}
                <div className="space-y-3 text-xs">
                  {/* Nama */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pesilat *</label>
                    <input 
                      type="text" 
                      placeholder="misal: Mochamad Hendra Pratama" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" 
                    />
                  </div>

                  {/* Gender */}
                  {draftConfig.fields.gender?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Jenis Kelamin {draftConfig.fields.gender.required ? '*' : '(Opsional)'}
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  )}

                  {/* Tempat / Tgl Lahir */}
                  <div className="grid grid-cols-2 gap-2">
                    {draftConfig.fields.birthPlace?.enabled && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tempat Lahir {draftConfig.fields.birthPlace.required ? '*' : ''}
                        </label>
                        <input type="text" placeholder="Gresik" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                      </div>
                    )}
                    {draftConfig.fields.birthDate?.enabled && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tanggal Lahir {draftConfig.fields.birthDate.required ? '*' : ''}
                        </label>
                        <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                      </div>
                    )}
                  </div>

                  {/* NIK */}
                  {draftConfig.fields.nik?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        NIK 16 Digit {draftConfig.fields.nik.required ? '*' : '(Opsional)'}
                      </label>
                      <input type="text" placeholder="3525xxxxxxxxxxxx" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono" />
                    </div>
                  )}

                  {/* Email & WA */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Alamat Email *</label>
                      <input type="email" placeholder="pesilat@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp *</label>
                      <input type="tel" placeholder="0812-xxxx-xxxx" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  </div>

                  {/* Alamat */}
                  {draftConfig.fields.address?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Alamat Domisili Lengkap {draftConfig.fields.address.required ? '*' : ''}
                      </label>
                      <input type="text" placeholder="Jl. Raya Kebomas No. 12, Gresik" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  )}

                  {/* Ranting & Sabuk */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Ranting Latihan *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                        {branches.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tingkat Sabuk Saat Ini *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                        {beltRanks.map(b => (
                          <option key={b.level} value={b.level}>Sabuk {b.level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Golongan Darah & Ukuran Seragam */}
                  <div className="grid grid-cols-2 gap-2">
                    {draftConfig.fields.bloodType?.enabled && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Golongan Darah {draftConfig.fields.bloodType.required ? '*' : ''}
                        </label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                          <option value="Belum Tahu">Belum Tahu</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="AB">AB</option>
                          <option value="O">O</option>
                        </select>
                      </div>
                    )}
                    {draftConfig.fields.uniformSize?.enabled && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Ukuran Seragam Silat {draftConfig.fields.uniformSize.required ? '*' : ''}
                        </label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                          <option value="M">M (Standar Remaja)</option>
                          <option value="S">S (Kecil / Anak-anak)</option>
                          <option value="L">L (Dewasa)</option>
                          <option value="XL">XL (Besar)</option>
                          <option value="XXL">XXL (Ekstra Besar)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Sekolah / Pekerjaan */}
                  {draftConfig.fields.occupationOrSchool?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Pekerjaan / Sekolah / Instansi {draftConfig.fields.occupationOrSchool.required ? '*' : ''}
                      </label>
                      <input type="text" placeholder="misal: SMAN 1 Gresik / Karyawan" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  )}

                  {/* Riwayat Kesehatan */}
                  {draftConfig.fields.healthNotes?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Riwayat Kesehatan / Alergi {draftConfig.fields.healthNotes.required ? '*' : ''}
                      </label>
                      <input type="text" placeholder="misal: Tidak ada / riwayat asma ringan" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  )}

                  {/* Motivasi */}
                  {draftConfig.fields.motivation?.enabled && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Motivasi Bergabung {draftConfig.fields.motivation.required ? '*' : ''}
                      </label>
                      <textarea rows={2} placeholder="misal: Ingin berprestasi di kejuaraan silat IPSI..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  )}

                  {/* Custom Fields Preview */}
                  {draftConfig.customFields?.map((cField) => (
                    <div key={cField.id} className="pt-1">
                      <label className="block font-semibold text-slate-700 mb-1">
                        {cField.label} {cField.required ? '*' : '(Opsional)'}
                      </label>
                      {cField.type === 'select' ? (
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                          <option value="">-- Pilih {cField.label} --</option>
                          {cField.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : cField.type === 'textarea' ? (
                        <textarea rows={2} placeholder={cField.placeholder || ''} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                      ) : cField.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <input type="checkbox" className="w-4 h-4 text-red-700 rounded" />
                          <span className="text-xs text-slate-700">{cField.placeholder || cField.label}</span>
                        </div>
                      ) : (
                        <input type={cField.type} placeholder={cField.placeholder || ''} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
                      )}
                      {cField.helpText && <p className="text-[10px] text-slate-400 mt-0.5">{cField.helpText}</p>}
                    </div>
                  ))}

                  {/* Submit Button Simulator */}
                  <button
                    type="button"
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-sm mt-3 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Sebagai Anggota PAMUR Gresik</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
