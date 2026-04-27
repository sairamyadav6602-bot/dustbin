import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout, getUserHistory } = useAuth();
  const history = getUserHistory().slice(0, 5); // Only get 5 most recent

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="header-row">
        <div>
          <p>Hello, {currentUser?.name?.split(' ')[0]}</p>
          <h2>You saved the environment today 🌱</h2>
        </div>
        <div className="profile-avatar" onClick={logout} title="Click to logout">
          {currentUser?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="points-display">
        <h3>Total Balance</h3>
        <div className="points">{currentUser?.points}</div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>Eco Points Earned</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Recent Activity
          <Link to="/rewards" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>See all</Link>
        </h3>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
            <Trash2 size={40} style={{ opacity: 0.2, margin: '0 auto 10px auto' }} />
            <p>No activity yet.</p>
            <p style={{ fontSize: '13px' }}>Dispose waste to earn points!</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="history-icon"><Trash2 size={20} /></div>
                <div>
                  <div className="history-title">Smart Bin Deposit</div>
                  <div className="history-date">{new Date(item.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="history-points">+{item.points}</div>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ background: 'linear-gradient(to right, #D1FAE5, #ECFDF5)', border: 'none' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>Did you know?</h3>
        <p style={{ color: 'var(--primary-dark)', fontSize: '14px' }}>
          Recycling one plastic bottle saves enough energy to power a lightbulb for 3 hours! Keep up the good work.
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
