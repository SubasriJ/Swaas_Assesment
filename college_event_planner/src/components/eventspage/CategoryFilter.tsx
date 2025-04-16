// src/components/CategoryFilter.tsx
import React, { useState } from 'react';
import '../../styles/events/CategoryFilter.css';

interface CategoryFilterProps {
  onFilterChange: (selected: string[]) => void;
}

const categories = ['Academic', 'Cultural', 'Sports', 'Career', 'Club', 'Entertainment', 'Hobby', 'Wellness'];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange(updated);
  };

  return (
    <div className="category-filter">
      <h3>Filter Events by Category</h3>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategories.includes(category) ? 'active' : ''}`}
            onClick={() => handleCategoryToggle(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;