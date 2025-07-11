import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-hero">
        <div className="container">
          <h1>About Pathak Estates</h1>
          <p className="hero-subtitle">Your Trusted Partner in Real Estate Excellence</p>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded with a vision to transform the real estate experience, Pathak Estates has been 
              serving clients with integrity, professionalism, and dedication since our establishment. 
              We understand that buying, selling, or renting property is one of life's most significant 
              decisions, and we're committed to making that journey smooth and successful.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              To provide exceptional real estate services that exceed client expectations through 
              innovative solutions, transparent communication, and unwavering commitment to quality. 
              We strive to build lasting relationships based on trust, reliability, and results.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <h3>Integrity</h3>
                <p>We conduct business with honesty, transparency, and ethical practices in all our dealings.</p>
              </div>
              <div className="value-item">
                <h3>Excellence</h3>
                <p>We strive for excellence in every aspect of our service, from property selection to client support.</p>
              </div>
              <div className="value-item">
                <h3>Innovation</h3>
                <p>We embrace technology and innovative solutions to provide the best possible experience for our clients.</p>
              </div>
              <div className="value-item">
                <h3>Client Focus</h3>
                <p>Our clients are at the heart of everything we do, and their satisfaction is our top priority.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Why Choose Pathak Estates?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <h3>Extensive Property Portfolio</h3>
                <p>Access to a wide range of properties across different locations and price points.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <h3>Expert Brokers</h3>
                <p>Experienced and certified real estate professionals dedicated to your success.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>Secure Platform</h3>
                <p>Advanced security measures to protect your data and transactions.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <h3>Modern Technology</h3>
                <p>User-friendly platform with advanced features for seamless property management.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Team</h2>
            <p>
              Our team consists of experienced real estate professionals, certified brokers, and 
              technology experts who work together to provide you with the best possible service. 
              Each member brings unique expertise and a commitment to excellence that sets us apart 
              in the industry.
            </p>
          </div>

          <div className="about-section">
            <h2>Get Started Today</h2>
            <p>
              Ready to find your dream property or list your property with us? Join thousands of 
              satisfied clients who have chosen Pathak Estates for their real estate needs.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Browse Properties</button>
              <button className="btn btn-secondary">Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 