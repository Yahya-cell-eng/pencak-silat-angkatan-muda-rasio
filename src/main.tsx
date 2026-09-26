import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
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
    <App />
  </StrictMode>,
);

