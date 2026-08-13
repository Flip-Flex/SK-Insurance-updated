import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { logger } from '../services/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seed default collections and listen to Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Fallback sandbox mode logic
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch user profile doc from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let profile = null;
          
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              profile = userDoc.data();
            }
          } catch (readErr) {
            console.warn('Firestore read failed, will create profile:', readErr.message);
          }
          
          if (!profile) {
            const emailPart = firebaseUser.email.split('@')[0];
            profile = {
              username: emailPart,
              name: emailPart.replace('_', ' ').toUpperCase(),
              role: 'manager',
              email: firebaseUser.email,
              id: `USER-${Math.floor(1000 + Math.random() * 9000)}`
            };
            try {
              await setDoc(userDocRef, profile);
              console.log('Created new manager profile in Firestore');
            } catch (writeErr) {
              console.warn('Firestore write failed, using local profile:', writeErr.message);
            }
          }
          
          profile.emailVerified = firebaseUser.emailVerified;
          profile.uid = firebaseUser.uid;
          setUser(profile);
          logger.auth(`User signed in via Firebase`, true, { email: firebaseUser.email });
        } catch (error) {
          // Even if Firestore completely fails, still set a basic user so they can access dashboard
          console.error("Auth state change error:", error.message);
          const fallbackProfile = {
            username: firebaseUser.email.split('@')[0],
            name: firebaseUser.email.split('@')[0].toUpperCase(),
            role: 'manager',
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            emailVerified: firebaseUser.emailVerified,
            id: `USER-${Math.floor(1000 + Math.random() * 9000)}`
          };
          setUser(fallbackProfile);
          logger.error("Used fallback profile due to Firestore error", { error: error.message });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    let cleanedEmail = email.trim().toLowerCase();
    
    if (!cleanedEmail.includes('@')) {
      cleanedEmail = `${cleanedEmail}@sksmart.com`;
    }

    logger.info(`Login attempt started`, { email: cleanedEmail });

    if (!isFirebaseConfigured) {
      return 'Firebase is not configured.';
    }

    try {
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await signInWithEmailAndPassword(auth, cleanedEmail, password);
      
      // Auth succeeded - try Firestore but don't fail login if it errors
      try {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        let profile;
        if (userDoc.exists()) {
          profile = userDoc.data();
        } else {
          profile = {
            username: cleanedEmail.split('@')[0],
            name: cleanedEmail.split('@')[0].toUpperCase(),
            role: 'manager',
            email: cleanedEmail,
            id: `USER-${Math.floor(1000 + Math.random() * 9000)}`
          };
          await setDoc(userDocRef, profile);
        }
        profile.emailVerified = userCredential.user.emailVerified;
        profile.uid = userCredential.user.uid;
        setUser(profile);
      } catch (firestoreErr) {
        console.warn('Firestore profile error during login, using fallback:', firestoreErr.message);
        // Still set user with fallback profile so dashboard works
        setUser({
          username: cleanedEmail.split('@')[0],
          name: cleanedEmail.split('@')[0].toUpperCase(),
          role: 'manager',
          email: cleanedEmail,
          uid: userCredential.user.uid,
          emailVerified: userCredential.user.emailVerified,
          id: `USER-${Math.floor(1000 + Math.random() * 9000)}`
        });
      }
      return true;
    } catch (error) {
      logger.auth(`Original Login Error`, false, { error: error.code, message: error.message });
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
      
      const profile = {
        username: email.split('@')[0],
        name: name,
        role: 'manager',
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
      
      logout, 
      isAuthenticated: !!user, 
      isManager: user?.role === 'manager', 
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
