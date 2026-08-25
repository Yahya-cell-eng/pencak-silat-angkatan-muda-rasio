import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

export const auth = getAuth(app);

// Test Firestore connection on boot as specified in the Firebase Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'initial_seed'));
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('the client is offline') || 
      error.message.includes('unavailable') ||
      error.message.includes('Could not reach Cloud Firestore backend') ||
      error.message.includes('failed-precondition')
    )) {
      console.info("[Firestore Status] Client is operating in local/offline cache mode.");
    }
  }
}
testConnection();

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
    errMsg.includes('failed-precondition')
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

