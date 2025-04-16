// src/components/SearchEvents.tsx
import React, { useState } from 'react';
import '../../styles/events/SearchEvents.css';

interface SearchEventsProps {
  onSearch: (query: string) => void;
}

const SearchEvents: React.FC<SearchEventsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-events">
      <input
        type="text"
        placeholder="Search by title, description, or organizer..."
        value={query}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchEvents;