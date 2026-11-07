import {StrictMode, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import { isFirebaseConfigured } from './lib/firebaseEnvironment';

// Delay importing Firebase-dependent providers until configuration is complete.
const App = lazy(() => import('./App.tsx'));
import './index.css';

// Gracefully handle benign background tab visibility transitions, Firestore offline/reconnect notices, and cross-origin CSS inspect warnings
if (typeof window !== 'undefined') {
  const isBenignError = (msg: string) => {
    return (
      msg.includes('Database is closing/hidden') ||
      msg.includes('Cannot access rules') ||
      msg.includes('cssRules') ||
      msg.includes('Error inlining remote css file') ||
      msg.includes('Error while reading CSS rules') ||
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('operate in offline mode') ||
      msg.includes('code=unavailable') ||
      msg.includes('Failed to get document from server') ||
      msg.includes('The operation could not be completed') ||
      msg.includes('the client is offline') ||
      (msg.includes('Connection failed') && msg.includes('Firestore'))
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (isBenignError(msg)) {
      event.preventDefault();
      console.info('[Notice Handled]', msg);
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || (event?.error?.message ?? '') || String(event);
    if (typeof msg === 'string' && isBenignError(msg)) {
      event.preventDefault();
      console.info('[Notice Handled]', msg);
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const combinedMsg = args.map(a => (a instanceof Error ? (a.stack || a.message) : String(a))).join(' ');
    if (isBenignError(combinedMsg)) {
      console.info('[Notice Handled]', combinedMsg);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const combinedMsg = args.map(a => (a instanceof Error ? (a.stack || a.message) : String(a))).join(' ');
    if (isBenignError(combinedMsg)) {
      console.info('[Notice Handled]', combinedMsg);
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isFirebaseConfigured ? (
      <Suspense fallback={<p role="status" className="p-8 text-slate-700">Memuat portal PAMUR…</p>}>
        <App />
      </Suspense>
    ) : (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-800">
        <section className="mx-auto max-w-2xl border-l-4 border-red-800 bg-white p-8 shadow-sm sm:p-12" aria-labelledby="setup-title">
          <p className="mb-6 text-sm font-bold uppercase tracking-widest text-red-800">PAMUR · Pratinjau</p>
          <h1 id="setup-title" className="mb-5 font-serif text-4xl font-bold">Portal belum terhubung</h1>
          <p className="text-lg leading-relaxed">Halaman sementara — konfigurasi layanan anggota belum tersedia.</p>
          <p className="mt-4 leading-relaxed text-slate-600">Data anggota, masuk akun, dan pendaftaran belum tersedia. Portal lengkap akan aktif setelah pengelola menyelesaikan konfigurasi.</p>
        </section>
      </main>
    )}
  </StrictMode>,
);

