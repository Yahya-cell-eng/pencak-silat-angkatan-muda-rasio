import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle benign background tab visibility transitions and cross-origin CSS inspect warnings
if (typeof window !== 'undefined') {
  const isBenignError = (msg: string) => {
    return (
      msg.includes('Database is closing/hidden') ||
      msg.includes('Cannot access rules') ||
      msg.includes('cssRules') ||
      msg.includes('Error inlining remote css file') ||
      msg.includes('Error while reading CSS rules')
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
    const combinedMsg = args.map(a => (a instanceof Error ? a.message : String(a))).join(' ');
    if (isBenignError(combinedMsg)) {
      console.info('[Notice Handled]', combinedMsg);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

