import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <img src="/logo192.png" alt="Pathak Estates" className="navbar__logo" />
        <span className="navbar__title">Pathak Estates</span>
      </div>
      <ul className="navbar__links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/properties" className={location.pathname === '/properties' ? 'active' : ''}>Properties</Link></li>
        {!isLoggedIn && (
          <>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </>
        )}
        {isLoggedIn && user && user.role === 'admin' && (
          <>
            <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin Panel</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
        {isLoggedIn && user && user.role !== 'admin' && (
          <>
            <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
            <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link></li>
            <li><Link to="/add-property" className={location.pathname === '/add-property' ? 'active' : ''}>Add Property</Link></li>
            <li><Link to="/my-properties" className={location.pathname === '/my-properties' ? 'active' : ''}>My Properties</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
        {!isLoggedIn && (
          <>
            <li><Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
            <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 