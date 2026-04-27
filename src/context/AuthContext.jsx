import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Mock Firebase for instant flawless demo out of the box
// To use real Firebase, you'd replace these functions with Firebase Auth/Firestore calls
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersDb, setUsersDb] = useState({});
  const [historyDb, setHistoryDb] = useState([]);

  // Mock valid codes that the dustbin would generate
  const validCodes = ['ECO123', 'BIN456', 'GRN789', 'SAVE01', 'RECYC2'];

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('ecoUser');
    const storedDb = localStorage.getItem('ecoUsersDb');
    const storedHistory = localStorage.getItem('ecoHistoryDb');

    if (storedDb) setUsersDb(JSON.parse(storedDb));
    if (storedHistory) setHistoryDb(JSON.parse(storedHistory));
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = 'usr_' + Math.random().toString(36).substr(2, 9);
        const newUser = { id, email, name, points: 0 };
        
        const newDb = { ...usersDb, [id]: newUser };
        setUsersDb(newDb);
        localStorage.setItem('ecoUsersDb', JSON.stringify(newDb));
        
        setCurrentUser(newUser);
        localStorage.setItem('ecoUser', JSON.stringify(newUser));
        resolve({ success: true });
      }, 800);
    });
  };

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by email
        const user = Object.values(usersDb).find(u => u.email === email);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('ecoUser', JSON.stringify(user));
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'User not found or incorrect password.' });
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecoUser');
  };

  const redeemCode = async (code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const upperCode = code.toUpperCase();
        
        // 1. Check if code has already been used by this user
        const alreadyUsed = historyDb.some(h => h.code === upperCode && h.userId === currentUser.id);
        if (alreadyUsed) {
          return resolve({ success: false, error: 'You have already redeemed this code.' });
        }

        // 2. Check if code is valid
        if (!validCodes.includes(upperCode)) {
          return resolve({ success: false, error: 'Invalid or expired code.' });
        }

        // 3. Success! Add points
        const pointsToAdd = 10;
        const updatedUser = { ...currentUser, points: currentUser.points + pointsToAdd };
        
        const newHistoryItem = {
          id: 'hist_' + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          code: upperCode,
          points: pointsToAdd,
          date: new Date().toISOString()
        };

        const newHistory = [newHistoryItem, ...historyDb];
        const newDb = { ...usersDb, [currentUser.id]: updatedUser };

        // Update state & local storage
        setCurrentUser(updatedUser);
        setUsersDb(newDb);
        setHistoryDb(newHistory);

        localStorage.setItem('ecoUser', JSON.stringify(updatedUser));
        localStorage.setItem('ecoUsersDb', JSON.stringify(newDb));
        localStorage.setItem('ecoHistoryDb', JSON.stringify(newHistory));

        resolve({ success: true, pointsAdded: pointsToAdd });
      }, 1200); // Simulate network delay for progress loader
    });
  };

  const getUserHistory = () => {
    return historyDb.filter(h => h.userId === currentUser?.id);
  };

  const getLeaderboard = () => {
    return Object.values(usersDb).sort((a, b) => b.points - a.points);
  };

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
