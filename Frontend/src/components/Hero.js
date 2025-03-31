import React from 'react';
import './Hero.css';
import imageYoozak from '../images/image_yoozak.jpg';

const Hero = () => {
  return (
    <div className="hero" style={{ backgroundImage: `url(${imageYoozak})` }}>
      <div className="hero-content">
        <h1 className="hero-title">LA NOUVELLE COLLECTION</h1>
      </div>
    </div>
  );
};

export default Hero; 