import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__brand">
        {/* Remove broken logo image, use text only */}
        <span className="footer__tagline">Your Trusted Property Partner</span>
      </div>
      <div className="footer__links">
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="footer__contact">
        <p>Email: pathakestatess@gmail.com</p>
        <p>Phone: +91-9876543210</p>
        <p>Address: Mumbai, India</p>
      </div>
      <div className="footer__social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>
    <div className="footer__bottom">
      <span>&copy; {new Date().getFullYear()} Pathak Estates. All rights reserved.</span>
      <div className="footer__legal">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-service">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

export default Footer; 