import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { logger } from './logger';

/**
 * Generic real-time synchronization for any collection.
 * Triggers the callback automatically when changes happen.
 */
export const subscribeToCollection = (collectionName, callback) => {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    }, (error) => {
      logger.error(`Real-time sync failed for collection: ${collectionName}`, { error: error.message });
      callback([]); // Unblock UI on error
    });
  } catch (error) {
    logger.error(`Failed to set up real-time listener for ${collectionName}`, { error: error.message });
    callback([]); // Unblock UI on error
    return () => {};
  }
};

/**
 * Adds a new document with audit metadata fields.
 */
export const addDocWithAudit = async (collectionName, data, user = null) => {
  try {
    const colRef = collection(db, collectionName);
    const docId = data.id || `doc-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const docRef = doc(colRef, docId);

    const auditData = {
      ...data,
      id: docId,
      status: data.status || 'Active',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user ? { uid: user.uid || user.id, name: user.name, role: user.role } : 'system',
      updatedBy: user ? { uid: user.uid || user.id, name: user.name, role: user.role } : 'system'
    };

    await setDoc(docRef, auditData);
    logger.info(`Added document to ${collectionName} with audit trailing`, { docId });
    return docId;
  } catch (error) {
    logger.error(`Failed to add document to ${collectionName}`, { error: error.message });
    throw error;
  }
};

/**
 * Updates an existing document with audit metadata fields.
 */
export const updateDocWithAudit = async (collectionName, docId, data, user = null) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const auditUpdates = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: user ? { uid: user.uid || user.id, name: user.name, role: user.role } : 'system'
    };

    await updateDoc(docRef, auditUpdates);
    logger.info(`Updated document in ${collectionName} with audit trailing`, { docId });
    return true;
  } catch (error) {
    logger.error(`Failed to update document in ${collectionName} (ID: ${docId})`, { error: error.message });
    throw error;
  }
};

/**
 * Deletes a document or marks it as deleted (soft delete by status).
 * We will perform hard deletes for configuration tables, but log the event.
 */
export const deleteDocWithAudit = async (collectionName, docId, user = null) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    logger.info(`Deleted document in ${collectionName}`, { docId, deletedBy: user ? user.name : 'system' });
    return true;
  } catch (error) {
    logger.error(`Failed to delete document in ${collectionName} (ID: ${docId})`, { error: error.message });
    throw error;
  }
};

/**
 * Uploads a file to Firebase Storage and returns the public download URL.
 */
export const uploadMediaFile = (file, folderPath = 'uploads') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file object provided for upload"));
      return;
    }
    
    // File validation checks
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      reject(new Error("File size exceeds the 5MB limit"));
      return;
    }

    const fileName = file.name ? file.name : 'upload.jpg';
    const fileExtension = fileName.split('.').pop();
    const finalName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;
    const storageRef = ref(storage, `${folderPath}/${finalName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Can optionally log upload progress
      }, 
      (error) => {
        logger.error("Media upload task failed inside Storage", { error: error.message });
        reject(error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          logger.info("File successfully uploaded to Firebase Storage", { path: `${folderPath}/${fileName}` });
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Seeds a collection if it is empty.
 */
export const seedCollectionIfEmpty = async (collectionName, defaultData) => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      logger.info(`Seeding empty collection: ${collectionName}`);
      for (const item of defaultData) {
        const docId = item.id || `seed-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const docRef = doc(colRef, docId);
        await setDoc(docRef, {
          ...item,
          id: docId,
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'seeder',
          updatedBy: 'seeder'
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error seeding collection: ${collectionName}`, { error: error.message });
    return false;
  }
};
