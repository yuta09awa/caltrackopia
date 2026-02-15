import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsolidatedMap } from '@/features/map/hooks/useConsolidatedMap';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/models/Location';
import { convertLocationsToMarkers } from '@/features/map/utils/locationUtils';

export const useMapScreen = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const listRef = useRef<HTMLDivElement>(null);
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('');

  // Lock body scroll on this route
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Consolidated hook for map logic
  const {
    mapState,
    infoCardVisible,
    infoCardPosition,
    selectedLocationId,
    markers,
    performSearch,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    hideCard,
    clearAll,
    selectLocation,
    mapCore,
  } = useConsolidatedMap({
    enableSearch: true,
    enableUserLocation: true,
    enableInfoCard: true,
  });

  // Fetch rich location data
  const { locations } = useLocations();

  // Convert locations to markers when locations load and no search is active
  useEffect(() => {
    if (locations.length > 0 && markers.length === 0 && !displayedSearchQuery) {
      const locationMarkers = convertLocationsToMarkers(locations);
      mapCore.updateMarkers(locationMarkers);
    }
  }, [locations, markers.length, displayedSearchQuery, mapCore]);

  // Determine what locations to display
  const displayLocations: Location[] = useMemo(() => {
    if (markers.length === 0) {
      return locations;
    }
    
    return markers.map(marker => {
      const fullLocation = locations.find(loc => loc.id === marker.id);
      return fullLocation;
    }).filter((location): location is Location => location !== undefined);
  }, [markers, locations]);

  const selectedLocation: Location | null = useMemo(() => {
    return displayLocations.find(location => location.id === selectedLocationId) || null;
  }, [displayLocations, selectedLocationId]);

  const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
    const query = ingredient.name;
    setDisplayedSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  const handleSearchOnMap = useCallback((query: string) => {
    setDisplayedSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  const handleSearchReset = useCallback(() => {
    setDisplayedSearchQuery('');
    clearAll();
  }, [clearAll]);

  const handleLocationSelect = useCallback((locationId: string | null) => {
    selectLocation(locationId);
  }, [selectLocation]);

  const handleViewDetails = useCallback((locationId: string) => {
    if (locationId) {
      navigate(`/location/${locationId}`);
    }
  }, [navigate]);

  const handleScroll = useCallback(() => {
    // Placeholder for scroll handling logic
  }, []);

  return {
    // State
    isMobile,
    listRef,
    displayedSearchQuery,
    
    // Map state
    mapState,
    infoCardVisible,
    infoCardPosition,
    selectedLocationId,
    
    // Data
    displayLocations,
    selectedLocation,
    
    // Handlers
    handleSelectIngredient,
    handleSearchOnMap,
    handleSearchReset,
    handleLocationSelect,
    handleViewDetails,
    handleScroll,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    hideCard,
  };
};
