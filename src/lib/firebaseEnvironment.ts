// Only public Firebase web configuration belongs in VITE_ variables.
// Service account credentials and private server keys must never be used here.
export const firebaseEnvironment = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID,
};

// Require an explicit database ID so a named database cannot silently fall back
// to a different default database. Use "(default)" for the default database.
export const isFirebaseConfigured = Object.values(firebaseEnvironment).every(
  value => typeof value === 'string' && value.trim().length > 0,
);
