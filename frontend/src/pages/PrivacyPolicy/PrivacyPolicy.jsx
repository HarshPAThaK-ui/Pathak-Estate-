import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="policy-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">How we protect and handle your information</p>
          <p className="last-updated">Last updated: January 2024</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              submit property listings, or contact us for support.
            </p>
            
            <h3>Personal Information</h3>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Property preferences and search criteria</li>
              <li>Communication history with our team</li>
              <li>Account credentials and profile information</li>
            </ul>

            <h3>Property Information</h3>
            <ul>
              <li>Property details, photos, and descriptions</li>
              <li>Location data and property specifications</li>
              <li>Pricing information and availability status</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our real estate platform</li>
              <li>Process property listings and inquiries</li>
              <li>Send you relevant property updates and notifications</li>
              <li>Improve our services and user experience</li>
              <li>Respond to your questions and support requests</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information in the following circumstances:
            </p>
            <ul>
              <li><strong>With your consent:</strong> When you explicitly authorize us to share your information</li>
              <li><strong>Service providers:</strong> With trusted partners who help us operate our platform</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting and infrastructure</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, and personalize content.
            </p>
            <h3>Types of Cookies We Use</h3>
            <ul>
              <li><strong>Essential cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing cookies:</strong> Deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Third-Party Services</h2>
            <p>
              Our platform may contain links to third-party websites or integrate with 
              third-party services. We are not responsible for the privacy practices 
              of these external services.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other 
              than your own. We ensure appropriate safeguards are in place to protect 
              your data during such transfers.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you 
              of any material changes by posting the new policy on our website and 
              updating the "Last updated" date.
            </p>
          </section>

          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@pathakestates.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Address:</strong> 123 Real Estate Avenue, Mumbai, Maharashtra 400001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 