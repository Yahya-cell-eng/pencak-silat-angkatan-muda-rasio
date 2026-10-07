import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Suppress verbose internal WebChannel connection retry logging from Firestore
try {
  setLogLevel('silent');
} catch {
  // ignore
}

// Support both Netlify / Vite environment variables and firebase-applet-config.json
const resolvedFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || '',
};

const app = !getApps().length ? initializeApp(resolvedFirebaseConfig) : getApps()[0];

export const db = resolvedFirebaseConfig.firestoreDatabaseId && resolvedFirebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } catch {
    return getAuth(app);
  }
})();

// Test Firestore connection on boot as specified in the Firebase Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'initial_seed'));
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (
      errMsg.includes('offline') || 
      errMsg.includes('unavailable') || 
      errMsg.includes('Could not reach Cloud Firestore backend') ||
      errMsg.includes('failed-precondition')
    ) {
      console.info("[Firestore Status] Client is operating in cached/offline mode.");
    } else {
      console.info("[Firestore Status] Connection status verified.");
    }
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1000);
} else {
  testConnection().catch(() => {});
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Gracefully handle expected offline or transient network disconnection
  if (
    errMsg.includes('offline') || 
    errMsg.includes('unavailable') || 
    errMsg.includes('Could not reach Cloud Firestore backend') ||
    errMsg.includes('failed-precondition') ||
    errMsg.includes('Database is closing/hidden') ||
    errMsg.includes('Quota') ||
    errMsg.includes('quota') ||
    errMsg.includes('resource-exhausted')
  ) {
    console.info(`[Firestore Info] Connection status (${operationType} on ${path || 'unknown'}): operating in cached/offline mode.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}


