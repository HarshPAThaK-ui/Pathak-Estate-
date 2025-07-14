import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PropertyDetails.css';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import FavoriteButton from '../../components/FavoriteButton';
import '../../components/FavoriteButton.css';
import { useAuth } from '../../AuthContext';
import ChatModal from '../../components/ChatModal';
import '../../components/ChatModal.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryError, setInquiryError] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareMsg, setShareMsg] = useState('');
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState('');
  const { isLoggedIn, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch property');
        } else {
          setProperty(data);
        }
      } catch {
        setError('Something went wrong.');
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!property) return;
    // Fetch similar properties
    const fetchSimilar = async () => {
      setSimilarLoading(true);
      setSimilarError('');
      try {
        const minArea = Math.floor(property.area * 0.8);
        const maxArea = Math.ceil(property.area * 1.2);
        const minPrice = Math.floor(property.price * 0.8);
        const maxPrice = Math.ceil(property.price * 1.2);
        const params = new URLSearchParams({
          propertyType: property.propertyType,
          minArea,
          maxArea,
          minPrice,
          maxPrice
        });
        const res = await fetch(`http://localhost:5000/api/properties?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch similar properties');
        // Exclude current property and limit to 4
        setSimilar(data.filter(p => p._id !== property._id).slice(0, 4));
      } catch (err) {
        setSimilarError(err.message || 'Failed to fetch similar properties');
      }
      setSimilarLoading(false);
    };
    fetchSimilar();
  }, [property]);

  useEffect(() => {
    const fetchFavorite = async () => {
      if (!isLoggedIn || !id) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.favorites) {
          setIsFavorite(data.favorites.some(f => f._id === id));
        }
      } catch {}
    };
    fetchFavorite();
  }, [isLoggedIn, id]);

  const handleInquiryChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryMsg('');
    setInquiryError('');
    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, propertyId: id })
      });
      const data = await res.json();
      if (!res.ok) {
        setInquiryError(data.message || 'Failed to send inquiry');
      } else {
        setInquiryMsg('Inquiry sent to broker!');
        setInquiry({ name: '', email: '', phone: '', message: '' });
      }
    } catch {
      setInquiryError('Something went wrong.');
    }
    setInquiryLoading(false);
  };

  // Lightbox handlers
  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const gotoNext = useCallback(() => {
    if (!property?.images) return;
    setLightboxIndex((i) => (i + 1) % property.images.length);
  }, [property]);
  const gotoPrev = useCallback(() => {
    if (!property?.images) return;
    setLightboxIndex((i) => (i - 1 + property.images.length) % property.images.length);
  }, [property]);
  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') gotoNext();
      if (e.key === 'ArrowLeft') gotoPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, gotoNext, gotoPrev]);

  const shareUrl = window.location.href;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 1500);
    } catch {
      setShareMsg('Failed to copy');
      setTimeout(() => setShareMsg(''), 1500);
    }
  };
  const handleShare = (type) => {
    let url = '';
    if (type === 'whatsapp') url = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    if (type === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener');
  };

  // Media URL helper
  const getMediaUrl = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split(/[/\\]/);
    const filename = parts[parts.length - 1];
    return `http://localhost:5000/uploads/${filename}`;
  };

  return (
    <div className="property-details-page">
      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState icon="❌" message={error} />
      ) : property ? (
        <div className="property-details-card">
          <div className="property-gallery">
            {property.images && property.images.length > 0 ? (
              <>
                <div className="gallery-thumbnails">
                  {property.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getMediaUrl(img)}
                      alt={property.title}
                      className="gallery-thumb"
                      onClick={() => openLightbox(idx)}
                    />
                  ))}
                </div>
                {lightboxOpen && (
                  <div className="lightbox-modal" onClick={closeLightbox}>
                    <span className="lightbox-close" onClick={closeLightbox}>&times;</span>
                    <img
                      src={getMediaUrl(property.images[lightboxIndex])}
                      alt={property.title}
                      className="lightbox-image"
                      onClick={e => e.stopPropagation()}
                    />
                    {property.images.length > 1 && (
                      <>
                        <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); gotoPrev(); }}>&#8592;</button>
                        <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); gotoNext(); }}>&#8594;</button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">No images available</div>
            )}
          </div>
          {property.video && (
            <div className="property-video-player">
              <video controls width="100%" style={{ borderRadius: '8px', marginTop: '1rem', background: '#000' }} poster={property.images && property.images[0] ? getMediaUrl(property.images[0]) : undefined}>
                <source src={getMediaUrl(property.video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className="property-info">
            <div className="property-info-header">
              <h2>{property.title || property.name}</h2>
              {isLoggedIn && (
                <FavoriteButton
                  propertyId={property._id}
                  isFavorite={isFavorite}
                  onToggle={(_, nowFavorite) => setIsFavorite(nowFavorite)}
                />
              )}
            </div>
            <p><b>Location:</b> {property.location}</p>
            <p><b>Status:</b> {property.status}</p>
            <p><b>Price:</b> ₹{property.price}</p>
            <p><b>Description:</b> {property.description}</p>
            {property.features && property.features.length > 0 && (
              <p><b>Features:</b> {Array.isArray(property.features) ? property.features.join(', ') : property.features}</p>
            )}
            {isLoggedIn && user && user.role !== 'admin' && (
              <button className="chat-btn" onClick={() => setShowChat(true)}>
                💬 Message Broker
              </button>
            )}
          </div>
          <ChatModal
            open={showChat}
            onClose={() => setShowChat(false)}
            propertyId={property._id}
            broker={property.broker}
            userId={user?._id}
            userRole={user?.role}
          />
        </div>
      ) : (
        <EmptyState icon="📭" message="Property not found." />
      )}
      <div className="contact-broker-note">For full information, contact broker.</div>
      <div className="inquiry-section">
        <h3>Contact Broker</h3>
        <form className="inquiry-form" onSubmit={handleInquirySubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={inquiry.name}
            onChange={handleInquiryChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={inquiry.email}
            onChange={handleInquiryChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone"
            value={inquiry.phone}
            onChange={handleInquiryChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            value={inquiry.message}
            onChange={handleInquiryChange}
          />
          <button type="submit" disabled={inquiryLoading}>
            {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
          </button>
          {inquiryMsg && <div className="form-success">{inquiryMsg}</div>}
          {inquiryError && <div className="form-error">{inquiryError}</div>}
        </form>
      </div>
      <div className="similar-properties-section">
        <h3>Similar Properties</h3>
        {similarLoading && <div>Loading...</div>}
        {similarError && <div className="form-error">{similarError}</div>}
        {!similarLoading && !similarError && similar.length === 0 && <div>No similar properties found.</div>}
        <div className="similar-properties-list">
          {similar.map((p) => (
            <div className="similar-property-card" key={p._id}>
              <img
                src={p.images && p.images[0] ? getMediaUrl(p.images[0]) : ''}
                alt={p.title}
                className="similar-property-image"
              />
              <h4>{p.title}</h4>
              <p>{p.location}</p>
              <p>₹{p.price}</p>
              <Link to={`/properties/${p._id}`} className="details-btn">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 