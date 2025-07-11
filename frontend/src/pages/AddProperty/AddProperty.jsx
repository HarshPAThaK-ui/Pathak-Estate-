import React, { useState } from 'react';
import './AddProperty.css';

const AddProperty = () => {
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    location: '',
    status: 'for sale',
    features: '',
    area: '',
    areaUnit: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    phone: '',
    whatsapp: '',
    address: '',
    postalCode: '',
    areaName: '',
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((img) => formData.append('images', img));
      if (video) formData.append('video', video);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to add property');
      } else {
        setMessage('Property submitted! Awaiting approval.');
        setForm({
          name: '',
          title: '',
          description: '',
          price: '',
          location: '',
          status: 'for sale',
          features: '',
          area: '',
          areaUnit: '',
          bedrooms: '',
          bathrooms: '',
          propertyType: '',
          phone: '',
          whatsapp: '',
          address: '',
          postalCode: '',
          areaName: '',
        });
        setImages([]);
        setVideo(null);
      }
    } catch {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="add-property-page">
      <h2>Add Property</h2>
      <form className="add-property-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title (optional)"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            name="area"
            placeholder="Area"
            value={form.area}
            onChange={handleChange}
            required
            style={{ flex: 2 }}
          />
          <select
            name="areaUnit"
            value={form.areaUnit}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          >
            <option value="">Select Unit</option>
            <option value="sqft">Sqft</option>
            <option value="sqm">Sqm</option>
            <option value="gaj">Gaj</option>
            <option value="bigha">Bigha</option>
            <option value="acre">Acre</option>
            <option value="hectare">Hectare</option>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
            <option value="other">Other</option>
          </select>
        </div>
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          required
        />
        <select name="propertyType" value={form.propertyType} onChange={handleChange} required>
          <option value="">Select Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
          <option value="other">Other</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="for sale">For Sale</option>
          <option value="for rent">For Rent</option>
        </select>
        <input
          type="text"
          name="features"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="areaName"
          placeholder="Area/Locality Name"
          value={form.areaName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          required
        />
        <label>
          Images:
          <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
        </label>
        <label>
          Video:
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Property'}
        </button>
        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default AddProperty; 