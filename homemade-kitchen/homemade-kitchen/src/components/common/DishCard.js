import React from 'react';
import { Star } from 'lucide-react';
import './DishCard.css';

const DishCard = ({ dish, onClick }) => {
  return (
    <div className="dish-card" onClick={onClick}>
      <div className="dish-image">
        <img src={dish.image} alt={dish.name} />
      </div>
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-chef">{dish.chef ? dish.chef.name : ''}</p>
        
        <div className="dish-footer">
          <div className="dish-rating">
            <Star size={14} className="rating-icon" />
            <span>{dish.rating}</span>
          </div>
          <div className="dish-price">{dish.price} ₽</div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;