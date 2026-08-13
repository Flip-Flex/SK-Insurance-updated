import { getStorage } from 'firebase/storage';
import { app, isFirebaseConfigured } from './config';

export const storage = isFirebaseConfigured ? getStorage(app) : null;
