import { useCallback } from 'react';
import { useMapFilters } from '../store/useMapFilters';

/**
 * @internal - Used internally by search hooks
 */
export const usePlaceFilters = () => {
  const { mapFilters } = useMapFilters();

  const applyFilters = useCallback((places: any[]) => {
    if (!places) return [];

    return places.filter(place => {
      // Apply price range filter
      if (mapFilters.priceRange !== null && place.price_level !== undefined) {
        if (place.price_level > mapFilters.priceRange) {
          return false;
        }
      }

      // Apply cuisine filter
      if (mapFilters.cuisine !== 'all') {
        const placeCuisine = place.cuisine || place.types || [];
        const hasCuisine = placeCuisine.includes(mapFilters.cuisine.toLowerCase());
        if (!hasCuisine) return false;
      }

      return true;
    });
  }, [mapFilters]);

  return { applyFilters };
};
