import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import FavoriteButton from '../../components/FavoriteButton';
import '../../components/FavoriteButton.css';
import './Favorites.css';
import { useAuth } from '../../AuthContext';

const Favorites = () => {
  const { isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    fetchFavorites();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setFavorites(data.favorites);
      else setError(data.message || 'Failed to fetch favorites');
    } catch {
      setError('Failed to fetch favorites');
    }
    setLoading(false);
  };

  const handleToggleFavorite = (propertyId, nowFavorite) => {
    if (!nowFavorite) {
      setFavorites(favs => favs.filter(p => p._id !== propertyId));
    }
  };

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState icon="❌" message={error} />
      ) : favorites.length === 0 ? (
        <EmptyState icon="📭" message="You have not added any favorites yet." />
      ) : (
        <div className="favorites-list">
          {favorites.map(property => (
            <div className="property-card" key={property._id}>
              <img src={property.images && property.images[0] ? `http://localhost:5000/${property.images[0].replace(/\\/g, '/')}` : '/default-property.jpg'} alt={property.title || property.name} className="property-image" />
              <h3>{property.title || property.name}</h3>
              <p>{property.location}</p>
              <p><b>Price:</b> ₹{property.price?.toLocaleString()}</p>
              <FavoriteButton
                propertyId={property._id}
                isFavorite={true}
                onToggle={handleToggleFavorite}
              />
              <a href={`/properties/${property._id}`} className="details-btn">View Details</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 