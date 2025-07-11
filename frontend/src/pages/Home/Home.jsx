import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container">
          <h1>Find Your Dream Property with Pathak Estates</h1>
          <p className="hero-subtitle">Your trusted partner for buying, selling, and renting properties in India</p>
          <div className="hero-actions">
            <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
            <Link to="/contact" className="btn btn-outline">Contact the Broker</Link>
          </div>
        </div>
      </section>

      <section className="home-features container">
        <h2>Why Choose Pathak Estates?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🏠</div>
            <h3>Extensive Listings</h3>
            <p>Discover a wide range of properties across major cities and localities.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👨‍💼</div>
            <h3>Personalized Service</h3>
            <p>Work directly with an experienced, dedicated broker for a seamless experience.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Enjoy safe transactions and privacy with our secure, modern platform.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Easy</h3>
            <p>Find, list, and manage properties quickly with our user-friendly tools.</p>
          </div>
        </div>
      </section>

      <section className="home-cta container">
        <h2>Ready to get started?</h2>
        <p>Contact us now to find your next home or list your property with Pathak Estates.</p>
        <Link to="/contact" className="btn btn-primary">Contact the Broker</Link>
      </section>
    </div>
  );
};

export default Home; 