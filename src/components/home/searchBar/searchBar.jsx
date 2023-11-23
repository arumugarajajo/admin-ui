// SearchBar.jsx
import React from 'react';

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <input type="text" placeholder="Search..." onChange={handleInputChange} />
  );
};

export default SearchBar;
