import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { TrainingSchedule, TrainingRegistration } from './types';

// Components
import { Navbar } from './components/Navbar';
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

const MainAppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { schedules } = useData();

  // Navigation Tabs: 'home' | 'articles' | 'schedules' | 'belts' | 'branches' | 'profile' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modal States
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  const [registerSchedule, setRegisterSchedule] = useState<TrainingSchedule | null>(null);
  const [viewTicket, setViewTicket] = useState<TrainingRegistration | null>(null);

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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-red-700 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
      </main>

      {/* Footer */}
      <Footer
        onNavigateTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

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
