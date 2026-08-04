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

  // Default mock credentials mapping for automatic provisioning
  const defaultProvisionUsers = {
    'manager1@mail.com': { password: 'manager1@123', name: 'David Vance', role: 'manager', id: 'MGR-4490' },
    'manager2@mail.com': { password: 'manager2@123', name: 'Alice Smith', role: 'manager', id: 'MGR-4491' }
  };

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
          const userDoc = await getDoc(userDocRef);
          
          let profile = null;
          if (userDoc.exists()) {
            profile = userDoc.data();
          } else {
            // Check if this matches a default provision user
            const defaultUser = defaultProvisionUsers[firebaseUser.email.toLowerCase()];
            const emailPart = firebaseUser.email.split('@')[0];
            const detectedRole = firebaseUser.email.includes('admin') ? 'admin' :
                                 firebaseUser.email.includes('manager') ? 'manager' : 'customer';
            
            profile = {
              username: emailPart,
              name: defaultUser ? defaultUser.name : emailPart.replace('_', ' ').toUpperCase(),
              role: defaultUser ? defaultUser.role : detectedRole,
              email: firebaseUser.email,
              id: defaultUser ? defaultUser.id : `USER-${Math.floor(1000 + Math.random() * 9000)}`
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

    if (!isFirebaseConfigured || cleanedEmail === 'manager1@mail.com' || cleanedEmail === 'manager2@mail.com') {
      // Sandbox fallback mode mock logins, or forceful bypass for the demo manager account
      const defaultUser = defaultProvisionUsers[cleanedEmail];
      if (defaultUser && defaultUser.password === password) {
        const profile = {
          email: cleanedEmail,
          name: defaultUser.name,
          role: defaultUser.role,
          id: defaultUser.id
        };
        setUser(profile);
        return true;
      }
      if (!isFirebaseConfigured) return false;
    }

    try {
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, cleanedEmail, password);
      return true;
    } catch (error) {
      // If user doesn't exist yet in Auth, but matches a default provision user, register them automatically!
      const defaultUser = defaultProvisionUsers[cleanedEmail];
      if (defaultUser && defaultUser.password === password) {
        try {
          logger.info(`Provisioning default account dynamically`, { email: cleanedEmail });
          const result = await createUserWithEmailAndPassword(auth, cleanedEmail, password);
          
          const profile = {
            username: cleanedEmail.split('@')[0],
            name: defaultUser.name,
            role: defaultUser.role,
            email: cleanedEmail,
            id: defaultUser.id
          };
          await setDoc(doc(db, 'users', result.user.uid), profile);
          
          // Trigger sign-in
          await signInWithEmailAndPassword(auth, cleanedEmail, password);
          return true;
        } catch (provisionError) {
          logger.error(`Failed to dynamically provision default account`, { error: provisionError.message });
          return `Provision Error: ${provisionError.message}`;
        }
      }

      logger.auth(`Firebase Authentication failed`, false, { email: cleanedEmail, error: error.message });
      return `Auth Error: ${error.message}`;
    }
  };

  const register = async (email, password, name) => {
    if (!isFirebaseConfigured) {
      const profile = {
        email,
        name,
        role: 'customer',
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setUser(profile);
      return true;
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
      logger.info(`Mock password reset email sent to: ${email}`);
      return true;
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
      logger.info(`Mock verification email sent to current user`);
      return true;
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
      setUser(prev => prev ? { ...prev, role } : null);
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
