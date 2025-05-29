
import React from 'react';
import IngredientSearch from '@/components/ingredients/IngredientSearch';

interface IngredientFiltersProps {
  onIncludeSearch?: (query: string) => void;
  onExcludeSearch?: (query: string) => void;
}

const IngredientFilters: React.FC<IngredientFiltersProps> = ({ 
  onIncludeSearch, 
  onExcludeSearch 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Include Ingredients</label>
        <IngredientSearch 
          compact={true} 
          placeholder="Search ingredients to include..." 
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Exclude Ingredients</label>
        <IngredientSearch 
          compact={true} 
          placeholder="Search ingredients to exclude..." 
        />
      </div>
    </div>
  );
};

export default IngredientFilters;
