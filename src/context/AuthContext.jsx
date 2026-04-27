import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  orderBy,
  runTransaction
} from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
          fetchUserHistory(user.uid);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setHistory([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch leaderboard periodically
  useEffect(() => {
    fetchLeaderboard();
  }, [currentUser]);

  const fetchUserHistory = async (userId) => {
    try {
      const q = query(
        collection(db, 'history'), 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const histData = [];
      querySnapshot.forEach((doc) => histData.push({ id: doc.id, ...doc.data() }));
      setHistory(histData);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'));
      const querySnapshot = await getDocs(q);
      const leaders = [];
      querySnapshot.forEach((doc) => leaders.push({ id: doc.id, ...doc.data() }));
      setLeaderboard(leaders);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        email,
        name,
        points: 0,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      setCurrentUser({ id: user.uid, ...userData });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Invalid email or password." };
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const redeemCode = async (code) => {
    const upperCode = code.toUpperCase();
    const codeRef = doc(db, 'codes', upperCode);
    const userRef = doc(db, 'users', currentUser.id);

    try {
      // Use a transaction to ensure code is securely claimed and points added
      const pointsAdded = await runTransaction(db, async (transaction) => {
        const codeDoc = await transaction.get(codeRef);
        
        if (!codeDoc.exists()) {
          throw new Error('Invalid or expired code.');
        }
        
        const codeData = codeDoc.data();
        if (codeData.status !== 'unused') {
          throw new Error('This code has already been redeemed.');
        }

        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error('User not found.');
        }

        const pointsAwarded = 10;
        const newPoints = userDoc.data().points + pointsAwarded;

        // Mark code as used
        transaction.update(codeRef, { 
          status: 'used', 
          used_by: currentUser.id,
          usedAt: new Date().toISOString()
        });

        // Update user points
        transaction.update(userRef, { points: newPoints });

        // Add to history
        const newHistoryRef = doc(collection(db, 'history'));
        transaction.set(newHistoryRef, {
          userId: currentUser.id,
          code: upperCode,
          points: pointsAwarded,
          date: new Date().toISOString()
        });

        return pointsAwarded;
      });

      // Optimistically update local state
      setCurrentUser(prev => ({ ...prev, points: prev.points + pointsAdded }));
      fetchUserHistory(currentUser.id);
      fetchLeaderboard();

      return { success: true, pointsAdded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserHistory = () => history;
  const getLeaderboard = () => leaderboard;

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    redeemCode,
    getUserHistory,
    getLeaderboard
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
