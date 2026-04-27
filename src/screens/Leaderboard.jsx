import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { getLeaderboard, currentUser } = useAuth();
  const leaderboard = getLeaderboard();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2>Leaderboard</h2>
      <p style={{ marginBottom: '24px' }}>Top eco-warriors in your community.</p>

      <div className="card" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Trophy size={40} />
          <div>
            <h3 style={{ color: 'white', margin: 0 }}>Your Rank</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              #{leaderboard.findIndex(u => u.id === currentUser?.id) + 1} of {leaderboard.length} users
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {leaderboard.map((user, index) => (
          <div 
            key={user.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '16px 20px',
              borderBottom: index !== leaderboard.length - 1 ? '1px solid #E5E7EB' : 'none',
              background: user.id === currentUser?.id ? 'var(--primary-light)' : 'transparent'
            }}
          >
            <div style={{ width: '30px', fontWeight: 'bold', color: index < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
              {index + 1}
            </div>
            
            <div className="profile-avatar" style={{ width: '40px', height: '40px', fontSize: '16px', marginRight: '16px' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                {user.name} {user.id === currentUser?.id && '(You)'}
              </div>
            </div>
            
            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
              {user.points} pts
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
