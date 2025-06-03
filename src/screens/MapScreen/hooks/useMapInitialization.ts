
import { useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';

interface UseMapInitializationProps {
  currentSearchQuery: string;
  selectedIngredient: Ingredient | null;
  mapState: any;
  stableDependencies: any;
  onSelectIngredient: (ingredient: Ingredient) => Promise<void>;
}

export const useMapInitialization = ({
  currentSearchQuery,
  selectedIngredient,
  mapState,
  stableDependencies,
  onSelectIngredient
}: UseMapInitializationProps) => {

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await stableDependencies.searchNearbyPlaces(map, mapState.center);
        stableDependencies.updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          stableDependencies.showInfoToast(`Loaded ${nearbyPlaces.length} nearby places.`);
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        stableDependencies.showErrorToast('Failed to load nearby places.');
      }
    } else if (selectedIngredient) {
      onSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, selectedIngredient, onSelectIngredient, stableDependencies]);

  return {
    handleMapLoaded
  };
};
