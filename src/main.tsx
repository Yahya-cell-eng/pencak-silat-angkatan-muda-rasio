import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle benign background tab visibility transitions from Firebase IndexedDB
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (msg.includes('Database is closing/hidden')) {
      event.preventDefault();
      console.info('[Auth Status] Handled background tab visibility transition.');
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || (event?.error?.message ?? '');
    if (typeof msg === 'string' && msg.includes('Database is closing/hidden')) {
      event.preventDefault();
      console.info('[Auth Status] Handled background tab visibility transition.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

