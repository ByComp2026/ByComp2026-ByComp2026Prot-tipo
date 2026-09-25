import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured Database ID (Mandatory per skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Operation types for standard error handling
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
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Universal deep sanitizer: removes undefined values from objects & arrays to prevent Firestore setDoc/updateDoc errors
export function sanitizeFirestoreDoc<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        result[key] = sanitizeFirestoreDoc(val);
      } else if (Array.isArray(val)) {
        result[key] = val.map(item => {
          if (item !== null && typeof item === 'object' && !(item instanceof Date)) {
            return sanitizeFirestoreDoc(item);
          }
          return item === undefined ? null : item;
        });
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

// Connection test on boot
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return { success: true, message: 'Conectado ao Firebase Firestore (us-west2)' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return { success: false, message: 'Cliente offline - verifique a configuração do Firebase' };
    }
    // Any document missing is normal for connection testing as long as client reached server
    console.log('Firestore reached server:', error);
    return { success: true, message: 'Conectado ao Firebase Firestore (us-west2)' };
  }
}

// Auto test on boot
testConnection().catch((err) => console.warn('Firebase test connection:', err));
