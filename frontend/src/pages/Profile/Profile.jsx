import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch user info from localStorage or backend
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        // Try to get from localStorage first
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setProfile({ name: user.name, email: user.email, phone: user.phone || '' });
        } else {
          // Fallback: fetch from backend (if needed)
          const res = await fetch('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (res.ok) setProfile({ name: data.name, email: data.email, phone: data.phone || '' });
        }
      } catch {
        setError('Failed to load profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profile.name, phone: profile.phone, password: password || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setSuccess('Profile updated successfully!');
      setPassword('');
      // Optionally update localStorage
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" value={profile.email} disabled />
          <label>Phone</label>
          <input name="phone" value={profile.phone} onChange={handleChange} />
          <label>New Password</label>
          <input name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Leave blank to keep current" />
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          {success && <div className="form-success">{success}</div>}
          {error && <div className="form-error">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default Profile; 