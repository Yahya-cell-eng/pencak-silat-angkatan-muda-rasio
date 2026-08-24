import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { TrainingSchedule, TrainingRegistration } from './types';

// Components
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ArticlesView } from './components/ArticlesView';
import { SchedulesView } from './components/SchedulesView';
import { MemberProfileView } from './components/MemberProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { BeltProgressionView } from './components/BeltProgressionView';
import { BranchesView } from './components/BranchesView';

// Modals
import { AuthModal } from './components/AuthModal';
import { TrainingRegistrationModal } from './components/TrainingRegistrationModal';
import { ETicketModal } from './components/ETicketModal';
import { WhatsAppContact } from './components/WhatsAppContact';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { schedules, quotaExceeded } = useData();
  const [showQuotaBanner, setShowQuotaBanner] = useState<boolean>(true);

  // Navigation Tabs: 'home' | 'articles' | 'schedules' | 'belts' | 'branches' | 'profile' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modal States
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  const [registerSchedule, setRegisterSchedule] = useState<TrainingSchedule | null>(null);
  const [viewTicket, setViewTicket] = useState<TrainingRegistration | null>(null);

  // Scroll to top when tab switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleStartRegisterSchedule = (schedule: TrainingSchedule) => {
    if (!isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    setRegisterSchedule(schedule);
  };

  const handleRegistrationComplete = (registration: TrainingRegistration) => {
    setRegisterSchedule(null);
    setViewTicket(registration);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col lg:flex-row font-sans selection:bg-red-700 selection:text-white relative">
      {/* Primary Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/70">
        {/* Firestore Quota Notice Banner */}
        {quotaExceeded && showQuotaBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                  Offline Mode Active
                </span>
                <span>
                  Batas baca harian Firebase Free Tier tercapai untuk hari ini. Aplikasi tetap berjalan normal menggunakan data lokal/cache.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://console.firebase.google.com/project/molten-data-t3t6m/firestore/databases/ai-studio-pamurportalpergu-2c911060-2449-4255-8340-777a6baf20ba/data?openUpgradeDialog=true"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-amber-950 hover:text-amber-700"
                >
                  Tingkatkan Paket / Buka Console &rarr;
                </a>
                <button
                  onClick={() => setShowQuotaBanner(false)}
                  className="text-amber-700 hover:text-amber-900 ml-2 font-bold px-1"
                  title="Tutup pemberitahuan"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area with Smooth Tab Transition */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {currentTab === 'home' && (
                <HomeView
                  onNavigateTab={setCurrentTab}
                  onOpenAuth={handleOpenAuth}
                />
              )}

              {currentTab === 'articles' && (
                <ArticlesView />
              )}

              {currentTab === 'schedules' && (
                <SchedulesView
                  onRegisterClick={handleStartRegisterSchedule}
                  onViewTicketClick={(ticket) => setViewTicket(ticket)}
                />
              )}

              {currentTab === 'belts' && (
                <BeltProgressionView onNavigateTab={setCurrentTab} />
              )}

              {currentTab === 'branches' && (
                <BranchesView onNavigateTab={setCurrentTab} />
              )}

              {currentTab === 'profile' && (
                <MemberProfileView
                  onOpenAuth={handleOpenAuth}
                  onNavigateTab={setCurrentTab}
                  onViewTicket={(ticket) => setViewTicket(ticket)}
                />
              )}

              {currentTab === 'admin' && (
                currentUser?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-xs">
                    <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mx-auto text-xl font-bold border border-red-100">
                      !
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 font-serif">Akses Dibatasi</h2>
                    <p className="text-xs text-slate-500">
                      Halaman panel admin hanya dapat diakses oleh akun Dewan Guru / Pengurus dengan peran Admin.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setCurrentTab('home')}
                        className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                      >
                        Kembali ke Beranda
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer
          onNavigateTab={setCurrentTab}
          onOpenAuth={handleOpenAuth}
        />
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={handleCloseAuth}
      />

      {/* Online Training Registration Modal */}
      {registerSchedule && (
        <TrainingRegistrationModal
          schedule={registerSchedule}
          isOpen={!!registerSchedule}
          onClose={() => setRegisterSchedule(null)}
          onSuccess={handleRegistrationComplete}
          onRequireLogin={() => {
            setRegisterSchedule(null);
            handleOpenAuth('login');
          }}
        />
      )}

      {/* E-Ticket Display Modal */}
      {viewTicket && (
        <ETicketModal
          isOpen={!!viewTicket}
          registration={viewTicket}
          onClose={() => setViewTicket(null)}
        />
      )}

      {/* Direct WhatsApp Contact Widget */}
      <WhatsAppContact />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
