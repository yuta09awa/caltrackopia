
import React from 'react';
import IngredientSearchComponent from '@/features/ingredients/components/IngredientSearch';
import { Ingredient } from '@/hooks/useIngredientSearch';

// Re-export the component with the same interface for backward compatibility
interface IngredientSearchProps {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  className?: string;
  compact?: boolean;
  placeholder?: string;
}

const IngredientSearch: React.FC<IngredientSearchProps> = (props) => {
  return <IngredientSearchComponent {...props} />;
};

export default IngredientSearch;
