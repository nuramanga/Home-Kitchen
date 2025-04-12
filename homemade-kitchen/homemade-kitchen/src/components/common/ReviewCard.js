import React from 'react';
import { Star, Calendar } from 'lucide-react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-name">{review.customer.name}</div>
          <div className="review-date">
            <Calendar size={14} className="date-icon" />
            <span>{review.createdAt}</span>
          </div>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              size={16}
              className={`rating-star ${i < review.rating ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <div className="review-content">
        {review.comment}
      </div>
      
      {review.dishes && review.dishes.length > 0 && (
        <div className="review-dishes">
          <span className="dishes-label">Заказанные блюда:</span>
          <span className="dishes-list">{review.dishes.join(', ')}</span>
        </div>
      )}
      
      {review.photos && review.photos.length > 0 && (
        <div className="review-photos">
          {review.photos.map((photo, index) => (
            <div key={index} className="photo-thumbnail">
              <img src={photo} alt={`Фото блюда ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;