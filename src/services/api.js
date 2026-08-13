import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { 
  addDocWithAudit, 
  updateDocWithAudit, 
  deleteDocWithAudit,
  seedCollectionIfEmpty 
} from './firebaseService';
import { logger } from './logger';

// -------------------------------------------------------------
// PLANS Collection CRUD
// -------------------------------------------------------------

export const getSettings = async (settingName) => {
  try {
    const settingDoc = await getDoc(doc(db, 'settings', settingName));
    if (settingDoc.exists()) {
      return settingDoc.data();
    }
    return null;
  } catch (error) {
    logger.error(`Failed to fetch setting ${settingName}`, { error: error.message });
    return null;
  }
};

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

// -------------------------------------------------------------
// INQUIRIES & TICKETS CRUD
// -------------------------------------------------------------
export const saveTicket = async (ticketData, user = null) => {
  try {
    const ticket = {
      ...ticketData,
      status: 'Open'
    };
    await addDocWithAudit('tickets', ticket, user);
    logger.info("Successfully pushed inquiry ticket to Firestore", { ticketSubject: ticket.subject });
    return true;
  } catch (error) {
    logger.error("Failed to push inquiry ticket to Firestore", { error: error.message });
    return false;
  }
};

// -------------------------------------------------------------
// ADVISORY APPOINTMENTS CRUD
// -------------------------------------------------------------
export const saveAppointment = async (appointmentData, user = null) => {
  try {
    await addDocWithAudit('appointments', appointmentData, user);
    logger.info("Successfully saved advisor appointment to Firestore", { refId: appointmentData.id });
    return true;
  } catch (error) {
    logger.error("Failed to save advisor appointment to Firestore", { error: error.message });
    return false;
  }
};

// -------------------------------------------------------------
// USER PROFILES COLLECTION CRUD
// -------------------------------------------------------------
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    logger.error("Error retrieving user profile from Firestore", { uid, error: error.message });
    return null;
  }
};

export const createUserProfile = async (uid, profileData) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const newProfile = {
      ...profileData,
      id: profileData.id || `USR-${Math.floor(100 + Math.random() * 900)}`,
      uid,
      active: profileData.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, newProfile);
    logger.info("Created user profile inside Firestore", { uid, role: profileData.role });
    return true;
  } catch (error) {
    logger.error("Failed to create user profile inside Firestore", { uid, error: error.message });
    return false;
  }
};

// -------------------------------------------------------------
// PREMIUM CALCULATOR HISTORY CRUD
// -------------------------------------------------------------
export const saveCalculation = async (calcData, user = null) => {
  try {
    await addDocWithAudit('calculatorHistory', calcData, user);
    logger.info("Saved premium calculation record in Firestore");
    return true;
  } catch (error) {
    logger.error("Failed to save premium calculation record in Firestore", { error: error.message });
    return false;
  }
};

// -------------------------------------------------------------
// POLICIES & CLAIMS OPERATIONS
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// AUDIT LOGGING UTILITY
// -------------------------------------------------------------
export const saveAuditLog = async (action, user = null, details = {}) => {
  try {
    const log = {
      action,
      user: user ? `${user.name} (${user.role})` : 'System',
      timestamp: new Date().toISOString(),
      ip: details.ip || 'localhost',
      status: details.status || 'Success',
      details
    };
    await addDoc(collection(db, 'logs'), log);
  } catch (error) {
    console.error("Failed to record system audit log", error);
  }
};

// -------------------------------------------------------------
// DYNAMIC UI DATA FETCHERS
// -------------------------------------------------------------

export const getNotifications = async () => {
  try {
    const colRef = collection(db, 'notifications');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Failed to fetch notifications", { error: error.message });
    return [];
  }
};

export const getCareers = async () => {
  try {
    const colRef = collection(db, 'careers');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Failed to fetch careers", { error: error.message });
    return [];
  }
};

export const getBlogPosts = async () => {
  try {
    const colRef = collection(db, 'blogs');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Failed to fetch blogs", { error: error.message });
    return [];
  }
};

export const getFaqs = async () => {
  try {
    const colRef = collection(db, 'faqs');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error("Failed to fetch faqs", { error: error.message });
    return [];
  }
};

export const getStats = async () => {
  try {
    const docRef = doc(db, 'settings', 'home_stats');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists() && snapshot.data().stats) {
      return snapshot.data().stats;
    }
    return [];
  } catch (error) {
    logger.error("Failed to fetch home stats", { error: error.message });
    return [];
  }
};
