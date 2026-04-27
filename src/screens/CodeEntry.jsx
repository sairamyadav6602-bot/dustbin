import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeEntry = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const { redeemCode } = useAuth();

  const handleValidate = async () => {
    if (code.length < 5) {
      setStatus('error');
      setMessage('Code must be at least 5 characters long.');
      return;
    }

    setStatus('loading');
    const res = await redeemCode(code);
    
    if (res.success) {
      setStatus('success');
      setPointsEarned(res.pointsAdded);
      setCode('');
    } else {
      setStatus('error');
      setMessage(res.error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2>Claim Reward</h2>
      <p style={{ marginBottom: '24px' }}>Enter the 6-character code from the smart dustbin.</p>

      <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <QrCode size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
        
        <input 
          type="text" 
          placeholder="e.g. ECO123" 
          className="input-field"
          style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          disabled={status === 'loading' || status === 'success'}
        />

        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}
            >
              <AlertCircle size={18} />
              <span>{message}</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: 'var(--primary)', marginBottom: '20px' }}
            >
              <CheckCircle size={48} style={{ margin: '0 auto 10px auto' }} />
              <h3 style={{ color: 'var(--primary-dark)' }}>Success!</h3>
              <p style={{ color: 'var(--primary)' }}>You earned +{pointsEarned} Eco Points.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {status !== 'success' ? (
          <button 
            className="btn-primary" 
            onClick={handleValidate}
            disabled={status === 'loading' || code.length === 0}
          >
            {status === 'loading' ? <Loader className="animate-spin" /> : 'Validate & Claim Reward'}
          </button>
        ) : (
          <button className="btn-primary" onClick={() => setStatus('idle')} style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            Claim Another Code
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CodeEntry;
