import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialEmail = params.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Verification failed');
      } else {
        setMessage('Email verified! You can now log in.');
      }
    } catch {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="verify-email-page">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit} className="verify-email-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <div className="form-success">{message}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default VerifyEmail; 