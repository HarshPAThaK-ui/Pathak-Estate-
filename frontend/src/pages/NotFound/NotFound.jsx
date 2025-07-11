import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="error-illustration">
          <div className="error-number">404</div>
          <div className="error-icon">🏠</div>
        </div>
        
        <div className="error-message">
          <h1>Page Not Found</h1>
          <p>
            Oops! It looks like the property you're looking for has been moved, 
            sold, or doesn't exist. Don't worry, we have plenty of other amazing 
            properties waiting for you!
          </p>
        </div>

        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
          <Link to="/properties" className="btn btn-secondary">
            🏘️ Browse Properties
          </Link>
          <Link to="/contact" className="btn btn-outline">
            📞 Contact Us
          </Link>
        </div>

        <div className="helpful-links">
          <h3>Popular Pages</h3>
          <div className="links-grid">
            <Link to="/properties" className="helpful-link">
              <div className="link-icon">🏘️</div>
              <div className="link-content">
                <h4>All Properties</h4>
                <p>Browse our complete property collection</p>
              </div>
            </Link>
            <Link to="/about" className="helpful-link">
              <div className="link-icon">ℹ️</div>
              <div className="link-content">
                <h4>About Us</h4>
                <p>Learn more about Pathak Estates</p>
              </div>
            </Link>
            <Link to="/contact" className="helpful-link">
              <div className="link-icon">📞</div>
              <div className="link-content">
                <h4>Contact</h4>
                <p>Get in touch with our team</p>
              </div>
            </Link>
            <Link to="/login" className="helpful-link">
              <div className="link-icon">🔐</div>
              <div className="link-content">
                <h4>Login</h4>
                <p>Access your account</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="search-suggestion">
          <h3>Can't find what you're looking for?</h3>
          <p>
            Try using our search feature or browse through our property categories 
            to find your perfect home.
          </p>
          <Link to="/properties" className="btn btn-primary">
            🔍 Search Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 