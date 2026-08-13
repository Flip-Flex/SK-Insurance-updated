import { getFirestore } from 'firebase/firestore';
import { app, isFirebaseConfigured } from './config';

export const db = isFirebaseConfigured ? getFirestore(app) : null;
