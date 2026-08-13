import { db } from '../../../firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { logger } from '../../../services/logger';

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
