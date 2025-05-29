
import React from 'react';
import { filterCategories } from '../config/filterConfig';
import CategoryFilter from './filters/CategoryFilter';

interface CategoryFiltersProps {
  selectedFilters: Record<string, string[]>;
  onFilterChange: (categoryId: string, optionId: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  selectedFilters, 
  onFilterChange 
}) => {
  return (
    <div className="space-y-4">
      {filterCategories.map((category) => (
        <CategoryFilter
          key={category.id}
          label={category.label}
          options={category.options}
          selectedOptions={selectedFilters[category.id] || []}
          onOptionChange={(optionId) => onFilterChange(category.id, optionId)}
        />
      ))}
    </div>
  );
};

export default CategoryFilters;
