import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navbar.css';
import ConfirmDialog from '../ConfirmDialog';
import SearchModal from './SearchModal';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };
  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
    navigate('/login');
  };
  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (query) => {
    setShowSearchModal(false);
    navigate(`/properties?keywords=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        {/* Remove broken logo image, use text only */}
        <span className="navbar__title">Pathak Estates</span>
        <button className="navbar__hamburger" onClick={handleHamburgerClick} aria-label="Toggle navigation">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </div>
      <ul className={`navbar__links${menuOpen ? ' open' : ''}`} onClick={closeMenu}>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/properties" className={location.pathname === '/properties' ? 'active' : ''}>Properties</Link></li>
        <li>
          <button className="navbar__search-btn" onClick={() => setShowSearchModal(true)} aria-label="Search">
            🔍
          </button>
        </li>
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
              <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
            </li>
          </>
        )}
        {isLoggedIn && user && user.role !== 'admin' && (
          <>
            <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
            <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link></li>
            <li><Link to="/add-property" className={location.pathname === '/add-property' ? 'active' : ''}>Add Property</Link></li>
            <li><Link to="/my-properties" className={location.pathname === '/my-properties' ? 'active' : ''}>My Properties</Link></li>
            <li><Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favorites</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
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
      {/* Search modal will be rendered here */}
      {showSearchModal && (
        <SearchModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSearch={handleSearch}
        />
      )}
      <ConfirmDialog
        open={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText="Yes, Logout"
      />
    </nav>
  );
};

export default Navbar; 