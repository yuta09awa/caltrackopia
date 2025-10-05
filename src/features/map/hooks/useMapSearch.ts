
import { useState, useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { toast } from 'sonner';
import { MarkerData } from '../types';

export interface MapSearchState {
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  displayedSearchQuery: string;
}

export interface MapSearchActions {
  handleSelectIngredient: (
    ingredient: Ingredient,
    mapRef: React.RefObject<google.maps.Map | null>,
    mapState: any,
    updateMarkers: (markers: MarkerData[]) => void,
    updateCenter: (center: { lat: number; lng: number }) => void,
    searchPlacesByText: any
  ) => Promise<void>;
  handleSearchReset: (
    clearMarkers: () => void,
    mapRef: React.RefObject<google.maps.Map | null>,
    mapState: any,
    searchNearbyPlaces: any,
    updateMarkers: (markers: MarkerData[]) => void
  ) => void;
}

export const useMapSearch = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('');

  const handleSelectIngredient = useCallback(async (
    ingredient: Ingredient,
    mapRef: React.RefObject<google.maps.Map | null>,
    mapState: any,
    updateMarkers: (markers: MarkerData[]) => void,
    updateCenter: (center: { lat: number; lng: number }) => void,
    searchPlacesByText: any
  ) => {
    console.log('Selected ingredient:', ingredient);
    setSelectedIngredient(ingredient);
    setCurrentSearchQuery(ingredient.name);
    setDisplayedSearchQuery(ingredient.name);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      const searchMarkers = ingredient.locations.map(location => ({
        position: { lat: location.lat, lng: location.lng },
        id: location.id,
        type: 'search-result' as const
      }));
      
      updateMarkers(searchMarkers);
      if (searchMarkers.length > 0) {
        updateCenter(searchMarkers[0].position);
      }
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      if (mapRef.current) {
        try {
          const placesResults = await searchPlacesByText(
            mapRef.current, 
            ingredient.name, 
            mapState.center,
            10000
          );
          
          if (placesResults.length > 0) {
            updateMarkers(placesResults);
            updateCenter(placesResults[0].position);
            toast.success(`Found ${placesResults.length} places for ${ingredient.name}`);
          } else {
            updateMarkers([]);
            toast.info(`No locations found for ${ingredient.name}`);
          }
        } catch (error) {
          console.error('Places search failed:', error);
          updateMarkers([]);
          toast.error(`Search failed for ${ingredient.name}`);
        }
      } else {
        updateMarkers([]);
        toast.info(`Searching for: ${ingredient.name}`);
      }
    }
  }, []);

  const handleSearchReset = useCallback((
    clearMarkers: () => void,
    mapRef: React.RefObject<google.maps.Map | null>,
    mapState: any,
    searchNearbyPlaces: any,
    updateMarkers: (markers: MarkerData[]) => void
  ) => {
    console.log('Resetting search');
    setSelectedIngredient(null);
    setCurrentSearchQuery('');
    setDisplayedSearchQuery('');
    clearMarkers();
    
    if (mapRef.current) {
      searchNearbyPlaces(mapRef.current, mapState.center)
        .then((nearbyPlaces: MarkerData[]) => {
          updateMarkers(nearbyPlaces);
          if (nearbyPlaces.length > 0) {
            toast.info(`Reloaded ${nearbyPlaces.length} nearby places.`, { duration: 2000 });
          }
        })
        .catch((error: any) => console.error('Failed to reload nearby places after search reset:', error));
    }
  }, []);

  return {
    // State
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    
    // Actions
    handleSelectIngredient,
    handleSearchReset,
  };
};
