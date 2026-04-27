import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

// Screens
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import CodeEntry from './screens/CodeEntry';
import Rewards from './screens/Rewards';
import Leaderboard from './screens/Leaderboard';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAuthScreen = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/scan" element={<PrivateRoute><CodeEntry /></PrivateRoute>} />
        <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      </Routes>

      {currentUser && !isAuthScreen && <Navigation />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
