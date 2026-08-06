import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeDatabaseCollections } from '../services/api';
import { logger } from '../services/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seed default collections and listen to Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch user profile doc from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let profile = null;
          if (userDoc.exists()) {
            profile = userDoc.data();
          } else {
            const emailPart = firebaseUser.email.split('@')[0];
            const detectedRole = firebaseUser.email.includes('admin') ? 'admin' : 'customer';
            
            profile = {
              username: emailPart,
              name: emailPart.replace('_', ' ').toUpperCase(),
              role: detectedRole,
              email: firebaseUser.email,
              id: `USER-${Math.floor(1000 + Math.random() * 9000)}`
            };
            await setDoc(userDocRef, profile);
          }
          
          profile.emailVerified = firebaseUser.emailVerified;
          setUser(profile);
          logger.auth(`User signed in via Firebase`, true, { email: firebaseUser.email });

          // Seed database if this user is an admin
          if (profile.role === 'admin') {
            await initializeDatabaseCollections();
          }
        } catch (error) {
          logger.error("Failed to fetch user Firestore profile on auth change", { error: error.message });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const cleanedEmail = email.trim().toLowerCase();
    logger.info(`Login attempt started`, { email: cleanedEmail });

    if (!isFirebaseConfigured) {
      return 'Firebase is not configured.';
    }

    try {
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, cleanedEmail, password);
      return true;
    } catch (error) {
      logger.auth(`Firebase Authentication failed`, false, { email: cleanedEmail, error: error.message });
      return `Auth Error: ${error.message}`;
    }
  };

  const register = async (email, password, name) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      
      const profile = {
        username: email.split('@')[0],
        name: name,
        role: 'customer',
        email: email,
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`
      };
      await setDoc(doc(db, 'users', result.user.uid), profile);
      logger.info("Real user registered and profile initialized in Firestore", { email });
      return true;
    } catch (error) {
      logger.error("Failed to register account via Firebase Auth", { error: error.message });
      throw error;
    }
  };

  const sendPasswordReset = async (email) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }
    try {
      await sendPasswordResetEmail(auth, email);
      logger.info("Sent password reset email via Firebase", { email });
      return true;
    } catch (error) {
      logger.error("Failed to send password reset email", { error: error.message });
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        logger.info("Sent email verification link via Firebase", { email: auth.currentUser.email });
        return true;
      } catch (error) {
        logger.error("Failed to send email verification", { error: error.message });
        throw error;
      }
    }
    return false;
  };

  const switchRole = async (role) => {
    logger.info(`Switching user session role`, { targetRole: role });
    if (!isFirebaseConfigured) {
      return;
    }

    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const updatedProfile = {
          ...user,
          role: role
        };
        await setDoc(userDocRef, updatedProfile, { merge: true });
        setUser(updatedProfile);
        logger.info(`Live user role switched in Firestore`, { uid: auth.currentUser.uid, role });
      } catch (error) {
        logger.error(`Failed to switch live user role in Firestore`, { error: error.message });
      }
    }
  };

  const logout = async () => {
    logger.info(`User logout requested`);
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      logger.error(`Error during Firebase signout`, { error: error.message });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      sendPasswordReset, 
      sendVerificationEmail, 
      switchRole, 
      logout, 
      isAuthenticated: !!user, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
