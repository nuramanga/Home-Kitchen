import React from 'react';
import { ChevronRight } from 'lucide-react';
import './Banner.css';

const Banner = ({ title, description, image, link }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${image})` }}>
      <div className="banner-content">
        <h2 className="banner-title">{title}</h2>
        <p className="banner-description">{description}</p>
        <a href={link} className="banner-link">
          Исследовать
          <ChevronRight size={18} />
        </a>
      </div>
    </div>
  );
};

export default Banner;