
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export const useFilteredResults = () => {
  const [resultCount, setResultCount] = useState<number | undefined>(undefined);
  const [isFiltering, setIsFiltering] = useState(false);
  const { mapFilters } = useAppStore();

  // Check if any filters are active
  const hasActiveFilters = 
    mapFilters.priceRange !== null ||
    mapFilters.cuisine !== 'all' ||
    mapFilters.groceryCategory !== 'all' ||
    mapFilters.dietary.length > 0 ||
    mapFilters.nutrition.length > 0 ||
    mapFilters.sources.length > 0 ||
    mapFilters.includeIngredients.length > 0 ||
    mapFilters.excludeIngredients.length > 0;

  // Update filtering state when filters change
  useEffect(() => {
    if (hasActiveFilters) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
      setResultCount(undefined);
    }
  }, [hasActiveFilters]);

  const updateResultCount = (count: number) => {
    setResultCount(count);
  };

  const clearResultCount = () => {
    setResultCount(undefined);
  };

  return {
    resultCount,
    hasActiveFilters,
    isFiltering,
    updateResultCount,
    clearResultCount
  };
};
