import { db } from '../firebase/firestore';
import { isFirebaseConfigured } from '../firebase/config';
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
