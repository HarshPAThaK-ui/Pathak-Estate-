import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-of-service">
      <div className="terms-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">Our terms and conditions for using Pathak Estates</p>
          <p className="last-updated">Last updated: January 2024</p>
        </div>
      </div>

      <div className="container">
        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Pathak Estates ("the Platform"), you accept and agree to be bound 
              by the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              Pathak Estates is a real estate platform that connects property buyers, sellers, and 
              brokers. Our services include:
            </p>
            <ul>
              <li>Property listings and search functionality</li>
              <li>Broker registration and management</li>
              <li>Property inquiry and communication tools</li>
              <li>User account management</li>
              <li>Real estate market information</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts</h2>
            <h3>Account Creation</h3>
            <p>
              To access certain features of the Platform, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3>Account Responsibilities</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>You may not transfer your account to another person</li>
              <li>We reserve the right to terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. User Conduct</h2>
            <p>You agree not to use the Platform to:</p>
            <ul>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Interfere with the proper functioning of the Platform</li>
              <li>Use automated systems to access the Platform</li>
              <li>Post content that is offensive, defamatory, or inappropriate</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Property Listings</h2>
            <h3>Listing Accuracy</h3>
            <p>
              All property listings must be accurate and truthful. You agree to:
            </p>
            <ul>
              <li>Provide accurate property information and pricing</li>
              <li>Use genuine, current photographs</li>
              <li>Update listings when properties are sold or rented</li>
              <li>Comply with all applicable real estate laws</li>
            </ul>

            <h3>Listing Moderation</h3>
            <p>
              We reserve the right to review, edit, or remove any property listings that violate 
              our terms or policies. We may also require additional verification for certain listings.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Broker Services</h2>
            <p>
              Brokers using our Platform must:
            </p>
            <ul>
              <li>Hold valid real estate licenses where required</li>
              <li>Comply with all applicable real estate regulations</li>
              <li>Provide professional and ethical services</li>
              <li>Maintain appropriate insurance coverage</li>
              <li>Respond to inquiries in a timely manner</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms of Service.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Intellectual Property</h2>
            <p>
              The Platform and its content, including but not limited to text, graphics, images, 
              logos, and software, are owned by Pathak Estates and are protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, or create derivative works without our express 
              written consent.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Disclaimers</h2>
            <p>
              The Platform is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul>
              <li>The accuracy of property information</li>
              <li>The availability of listed properties</li>
              <li>The quality of broker services</li>
              <li>Uninterrupted access to the Platform</li>
              <li>Freedom from errors or technical issues</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              Pathak Estates shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising from your use of the Platform.
            </p>
          </section>

          <section className="terms-section">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Pathak Estates from any claims, damages, 
              or expenses arising from your use of the Platform or violation of these terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also terminate your account at any time by contacting us.
            </p>
          </section>

          <section className="terms-section">
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the Platform.
            </p>
          </section>

          <section className="terms-section">
            <h2>14. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be resolved 
              in the courts of Mumbai, Maharashtra.
            </p>
          </section>

          <section className="terms-section">
            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@pathakestates.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Address:</strong> 123 Real Estate Avenue, Mumbai, Maharashtra 400001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 