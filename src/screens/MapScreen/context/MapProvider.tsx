
import React, { useRef, useCallback } from 'react';
import { MapProvider as BaseMapProvider, MapContextValue } from './MapContext';
import { useMapStore } from '@/features/map/hooks/useMapStore';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { usePlacesApi } from '@/features/map/hooks/usePlacesApi';
import { useToastManager } from '@/features/map/hooks/useToastManager';
import { Ingredient } from '@/models/NutritionalInfo';
import { LatLng } from '@/store/slices/mapSlice';

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Get state and actions from Zustand store
  const {
    mapState,
    userLocation,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    setUserLocation,
    setSelectedIngredient,
    setSearchQuery,
    setDisplayedSearchQuery,
    setShowInfoCard,
    setSelectedLocationData,
    setInfoCardPosition,
    clearMarkers,
  } = useMapStore();

  // External data and services
  const { locations } = useLocations();
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { showInfoToast, showErrorToast } = useToastManager();

  // Enhanced action handlers
  const handleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    console.log('Selected ingredient:', ingredient);
    setSelectedIngredient(ingredient);
    setSearchQuery(ingredient.name);
    setDisplayedSearchQuery(ingredient.name);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      const searchMarkers = ingredient.locations.map(location => ({
        position: { lat: location.lat, lng: location.lng },
        locationId: location.id,
        type: 'search-result' as const
      }));
      
      updateMarkers(searchMarkers);
      if (searchMarkers.length > 0) {
        updateCenter(searchMarkers[0].position);
      }
      showInfoToast(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else if (mapRef.current) {
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
          showInfoToast(`Found ${placesResults.length} places for ${ingredient.name}`);
        } else {
          updateMarkers([]);
          showInfoToast(`No locations found for ${ingredient.name}`);
        }
      } catch (error) {
        console.error('Places search failed:', error);
        updateMarkers([]);
        showErrorToast(`Search failed for ${ingredient.name}`);
      }
    }
  }, [setSelectedIngredient, setSearchQuery, setDisplayedSearchQuery, updateMarkers, updateCenter, mapState.center, searchPlacesByText, showInfoToast, showErrorToast]);

  const handleSearchReset = useCallback(() => {
    console.log('Resetting search');
    setSelectedIngredient(null);
    setSearchQuery('');
    setDisplayedSearchQuery('');
    clearMarkers();
    
    if (mapRef.current) {
      searchNearbyPlaces(mapRef.current, mapState.center)
        .then((nearbyPlaces) => {
          updateMarkers(nearbyPlaces);
          if (nearbyPlaces.length > 0) {
            showInfoToast(`Reloaded ${nearbyPlaces.length} nearby places.`);
          }
        })
        .catch((error) => console.error('Failed to reload nearby places after search reset:', error));
    }
  }, [setSelectedIngredient, setSearchQuery, setDisplayedSearchQuery, clearMarkers, mapState.center, searchNearbyPlaces, updateMarkers, showInfoToast]);

  const handleLocationSelect = useCallback((locationId: string) => {
    console.log('Location selected:', locationId);
    selectLocation(locationId);
    
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocationData(location);
      showInfoToast(`Showing ${location.name} on map`);
    }
  }, [selectLocation, locations, setSelectedLocationData, showInfoToast]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    console.log('Marker clicked:', locationId, position);
    const location = locations.find(loc => loc.id === locationId);
    
    if (location && (location.type === "Restaurant" || location.type === "Grocery")) {
      setSelectedLocationData(location);
      selectLocation(locationId);
      setInfoCardPosition(position);
      setShowInfoCard(true);
    }
  }, [locations, setSelectedLocationData, selectLocation, setInfoCardPosition, setShowInfoCard]);

  const handleInfoCardClose = useCallback(() => {
    console.log('Info card closed');
    setShowInfoCard(false);
    selectLocation(null);
    setSelectedLocationData(null);
  }, [setShowInfoCard, selectLocation, setSelectedLocationData]);

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await searchNearbyPlaces(map, mapState.center);
        updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          showInfoToast(`Loaded ${nearbyPlaces.length} nearby places.`);
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        showErrorToast('Failed to load nearby places.');
      }
    }
  }, [currentSearchQuery, mapState.center, searchNearbyPlaces, updateMarkers, showInfoToast, showErrorToast]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
  }, [updateCenter, updateZoom]);

  const contextValue: MapContextValue = {
    // State
    mapState,
    mapRef,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    userLocation,
    locations,
    
    // Actions
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    clearMarkers,
    handleSelectIngredient,
    handleSearchReset,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleMapLoaded,
    handleMapIdle,
    handleScroll: () => {}, // Placeholder for now
    handleViewDetails: () => {}, // Placeholder for now
  };

  return (
    <BaseMapProvider value={contextValue}>
      {children}
    </BaseMapProvider>
  );
};
