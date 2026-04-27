import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, QrCode, Gift, Trophy } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/rewards', icon: <Gift size={24} />, label: 'Rewards' },
    { path: '/scan', icon: <QrCode size={28} />, label: '', isScan: true },
    { path: '/leaderboard', icon: <Trophy size={24} />, label: 'Rank' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={index} 
            to={item.path} 
            className={`nav-item ${isActive && !item.isScan ? 'active' : ''} ${item.isScan ? 'scan-btn' : ''}`}
          >
            {item.icon}
            {item.label && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
