import React, { useState } from 'react';
import { useToast } from '../AuthContext';

const FavoriteButton = ({ propertyId, isFavorite, onToggle, disabled }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:5000/api/auth/favorites/${propertyId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update favorites');
      onToggle && onToggle(propertyId, !isFavorite);
      showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update favorites', 'error');
    }
    setLoading(false);
  };

  return (
    <button
      className={`favorite-btn${isFavorite ? ' favorite-btn--active' : ''}`}
      onClick={handleClick}
      disabled={loading || disabled}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      type="button"
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
};

export default FavoriteButton; 