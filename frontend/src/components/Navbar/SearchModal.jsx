import React, { useState } from 'react';
import './SearchModal.css';

const SearchModal = ({ open, onClose, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  if (!open) return null;
  return (
    <div className="search-modal" onClick={onClose}>
      <form className="search-modal__content" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <input
          className="search-modal__input"
          type="text"
          placeholder="Search properties..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <button className="search-modal__btn" type="submit">Search</button>
        <button className="search-modal__close" type="button" onClick={onClose} aria-label="Close">×</button>
      </form>
    </div>
  );
};

export default SearchModal; 