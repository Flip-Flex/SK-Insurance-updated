import { db } from '../../../firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { logger } from '../../../services/logger';

export const getUserPolicies = async (uid) => {
  try {
    const q = query(collection(db, 'policies'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Error fetching user policies", { uid, error: error.message });
    return [];
  }
};

export const getUserClaims = async (uid) => {
  try {
    const q = query(collection(db, 'claims'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Error fetching user claims", { uid, error: error.message });
    return [];
  }
};
