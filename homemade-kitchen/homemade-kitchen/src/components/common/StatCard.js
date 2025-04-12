import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'stat-blue';
      case 'green': return 'stat-green';
      case 'orange': return 'stat-orange';
      case 'yellow': return 'stat-yellow';
      default: return 'stat-blue';
    }
  };
  
  return (
    <div className="stat-card">
      <div className={`stat-icon-container ${getColorClass()}`}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;