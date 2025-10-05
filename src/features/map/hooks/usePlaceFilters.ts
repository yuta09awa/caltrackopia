
import { useCallback } from 'react';
import { useAppStore } from '@/app/store';

export const usePlaceFilters = () => {
  const { mapFilters } = useAppStore();

  const applyFilters = useCallback((places: any[]): any[] => {
    return places.filter(place => {
      // Price range filter
      if (mapFilters.priceRange && place.price_level !== undefined && place.price_level !== null) {
        const [minPrice, maxPrice] = mapFilters.priceRange;
        if (place.price_level < minPrice || place.price_level > maxPrice) {
          return false;
        }
      }

      // Exclude ingredients filter
      if (mapFilters.excludeIngredients.length > 0) {
        const placeName = (place.name || '').toLowerCase();
        const hasExcludedIngredient = mapFilters.excludeIngredients.some(ingredient =>
          placeName.includes(ingredient.toLowerCase())
        );
        if (hasExcludedIngredient) {
          return false;
        }
      }

      // Cuisine filter
      if (mapFilters.cuisine !== 'all') {
        const placeTypes = place.place_types || place.types || [];
        const matchesCuisine = placeTypes.some((type: string) => 
          type.toLowerCase().includes(mapFilters.cuisine.toLowerCase())
        );
        if (!matchesCuisine) {
          return false;
        }
      }

      // Dietary restrictions filter
      if (mapFilters.dietary.length > 0) {
        // This would need more sophisticated logic based on place data
        // For now, we'll allow all places through this filter
      }

      return true;
    });
  }, [mapFilters]);

  const getActiveFiltersCount = useCallback((): number => {
    let count = 0;
    
    if (mapFilters.priceRange && mapFilters.priceRange[0] > 1 || mapFilters.priceRange[1] < 4) {
      count++;
    }
    
    if (mapFilters.excludeIngredients.length > 0) {
      count++;
    }
    
    if (mapFilters.cuisine !== 'all') {
      count++;
    }
    
    if (mapFilters.dietary.length > 0) {
      count++;
    }
    
    if (mapFilters.includeIngredients.length > 0) {
      count++;
    }

    return count;
  }, [mapFilters]);

  const getFiltersForApi = useCallback(() => {
    return {
      dietary: mapFilters.dietary,
      nutrition: mapFilters.nutrition,
      sources: mapFilters.sources,
      includeIngredients: mapFilters.includeIngredients,
      excludeIngredients: mapFilters.excludeIngredients,
      priceRange: mapFilters.priceRange,
      cuisine: mapFilters.cuisine !== 'all' ? mapFilters.cuisine : null,
      groceryCategory: mapFilters.groceryCategory !== 'all' ? mapFilters.groceryCategory : null
    };
  }, [mapFilters]);

  return {
    applyFilters,
    getActiveFiltersCount,
    getFiltersForApi,
    currentFilters: mapFilters
  };
};
