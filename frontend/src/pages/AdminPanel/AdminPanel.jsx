import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './AdminPanel.css';
import MyMessagesModal from '../../components/MyMessagesModal';
import '../../components/MyMessagesModal.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const getMediaUrl = (filePath) => {
  if (!filePath) return '';
  // Extract the filename from the path (works for both / and \\)
  const parts = filePath.split(/[/\\]/);
  const filename = parts[parts.length - 1];
  return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
};

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    totalInquiries: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  const token = localStorage.getItem('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch data for each tab
  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardStats();
    if (activeTab === 'properties') fetchProperties();
    if (activeTab === 'inquiries') fetchInquiries();
    if (activeTab === 'testimonials') fetchTestimonials();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'contact') fetchContactMessages();
  }, [activeTab, user]);

  // Fetch all properties
  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${API_BASE}/properties`;
      if (user && user.role === 'admin') {
        url = `${API_BASE}/properties/all`;
      }
      const res = await fetch(url, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch properties');
      setProperties(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Approve property
  const approveProperty = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/${id}/approve`, {
        method: 'PUT',
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error('Failed to approve property');
      setProperties((prev) => prev.map(p => p._id === id ? { ...p, status: 'active' } : p));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Reject property
  const rejectProperty = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/${id}/reject`, {
        method: 'PUT',
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error('Failed to reject property');
      setProperties((prev) => prev.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch all inquiries
  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch inquiries');
      setInquiries(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch testimonials');
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Delete testimonial
  const deleteTestimonial = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      setTestimonials((prev) => prev.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch dashboard stats (now from backend)
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/admin/stats`, { headers: { ...authHeaders } });
      const stats = await res.json();
      if (!res.ok) throw new Error(stats.message || 'Failed to fetch dashboard stats');
      setDashboardStats(stats);
      // Build recent activities (unchanged)
      const activities = [];
      users.slice(-5).forEach(u => activities.push({
        type: 'user',
        action: 'New user registered',
        user: u.name,
        time: u.createdAt
      }));
      properties.slice(-5).forEach(p => activities.push({
        type: 'property',
        action: p.status === 'pending' ? 'Property added (pending)' : (p.status === 'active' ? 'Property approved' : 'Property rejected'),
        user: p.ownerName || p.owner || '-',
        time: p.createdAt
      }));
      inquiries.slice(-5).forEach(i => activities.push({
        type: 'inquiry',
        action: 'New inquiry received',
        user: i.name,
        time: i.createdAt
      }));
      // Sort by time descending, take 8 most recent
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivities(activities.slice(0, 8));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch contact messages
  const fetchContactMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries/contact`, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch contact messages');
      setContactMessages(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const stats = {
    totalUsers: 1250,
    totalProperties: 456,
    pendingApprovals: 23,
    totalInquiries: 89,
    activeBrokers: 45,
    monthlyRevenue: '₹2,45,000'
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-info">
            <h3>Total Properties</h3>
            <p className="stat-number">{dashboardStats.totalProperties}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p className="stat-number">{dashboardStats.approvedProperties}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">{dashboardStats.pendingProperties}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p className="stat-number">{dashboardStats.rejectedProperties}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{dashboardStats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-info">
            <h3>New Users (This Month)</h3>
            <p className="stat-number">{dashboardStats.newUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>Total Inquiries</h3>
            <p className="stat-number">{dashboardStats.totalInquiries}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-info">
            <h3>New Inquiries (This Month)</h3>
            <p className="stat-number">{dashboardStats.newInquiries}</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activities-list">
          {recentActivities.length === 0 && <div>No recent activities.</div>}
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'property' && '🏠'}
                {activity.type === 'user' && '👤'}
                {activity.type === 'inquiry' && '📞'}
              </div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-user">by {activity.user}</p>
              </div>
              <div className="activity-time">{new Date(activity.time).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => setActiveTab('users')}>
            <div className="action-icon">👥</div>
            <h4>Manage Users</h4>
            <p>View and manage all users</p>
          </button>
          <button className="action-card" onClick={() => setActiveTab('properties')}>
            <div className="action-icon">🏠</div>
            <h4>Manage Properties</h4>
            <p>Approve and manage properties</p>
          </button>
          <button className="action-card" onClick={() => setActiveTab('inquiries')}>
            <div className="action-icon">📞</div>
            <h4>Manage Inquiries</h4>
            <p>View and respond to inquiries</p>
          </button>
          <button className="action-card" onClick={() => setActiveTab('testimonials')}>
            <div className="action-icon">💬</div>
            <h4>Manage Testimonials</h4>
            <p>Approve and manage testimonials</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-content">
      <div className="content-header">
        <h2>User Management</h2>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className="status active">{user.isVerified ? 'Active' : 'Unverified'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Replace static tables with dynamic data for properties, inquiries, testimonials

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  // Bulk select handlers
  const handleSelectProperty = (id) => {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p._id));
    }
  };
  // Bulk Approve
  const handleBulkApprove = async () => {
    if (selectedProperties.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/bulk-approve`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProperties })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bulk approve failed');
      setProperties((prev) => prev.map(p => selectedProperties.includes(p._id) ? { ...p, approvalStatus: 'approved' } : p));
      setSelectedProperties([]);
      alert('Selected properties approved!');
    } catch (err) {
      setError(err.message);
      alert('Bulk approve failed: ' + err.message);
    }
    setLoading(false);
  };
  // Bulk Reject
  const handleBulkReject = async () => {
    if (selectedProperties.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/bulk-reject`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProperties })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bulk reject failed');
      setProperties((prev) => prev.map(p => selectedProperties.includes(p._id) ? { ...p, approvalStatus: 'rejected' } : p));
      setSelectedProperties([]);
      alert('Selected properties rejected!');
    } catch (err) {
      setError(err.message);
      alert('Bulk reject failed: ' + err.message);
    }
    setLoading(false);
  };
  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    if (!window.confirm('Are you sure you want to delete the selected properties? This cannot be undone.')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/bulk-delete`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProperties })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bulk delete failed');
      setProperties((prev) => prev.filter(p => !selectedProperties.includes(p._id)));
      setSelectedProperties([]);
      alert('Selected properties deleted!');
    } catch (err) {
      setError(err.message);
      alert('Bulk delete failed: ' + err.message);
    }
    setLoading(false);
  };
  // Single Delete
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setProperties((prev) => prev.filter(p => p._id !== id));
      setSelectedProperties((prev) => prev.filter(pid => pid !== id));
      alert('Property deleted!');
    } catch (err) {
      setError(err.message);
      alert('Delete failed: ' + err.message);
    }
    setLoading(false);
  };

  const renderProperties = () => (
    <div className="properties-content">
      <div className="content-header">
        <h2>Property Management</h2>
      </div>
      <div className="bulk-actions-row">
        <button className="btn-small btn-approve" onClick={handleBulkApprove} disabled={selectedProperties.length === 0}>
          Approve Selected
        </button>
        <button className="btn-small btn-reject" onClick={handleBulkReject} disabled={selectedProperties.length === 0}>
          Reject Selected
        </button>
        <button className="btn-small btn-delete" onClick={handleBulkDelete} disabled={selectedProperties.length === 0}>
          Delete Selected
        </button>
        <span style={{ marginLeft: 12, color: '#636e72', fontSize: '0.98rem' }}>
          {selectedProperties.length} selected
        </span>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="properties-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedProperties.length === properties.length && properties.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Phone</th>
              <th>WhatsApp</th>
              <th>Area</th>
              <th>Unit</th>
              <th>Address</th>
              <th>Status</th>
              <th>Images</th>
              <th>Video</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property._id)}
                    onChange={() => handleSelectProperty(property._id)}
                  />
                </td>
                <td>{property.name}</td>
                <td>{property.phone}</td>
                <td>{property.whatsapp}</td>
                <td>{property.area}</td>
                <td>{property.areaUnit}</td>
                <td>{property.address}</td>
                <td><span className={`status ${property.approvalStatus}`}>{property.approvalStatus}</span></td>
                <td>
                  {property.images && property.images.length > 0 ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {property.images.map((img, idx) => (
                        <img key={idx} src={getMediaUrl(img)} alt="property" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ))}
                    </div>
                  ) : 'No images'}
                </td>
                <td>
                  {property.video ? (
                    <video width="80" height="40" controls>
                      <source src={getMediaUrl(property.video)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : 'No video'}
                </td>
                <td>
                  <button className="btn-small btn-view" onClick={() => openModal(property)}>View Details</button>
                  {property.approvalStatus === 'pending' && (
                    <>
                      <button className="btn-small btn-approve" onClick={() => approveProperty(property._id)}>Approve</button>
                      <button className="btn-small btn-reject" onClick={() => rejectProperty(property._id)}>Reject</button>
                    </>
                  )}
                  <button className="btn-small btn-delete" onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>Property Details</h2>
            <div><b>Name:</b> {selectedProperty.name}</div>
            <div><b>Phone:</b> {selectedProperty.phone}</div>
            <div><b>WhatsApp:</b> {selectedProperty.whatsapp}</div>
            <div><b>Address:</b> {selectedProperty.address}</div>
            <div><b>Area/Locality:</b> {selectedProperty.areaName}</div>
            <div><b>Postal Code:</b> {selectedProperty.postalCode}</div>
            <div><b>Location:</b> {selectedProperty.location}</div>
            <div><b>Area:</b> {selectedProperty.area} {selectedProperty.areaUnit}</div>
            <div><b>Bedrooms:</b> {selectedProperty.bedrooms}</div>
            <div><b>Bathrooms:</b> {selectedProperty.bathrooms}</div>
            <div><b>Property Type:</b> {selectedProperty.propertyType}</div>
            <div><b>Status:</b> {selectedProperty.status}</div>
            <div><b>Features:</b> {Array.isArray(selectedProperty.features) ? selectedProperty.features.join(', ') : selectedProperty.features}</div>
            <div><b>Title:</b> {selectedProperty.title}</div>
            <div><b>Description:</b> {selectedProperty.description}</div>
            <div><b>Images:</b></div>
            <div className="modal-images">
              {selectedProperty.images && selectedProperty.images.length > 0 ? (
                selectedProperty.images.map((img, idx) => (
                  <img key={idx} src={getMediaUrl(img)} alt="property" />
                ))
              ) : 'No images'}
            </div>
            <div className="modal-video">
              <b>Video:</b><br/>
              {selectedProperty.video ? (
                <video controls>
                  <source src={getMediaUrl(selectedProperty.video)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : 'No video'}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInquiries = () => (
    <div className="inquiries-content">
      <div className="content-header">
        <h2>Inquiry Management</h2>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="inquiries-table">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td>{inq.propertyTitle || inq.property || '-'}</td>
                <td>{inq.name}</td>
                <td>{inq.email}</td>
                <td>{inq.phone}</td>
                <td>{inq.message}</td>
                <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="testimonials-content">
      <div className="content-header">
        <h2>Testimonial Management</h2>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="testimonials-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{'⭐'.repeat(t.rating || 0)}</td>
                <td>{t.message}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-small btn-delete" onClick={() => deleteTestimonial(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries/contact/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setContactMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const filteredContactMessages = contactMessages.filter(msg => {
    const q = contactSearch.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q)) ||
      (msg.message && msg.message.toLowerCase().includes(q))
    );
  });

  const renderContactMessages = () => (
    <div className="inquiries-content">
      <div className="content-header">
        <h2>Contact Messages</h2>
      </div>
      <div className="search-row">
        <input
          type="text"
          placeholder="Search by name, email, subject, or message..."
          value={contactSearch}
          onChange={e => setContactSearch(e.target.value)}
          className="search-input"
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="inquiries-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContactMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.phone}</td>
                <td>{msg.subject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-small btn-delete" onClick={() => handleDeleteContactMessage(msg._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your real estate platform</p>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              🏠 Properties
            </button>
            <button 
              className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              📞 Inquiries
            </button>
            <button 
              className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
            >
              💬 Testimonials
            </button>
            <button 
              className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              ✉️ Contact
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'properties' && renderProperties()}
          {activeTab === 'inquiries' && renderInquiries()}
          {activeTab === 'testimonials' && renderTestimonials()}
          {activeTab === 'contact' && renderContactMessages()}
          {/* Floating message button for admin */}
          {user && user.role === 'admin' && (
            <>
              <button
                className="dashboard-message-btn"
                onClick={() => setShowMessages(true)}
                title="My Messages"
              >
                💬
              </button>
              <MyMessagesModal open={showMessages} onClose={() => setShowMessages(false)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;