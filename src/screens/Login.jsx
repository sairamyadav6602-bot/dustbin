import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const res = await login(email, password);
      if (!res.success) setError(res.error);
    } else {
      if (!name) return setError('Name is required.');
      const res = await signup(email, password, name);
      if (!res.success) setError(res.error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-container"
    >
      <div className="auth-logo">
        <Leaf size={40} />
      </div>
      <h2>{isLogin ? 'Welcome Back!' : 'Join the Eco Movement'}</h2>
      <p style={{ marginBottom: '24px' }}>
        {isLogin ? 'Sign in to claim your rewards.' : 'Create an account to start earning.'}
      </p>

      {error && <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Full Name" 
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input 
          type="email" 
          placeholder="Email Address" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
          {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
        </button>
      </form>

      <div style={{ marginTop: '24px' }}>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
