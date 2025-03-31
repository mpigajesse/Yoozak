import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>À propos</h3>
          <ul>
            <li><a href="#histoire">Notre histoire</a></li>
            <li><a href="#equipe">Notre équipe</a></li>
            <li><a href="#carrieres">Carrières</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><a href="#livraison">Livraison</a></li>
            <li><a href="#retours">Retours</a></li>
            <li><a href="#paiement">Paiement</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#instagram">Instagram</a>
            <a href="#twitter">Twitter</a>
            <a href="#pinterest">Pinterest</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 YOOZAK. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer; 