import { getAuth } from 'firebase/auth';
import { app, isFirebaseConfigured } from './config';

export const auth = isFirebaseConfigured ? getAuth(app) : null;
