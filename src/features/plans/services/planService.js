import { db } from '../../../firebase/firestore';
import { isFirebaseConfigured } from '../../../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { addDocWithAudit } from '../../../services/firebaseService';
import { logger } from '../../../services/logger';

export const getPlans = async (lastVisibleDoc = null, pageSize = 20) => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
  
  try {
    const plansCol = collection(db, 'plans');
    let q = query(plansCol, orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastVisibleDoc) {
      q = query(plansCol, orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(pageSize));
    }
    const plansSnapshot = await getDocs(q);
    const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      plans: plansList,
      lastVisible: plansSnapshot.docs[plansSnapshot.docs.length - 1]
    };
  } catch (error) {
    logger.error("Failed to fetch plans from Firestore", { error: error.message });
    throw error;
  }
};

export const createPlan = async (planData, user = null) => {
  try {
    const docRef = await addDocWithAudit('plans', planData, user);
    logger.info("Successfully created new plan", { planId: docRef.id });
    return { success: true, id: docRef.id };
  } catch (error) {
    logger.error("Firestore create failed", { error: error.message });
    throw error;
  }
};

export const updatePlan = async (planId, planData, user = null) => {
  try {
    const planRef = doc(db, 'plans', planId);
    const updatePayload = { ...planData, updatedAt: new Date().toISOString() };
    if (user) updatePayload.updatedBy = user.email || user.username || 'system';

    await updateDoc(planRef, updatePayload);
    logger.info("Successfully updated plan", { planId });
    return { success: true };
  } catch (error) {
    logger.error("Firestore update failed", { error: error.message });
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const planRef = doc(db, 'plans', planId);
    await deleteDoc(planRef);
    logger.info("Successfully deleted plan", { planId });
    return { success: true };
  } catch (error) {
    logger.error("Firestore delete failed", { error: error.message });
    throw error;
  }
};
