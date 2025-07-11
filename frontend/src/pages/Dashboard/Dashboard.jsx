import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/properties/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch properties');
        setStats({
          total: data.length,
          approved: data.filter(p => p.approvalStatus === 'approved').length,
          pending: data.filter(p => p.approvalStatus === 'pending').length,
          rejected: data.filter(p => p.approvalStatus === 'rejected').length,
        });
        setRecent(data.slice(-5).reverse());
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user.name || 'User'}!</h2>
      <div className="dashboard-shortcuts">
        <Link to="/add-property" className="dashboard-btn">Add Property</Link>
        <Link to="/my-properties" className="dashboard-btn">My Properties</Link>
        <Link to="/profile" className="dashboard-btn">Profile</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card total">
              <div className="stat-label">Total</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card approved">
              <div className="stat-label">Approved</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{stats.rejected}</div>
            </div>
          </div>
          <div className="dashboard-recent">
            <h3>Recent Properties</h3>
            {recent.length === 0 ? <div>No recent properties.</div> : (
              <div className="recent-list">
                {recent.map((p) => (
                  <div className="recent-card" key={p._id}>
                    <div className="recent-title">{p.title}</div>
                    <div className="recent-meta">{p.location} &middot; ₹{p.price} &middot; <span className={`status-badge ${p.approvalStatus}`}>{p.approvalStatus}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 