import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Properties.css';

const initialFilters = {
  keywords: '',
  propertyType: [], // Will become multi-select
  status: '',
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  areaUnit: '',
  bedrooms: '',
  bathrooms: '',
  location: [], // Will become multi-select
  postalCode: '',
  areaName: '',
  sort: 'newest', // Add sort field
};

// Static list of major cities in Uttar Pradesh
const upCities = [
  "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

// Multi-select for propertyType
const propertyTypes = [
  "apartment", "house", "villa", "plot", "commercial", "other"
];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnim, setFilterAnim] = useState('');

  // Animation logic for filter form
  useEffect(() => {
    if (showFilters) {
      setFilterAnim('filter-form-animated filter-form-animated--enter');
    } else if (filterAnim) {
      setFilterAnim('filter-form-animated filter-form-animated--exit');
      const timeout = setTimeout(() => setFilterAnim(''), 350);
      return () => clearTimeout(timeout);
    }
  }, [showFilters]);

  const fetchProperties = async (appliedFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => params.append(key, v));
        } else if (value) {
          params.append(key, value);
        }
      });
      const url = `http://localhost:5000/api/properties${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
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

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Autocomplete for location (city)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, location: value }));
    if (value.length > 0) {
      const matches = upCities.filter(city => city.toLowerCase().startsWith(value.toLowerCase()));
      setLocationSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (city) => {
    setFilters((prev) => ({ ...prev, location: city }));
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  const handlePropertyTypeChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const arr = prev.propertyType || [];
      if (checked) {
        return { ...prev, propertyType: [...arr, value] };
      } else {
        return { ...prev, propertyType: arr.filter((v) => v !== value) };
      }
    });
  };

  // Multi-select for location (UP cities)
  const handleLocationCheckbox = (city) => {
    setFilters((prev) => {
      const arr = prev.location || [];
      if (arr.includes(city)) {
        return { ...prev, location: arr.filter((c) => c !== city) };
      } else {
        return { ...prev, location: [...arr, city] };
      }
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchProperties(initialFilters);
  };

  const getMediaUrl = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split(/[/\\]/);
    const filename = parts[parts.length - 1];
    return `http://localhost:5000/uploads/${filename}`;
  };

  return (
    <div className="properties-page">
      <h2>Available Properties</h2>
      <button
        className="toggle-filters-btn"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
      >
        <span className="filter-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M5 10H15M8 15H12" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {(filterAnim || showFilters) && (
        <form className={`property-filter-form ${filterAnim}`} onSubmit={handleFilterSubmit} autoComplete="off">
          <input
            type="text"
            name="keywords"
            placeholder="Search keywords, location, etc."
            value={filters.keywords}
            onChange={handleInputChange}
          />
          <div className="multi-select-group">
            <label>Property Type:</label>
            <div className="multi-checkboxes">
              {propertyTypes.map((type) => (
                <label key={type} className="multi-checkbox-item">
                  <input
                    type="checkbox"
                    value={type}
                    checked={filters.propertyType.includes(type)}
                    onChange={handlePropertyTypeChange}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <select name="status" value={filters.status} onChange={handleInputChange}>
            <option value="">For Sale or Rent</option>
            <option value="for sale">For Sale</option>
            <option value="for rent">For Rent</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="minArea"
            placeholder="Min Area"
            value={filters.minArea}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="maxArea"
            placeholder="Max Area"
            value={filters.maxArea}
            onChange={handleInputChange}
          />
          <select name="areaUnit" value={filters.areaUnit} onChange={handleInputChange}>
            <option value="">Area Unit</option>
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
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            min="0"
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={filters.bathrooms}
            onChange={handleInputChange}
            min="0"
          />
          <div className="multi-select-group" style={{ position: 'relative', minWidth: 180 }}>
            <label>Location (UP cities):</label>
            <div
              className="multi-select-dropdown"
              tabIndex={0}
              onClick={() => setShowLocationDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowLocationDropdown(false), 150)}
              style={{ cursor: 'pointer', background: '#fff', border: '1px solid #dfe6e9', borderRadius: 6, padding: '0.5rem 0.8rem', minHeight: 38 }}
            >
              {filters.location.length > 0 ? filters.location.join(', ') : 'Select cities'}
              <span style={{ float: 'right', fontSize: 12, color: '#888' }}>▼</span>
              {showLocationDropdown && (
                <div className="autocomplete-dropdown" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {upCities.map(city => (
                    <label key={city} className="autocomplete-item" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={filters.location.includes(city)}
                        onChange={() => handleLocationCheckbox(city)}
                        style={{ marginRight: 8 }}
                      />
                      {city}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <input
            type="text"
            name="areaName"
            placeholder="Area/Locality Name"
            value={filters.areaName}
            onChange={handleInputChange}
          />
          <select name="sort" value={filters.sort} onChange={handleInputChange} style={{ minWidth: 160 }}>
            <option value="newest">Sort by: Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="areaLow">Area: Low to High</option>
            <option value="areaHigh">Area: High to Low</option>
          </select>
          <div className="filter-btn-group">
            <button type="submit" className="apply-btn">Apply Filters & Sort</button>
            <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </form>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && properties.length === 0 && (
        <div>No properties found.</div>
      )}
      <div className="properties-list">
        {properties.map((property) => (
          <div className="property-card" key={property._id}>
            {property.images && property.images[0] && (
              <img
                src={getMediaUrl(property.images[0])}
                alt={property.title}
                className="property-image"
              />
            )}
            <h3>{property.title}</h3>
            <p>{property.location}</p>
            <p>Status: <b>{property.status}</b></p>
            <p>Price: ₹{property.price}</p>
            <Link to={`/properties/${property._id}`} className="details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties; 