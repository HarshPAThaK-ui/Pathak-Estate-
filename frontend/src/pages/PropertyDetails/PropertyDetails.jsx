import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PropertyDetails.css';

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

  if (loading) return <div className="property-details-page">Loading...</div>;
  if (error) return <div className="property-details-page form-error">{error}</div>;
  if (!property) return null;

  return (
    <div className="property-details-page">
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
          <div className="property-share-row">
            <h2>{property.title}</h2>
            <div className="property-share-btns">
              <button className="share-btn" title="Copy Link" onClick={handleCopyLink}>
                <svg width="22" height="22" fill="none" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 1 7 7l-1.5 1.5a5 5 0 0 1-7-7"/><path d="M14 11a5 5 0 0 0-7-7L5.5 5.5a5 5 0 0 0 7 7"/></svg>
              </button>
              <button className="share-btn" title="Share on WhatsApp" onClick={() => handleShare('whatsapp')}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#25D366" d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Z"/><path fill="#fff" d="M17.47 15.37c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.13-.13.29-.34.43-.52.14-.18.18-.32.27-.54.09-.23.05-.41-.02-.55-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.73.09.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.18.16-1.28-.07-.1-.25-.16-.52-.3Z"/></svg>
              </button>
              <button className="share-btn" title="Share on Facebook" onClick={() => handleShare('facebook')}>
                <svg width="22" height="22" fill="#1877F3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1877F3"/><path fill="#fff" d="M15.12 8.5h-1.36c-.18 0-.38.25-.38.54v1.13h1.74l-.23 1.8h-1.51V18h-2.01v-6.03h-1.01v-1.8h1.01v-1.13c0-1.13.8-2.04 1.89-2.04h1.36v1.53Z"/></svg>
              </button>
            </div>
            {shareMsg && <span className="share-msg">{shareMsg}</span>}
          </div>
          <p><b>Location:</b> {property.location}</p>
          <p><b>Status:</b> {property.status}</p>
          <p><b>Price:</b> ₹{property.price}</p>
          <p><b>Description:</b> {property.description}</p>
          {property.features && property.features.length > 0 && (
            <p><b>Features:</b> {Array.isArray(property.features) ? property.features.join(', ') : property.features}</p>
          )}
        </div>
      </div>
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