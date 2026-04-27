import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Rewards = () => {
  const { currentUser, getUserHistory } = useAuth();
  const history = getUserHistory();

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <h2>My Wallet</h2>
      <p style={{ marginBottom: '20px' }}>Manage your eco points and rewards.</p>

      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px' }}>Available Balance</p>
          <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--primary)' }}>{currentUser?.points}</h2>
        </div>
        <div style={{ background: 'var(--primary-light)', padding: '15px', borderRadius: '15px', color: 'var(--primary)' }}>
          <Gift size={32} />
        </div>
      </div>

      <div className="card">
        <h3>Redeem Store (Coming Soon)</h3>
        <div style={{ marginTop: '16px', opacity: 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
            <div>Amazon $5 Gift Card</div>
            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>500 pts</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>Starbucks Coffee</div>
            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>300 pts</div>
          </div>
        </div>
      </div>

      <h3 style={{ margin: '24px 0 16px 0' }}>Transaction History</h3>
      <div className="card">
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-info">
                <div className="history-title">Smart Bin - Code: {item.code}</div>
                <div className="history-date">{new Date(item.date).toLocaleString()}</div>
              </div>
              <div className="history-points">+{item.points}</div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Rewards;
