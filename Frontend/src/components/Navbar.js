import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="#femme">FEMME</a>
        <a href="#homme">HOMME</a>
        <a href="#enfant">ENFANT</a>
        <a href="#accessoires">ACCESSOIRES</a>
      </div>
      <div className="nav-logo">
        <h1>YOOZAK</h1>
      </div>
      <div className="nav-actions">
        <a href="#recherche">RECHERCHE</a>
        <a href="#compte">COMPTE</a>
        <a href="#panier">PANIER</a>
      </div>
    </nav>
  );
};

export default Navbar; 