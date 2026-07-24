import { db } from '../config/firebase';
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
  orderBy
} from 'firebase/firestore';
import { 
  addDocWithAudit, 
  updateDocWithAudit, 
  deleteDocWithAudit,
  seedCollectionIfEmpty 
} from './firebaseService';
import { PLANS, CAREERS, FAQS, BLOG_POSTS } from './mockData';
import { logger } from './logger';

// Default partners to seed
const PARTNERS_SEED = [
  {
    id: 'partner-postal',
    name: 'Postal Office',
    type: 'Government / PLI',
    logo: '/logos/Postal Office.png',
    onlineLogo: '/logos/Postal Office.png',
    tag: 'INDIA POST TRUST',
    desc: 'Government of India postal life insurance with lowest premiums & maximum bonus rates.'
  },
  {
    id: 'partner-future',
    name: 'Future Generali',
    type: 'General & Health',
    logo: '/logos/Future Generali.jpg',
    onlineLogo: '/logos/Future Generali.jpg',
    tag: 'FAST TRACK CLAIMS',
    desc: 'Global insurance expertise with instant digital policy issuance & hassle-free claim settlement.'
  },
  {
    id: 'partner-bajaj',
    name: 'Bajaj Allianz',
    type: 'General & Motor',
    logo: '/logos/bajaj_allianz.png',
    onlineLogo: 'https://logo.clearbit.com/bajajallianz.com',
    tag: 'GLOBAL ASSIST',
    desc: 'Worldwide emergency care, motor zero-dep, & personal accident cover.'
  }
];

// Default testimonials to seed
const TESTIMONIALS_SEED = [
  {
    id: 'tst-101',
    name: 'Harini Harini',
    role: '1 review • a month ago',
    text: 'I am grateful for the opportunity to complete my internship with this organization. During this internship, I gained valuable knowledge about the insurance industry, customer relationship management, and financial planning. The mentors and staff members were supportive and guided me throughout.',
    rating: 5
  },
  {
    id: 'tst-102',
    name: 'Dhivya Kumaran',
    role: '1 review • a month ago',
    text: 'My internship at sk smart investment company was a valuable learning experience. I improved my communication skill, learned about insurance products and gained practical knowledge about the corporate work environment.',
    rating: 5
  },
  {
    id: 'tst-103',
    name: 'Manimozhi E',
    role: '1 review • a month ago',
    text: 'The mentors and staff members were supportive and guided me throughout the internship, which made the learning experience more comfortable and effective.',
    rating: 5
  }
];

// Default gallery photos to seed
const GALLERY_SEED = [
  {
    id: 'gal-1',
    title: 'Star Health Premier Club 2026',
    tag: 'GOLD CLASSIFIED',
    desc: 'Recognised as a premier advisory channel for high-value portfolio distribution.',
    img: '/IMG-20260714-WA0061.jpg'
  },
  {
    id: 'gal-2',
    title: 'SBI Life Million Dollar Round Table (MDRT)',
    tag: 'GLOBAL CERTIFICATE',
    desc: 'Qualified for the elite global MDRT standard for insurance and financial services professionals.',
    img: '/IMG-20260714-WA0062.jpg'
  },
  {
    id: 'gal-3',
    title: 'postal PLI Top Mobiliser Kanchipuram Division',
    tag: 'DIVISION CHAMPION',
    desc: 'Awarded top agency shield for rural portfolio mobilisation by India Post authorities.',
    img: '/IMG-20260714-WA0063.jpg'
  },
  {
    id: 'gal-4',
    title: 'Future Generali Elite Partner Summit',
    tag: 'CERTIFICATE OF EXCELLENCE',
    desc: 'Honored for exceptional claim support management and high customer satisfaction ratings.',
    img: '/IMG-20260714-WA0064.jpg'
  }
];

// Seeding initiator
export const initializeDatabaseCollections = async () => {
  try {
    await seedCollectionIfEmpty('plans', PLANS);
    await seedCollectionIfEmpty('careers', CAREERS);
    await seedCollectionIfEmpty('faqs', FAQS);
    await seedCollectionIfEmpty('blogs', BLOG_POSTS);
    await seedCollectionIfEmpty('partners', PARTNERS_SEED);
    await seedCollectionIfEmpty('testimonials', TESTIMONIALS_SEED);
    await seedCollectionIfEmpty('gallery', GALLERY_SEED);
    
    // Seed default careers settings
    const settingsCol = collection(db, 'settings');
    const careersSettingsRef = doc(settingsCol, 'careers_page');
    const csDoc = await getDoc(careersSettingsRef);
    if (!csDoc.exists()) {
      await setDoc(careersSettingsRef, {
        badge: 'Join Our Team',
        title: 'Build the Future of InsurTech',
        subtitle: 'We are looking for creative thinkers, diligent risk assessors, and talented engineers to shape digital protection products globally.',
        hrEmail: 'careers@skinsurance.com'
      });
    }

    // Seed default permissions matrix settings
    const permsRef = doc(settingsCol, 'permissions');
    const permsDoc = await getDoc(permsRef);
    if (!permsDoc.exists()) {
      await setDoc(permsRef, {
        'Initiate Mutual Fund SIP': ['Admin', 'Manager', 'Agent', 'Customer'],
        'Submit Insurance Claim': ['Admin', 'Manager', 'Employee', 'Agent', 'Customer'],
        'Approve Claim Requests': ['Admin', 'Manager', 'Employee'],
        'Read Platform Audit Logs': ['Admin', 'Manager'],
        'Upload Gallery Assets': ['Admin']
      });
    }

    logger.info("Database collections checked and seeded successfully");
  } catch (error) {
    logger.error("Failed to initialize database collections", { error: error.message });
  }
};

// -------------------------------------------------------------
// PLANS Collection CRUD
// -------------------------------------------------------------
export const getPlans = async () => {
  try {
    const plansCol = collection(db, 'plans');
    const plansSnapshot = await getDocs(plansCol);
    const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (plansList.length === 0) {
      await seedCollectionIfEmpty('plans', PLANS);
      return PLANS;
    }
    return plansList;
  } catch (error) {
    logger.error("Failed to fetch plans from Firestore, returning local fallback", { error: error.message });
    return PLANS;
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
