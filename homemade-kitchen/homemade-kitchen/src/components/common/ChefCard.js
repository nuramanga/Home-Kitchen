import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import './ChefCard.css';

const ChefCard = ({ chef, distance, onClick }) => {
  return (
    <div className="chef-card" onClick={onClick}>
      <div className="chef-avatar">
        <img src={chef.avatar} alt={chef.name} />
      </div>
      <div className="chef-info">
        <h3 className="chef-name">{chef.name}</h3>
        <p className="chef-cuisine">{chef.cuisine}</p>
        
        <div className="chef-stats">
          <div className="chef-stat">
            <Star size={14} className="stat-icon" />
            <span>{chef.rating}</span>
          </div>
          
          {distance && (
            <div className="chef-stat">
              <MapPin size={14} className="stat-icon" />
              <span>{distance.toFixed(1)} км</span>
            </div>
          )}
          
          <div className="chef-stat">
            <Clock size={14} className="stat-icon" />
            <span>{chef.deliveryTime} мин</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefCard;