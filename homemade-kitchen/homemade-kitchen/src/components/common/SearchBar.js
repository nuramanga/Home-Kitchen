import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    diet: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Поиск блюд или поваров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-button">Найти</button>
        <button 
          type="button" 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          Фильтры
        </button>
      </form>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="category">Кухня:</label>
            <select 
              id="category" 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Все кухни</option>
              <option value="italian">Итальянская</option>
              <option value="asian">Азиатская</option>
              <option value="russian">Русская</option>
              <option value="european">Европейская</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="diet">Диета:</label>
            <select 
              id="diet" 
              name="diet" 
              value={filters.diet}
              onChange={handleFilterChange}
            >
              <option value="">Все типы</option>
              <option value="vegetarian">Вегетарианская</option>
              <option value="vegan">Веганская</option>
              <option value="gluten-free">Без глютена</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;