import { useAppStore } from '@/app/store';
import { useMemo } from 'react';
import { MapFilters } from './mapFiltersSlice';

/**
 * Feature-specific hook for map filters state
 * Provides memoized selectors and encapsulates filter logic
 */
export function useMapFilters() {
  const store = useAppStore();

  // Memoized selectors
  const mapFilters = useAppStore((state) => state.mapFilters);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      mapFilters.priceRange !== null ||
      mapFilters.cuisine !== 'all' ||
      mapFilters.groceryCategory !== 'all' ||
      mapFilters.sources.length > 0 ||
      mapFilters.dietary.length > 0 ||
      mapFilters.nutrition.length > 0 ||
      mapFilters.excludeIngredients.length > 0 ||
      mapFilters.includeIngredients.length > 0
    );
  }, [mapFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (mapFilters.priceRange !== null) count++;
    if (mapFilters.cuisine !== 'all') count++;
    if (mapFilters.groceryCategory !== 'all') count++;
    if (mapFilters.sources.length > 0) count++;
    if (mapFilters.dietary.length > 0) count++;
    if (mapFilters.nutrition.length > 0) count++;
    if (mapFilters.excludeIngredients.length > 0) count++;
    if (mapFilters.includeIngredients.length > 0) count++;
    return count;
  }, [mapFilters]);

  const hasPriceFilter = useMemo(
    () => mapFilters.priceRange !== null,
    [mapFilters.priceRange]
  );

  const hasCuisineFilter = useMemo(
    () => mapFilters.cuisine !== 'all',
    [mapFilters.cuisine]
  );

  const hasGroceryCategoryFilter = useMemo(
    () => mapFilters.groceryCategory !== 'all',
    [mapFilters.groceryCategory]
  );

  const hasDietaryFilters = useMemo(
    () => mapFilters.dietary.length > 0,
    [mapFilters.dietary.length]
  );

  const hasIngredientFilters = useMemo(
    () => 
      mapFilters.excludeIngredients.length > 0 ||
      mapFilters.includeIngredients.length > 0,
    [mapFilters.excludeIngredients.length, mapFilters.includeIngredients.length]
  );

  // Helper functions
  const clearAllFilters = () => {
    store.updateMapFilters({
      priceRange: null,
      cuisine: 'all',
      groceryCategory: 'all',
      sources: [],
      dietary: [],
      nutrition: [],
      excludeIngredients: [],
      includeIngredients: [],
    });
  };

  const clearPriceFilter = () => {
    store.updateMapFilters({ priceRange: null });
  };

  const clearCuisineFilter = () => {
    store.updateMapFilters({ cuisine: 'all' });
  };

  const clearGroceryCategoryFilter = () => {
    store.updateMapFilters({ groceryCategory: 'all' });
  };

  const toggleDietaryFilter = (dietary: string) => {
    const current = mapFilters.dietary;
    const updated = current.includes(dietary)
      ? current.filter(d => d !== dietary)
      : [...current, dietary];
    store.updateMapFilters({ dietary: updated });
  };

  const toggleSourceFilter = (source: string) => {
    const current = mapFilters.sources;
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    store.updateMapFilters({ sources: updated });
  };

  return {
    // State
    mapFilters,

    // Actions
    updateMapFilters: store.updateMapFilters,
    clearAllFilters,
    clearPriceFilter,
    clearCuisineFilter,
    clearGroceryCategoryFilter,
    toggleDietaryFilter,
    toggleSourceFilter,

    // Computed values
    hasActiveFilters,
    activeFilterCount,
    hasPriceFilter,
    hasCuisineFilter,
    hasGroceryCategoryFilter,
    hasDietaryFilters,
    hasIngredientFilters,
  };
}

/**
 * Selector hook for specific filter
 */
export function usePriceRangeFilter() {
  return useAppStore((state) => state.mapFilters.priceRange);
}

export function useCuisineFilter() {
  return useAppStore((state) => state.mapFilters.cuisine);
}

export function useGroceryCategoryFilter() {
  return useAppStore((state) => state.mapFilters.groceryCategory);
}

export function useDietaryFilters() {
  return useAppStore((state) => state.mapFilters.dietary);
}

export function useIngredientFilters() {
  return useAppStore((state) => ({
    exclude: state.mapFilters.excludeIngredients,
    include: state.mapFilters.includeIngredients,
  }));
}
