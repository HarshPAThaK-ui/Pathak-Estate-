import React, { useEffect, useState } from 'react';
import './MyProperties.css';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

const initialForm = {
  title: '', description: '', price: '', location: '', area: '', areaUnit: '', bedrooms: '', bathrooms: '', propertyType: '', phone: '', whatsapp: '', address: '', postalCode: '', areaName: '', status: '', features: '', images: [], video: ''
};

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideo, setDeletedVideo] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch properties');
        } else {
          setProperties(data);
        }
      } catch {
        setError('Something went wrong.');
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const openEdit = (property) => {
    setEditForm({ ...initialForm, ...property });
    setEditId(property._id);
    setEditModal(true);
    setEditError('');
    setDeletedImages([]);
    setDeletedVideo(false);
    setNewImages([]);
    setNewVideo(null);
  };
  const closeEdit = () => {
    setEditModal(false);
    setEditId(null);
    setEditForm(initialForm);
    setEditError('');
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageDelete = (img) => {
    setDeletedImages((prev) => [...prev, img]);
    setEditForm((prev) => ({ ...prev, images: prev.images.filter(i => i !== img) }));
  };
  const handleVideoDelete = () => {
    setDeletedVideo(true);
    setEditForm((prev) => ({ ...prev, video: '' }));
  };
  const handleNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };
  const handleNewVideo = (e) => {
    setNewVideo(e.target.files[0]);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === 'images' || key === 'video') return;
        formData.append(key, value);
      });
      // Existing images minus deleted
      formData.append('existingImages', JSON.stringify(editForm.images));
      formData.append('deletedImages', JSON.stringify(deletedImages));
      formData.append('deletedVideo', deletedVideo);
      newImages.forEach(img => formData.append('newImages', img));
      if (newVideo) formData.append('newVideo', newVideo);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/${editId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update property');
      setProperties((prev) => prev.map(p => p._id === editId ? data : p));
      closeEdit();
    } catch (err) {
      setEditError(err.message || 'Failed to update property');
    }
    setEditLoading(false);
  };
  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };
  const handleDelete = async () => {
    setShowDeleteDialog(false);
    if (!pendingDeleteId) return;
    setDeleteId(pendingDeleteId);
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.message || 'Failed to delete property');
      } else {
        setProperties(properties.filter(p => p._id !== pendingDeleteId));
      }
    } catch {
      setDeleteError('Something went wrong.');
    }
    setDeleteLoading(false);
    setPendingDeleteId(null);
  };

  const statusColor = (status) => {
    if (status === 'approved') return '#00b894';
    if (status === 'pending') return '#fdcb6e';
    if (status === 'rejected') return '#d63031';
    return '#b2bec3';
  };

  const getMediaUrl = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split(/[/\\]/);
    const filename = parts[parts.length - 1];
    return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
  };

  return (
    <div className="my-properties-page">
      <h2>My Properties</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState icon="❌" message={error} />
      ) : properties.length === 0 ? (
        <EmptyState icon="📭" message="You have not added any properties yet." />
      ) : (
        <div className="properties-list">
          {properties.map((property) => (
            <div className="property-card" key={property._id}>
              {property.images && property.images[0] && (
                <img
                  src={getMediaUrl(property.images[0])}
                  alt={property.title}
                  className="property-card-image"
                />
              )}
              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <p>
                Status: <span className="status-badge" style={{ background: statusColor(property.approvalStatus) }}>{property.approvalStatus}</span>
              </p>
              <p>Price: ₹{property.price}</p>
              <p>{property.description}</p>
              <div className="property-actions">
                <button className="edit-btn" onClick={() => openEdit(property)}>Edit</button>
                <button className="delete-btn" onClick={() => confirmDelete(property._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editModal && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Property</h3>
            <form className="edit-property-form" onSubmit={handleEditSubmit} encType="multipart/form-data">
              <input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Title" />
              <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" />
              <input name="price" value={editForm.price} onChange={handleEditChange} placeholder="Price" type="number" />
              <input name="area" value={editForm.area} onChange={handleEditChange} placeholder="Area" type="number" />
              <input name="areaUnit" value={editForm.areaUnit} onChange={handleEditChange} placeholder="Area Unit" />
              <input name="bedrooms" value={editForm.bedrooms} onChange={handleEditChange} placeholder="Bedrooms" type="number" />
              <input name="bathrooms" value={editForm.bathrooms} onChange={handleEditChange} placeholder="Bathrooms" type="number" />
              <input name="propertyType" value={editForm.propertyType} onChange={handleEditChange} placeholder="Property Type" />
              <input name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Phone" />
              <input name="whatsapp" value={editForm.whatsapp} onChange={handleEditChange} placeholder="WhatsApp" />
              <input name="address" value={editForm.address} onChange={handleEditChange} placeholder="Address" />
              <input name="postalCode" value={editForm.postalCode} onChange={handleEditChange} placeholder="Postal Code" />
              <input name="areaName" value={editForm.areaName} onChange={handleEditChange} placeholder="Area/Locality Name" />
              <input name="features" value={editForm.features} onChange={handleEditChange} placeholder="Features (comma separated)" />
              <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" />
              <label>Images</label>
              <div className="edit-images-list">
                {editForm.images && editForm.images.length > 0 ? editForm.images.map((img, idx) => (
                  <div className="edit-image-thumb" key={idx}>
                    <img src={getMediaUrl(img)} alt="Property" />
                    <button type="button" className="delete-img-btn" onClick={() => handleImageDelete(img)}>&times;</button>
                  </div>
                )) : <span>No images</span>}
              </div>
              <input type="file" multiple accept="image/*" onChange={handleNewImages} />
              <label>Video</label>
              {editForm.video && !deletedVideo ? (
                <div className="edit-video-preview">
                  <video src={getMediaUrl(editForm.video)} controls width="180" style={{ borderRadius: 6, background: '#000' }} />
                  <button type="button" className="delete-img-btn" onClick={handleVideoDelete}>&times;</button>
                </div>
              ) : <span>No video</span>}
              <input type="file" accept="video/*" onChange={handleNewVideo} />
              <div className="modal-actions">
                <button type="submit" className="edit-btn" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="delete-btn" onClick={closeEdit}>Cancel</button>
              </div>
              {editError && <div className="form-error">{editError}</div>}
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default MyProperties; 