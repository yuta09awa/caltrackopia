
import { useRef, useEffect, useCallback, useMemo } from "react";
import { useLocations } from "@/features/locations/hooks/useLocations";
import { useMapState, LatLng } from "@/features/map/hooks/useMapState";
import { usePlacesApi } from "@/features/map/hooks/usePlacesApi";
import { useUserLocation } from "@/features/map/hooks/useUserLocation";
import { useMapSearch } from "@/features/map/hooks/useMapSearch";
import { useMapInteractions } from "@/features/map/hooks/useMapInteractions";
import { useMapUI } from "@/features/map/hooks/useMapUI";
import { useToastManager } from "@/features/map/hooks/useToastManager";
import { MapScreenHeader, MapScreenContent, MapScreenList } from "./components";
import { Ingredient } from "@/models/NutritionalInfo";

const MapScreen = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { locations } = useLocations();
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    clearMarkers 
  } = useMapState();
  
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { userLocation } = useUserLocation();
  const { showSuccessToast, showInfoToast, showErrorToast } = useToastManager();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  } = useMapSearch();
  
  const {
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails
  } = useMapInteractions();
  
  const { mapHeight, listRef, handleScroll } = useMapUI();

  // Memoize stable dependencies for callbacks
  const stableDependencies = useMemo(() => ({
    updateMarkers,
    updateCenter,
    selectLocation,
    clearMarkers,
    searchPlacesByText,
    searchNearbyPlaces,
    showInfoToast,
    showErrorToast,
    locations
  }), [
    updateMarkers,
    updateCenter,
    selectLocation,
    clearMarkers,
    searchPlacesByText,
    searchNearbyPlaces,
    showInfoToast,
    showErrorToast,
    locations
  ]);

  // Optimized wrapped handlers with proper dependencies
  const wrappedHandleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await handleSelectIngredient(
      ingredient,
      mapRef,
      mapState,
      stableDependencies.updateMarkers,
      stableDependencies.updateCenter,
      stableDependencies.searchPlacesByText
    );
  }, [handleSelectIngredient, mapState, stableDependencies]);

  const wrappedHandleSearchReset = useCallback(() => {
    handleSearchReset(
      stableDependencies.clearMarkers,
      mapRef,
      mapState,
      stableDependencies.searchNearbyPlaces,
      stableDependencies.updateMarkers
    );
  }, [handleSearchReset, mapState, stableDependencies]);

  const wrappedHandleLocationSelect = useCallback((locationId: string) => {
    handleLocationSelect(locationId, stableDependencies.locations, stableDependencies.selectLocation);
  }, [handleLocationSelect, stableDependencies]);

  const wrappedHandleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    handleMarkerClick(locationId, position, stableDependencies.locations, stableDependencies.selectLocation);
  }, [handleMarkerClick, stableDependencies]);

  const wrappedHandleInfoCardClose = useCallback(() => {
    handleInfoCardClose(stableDependencies.selectLocation);
  }, [handleInfoCardClose, stableDependencies]);

  const wrappedHandleViewDetails = useCallback((locationId: string) => {
    handleViewDetails(locationId, stableDependencies.locations);
    wrappedHandleInfoCardClose();
  }, [handleViewDetails, stableDependencies, wrappedHandleInfoCardClose]);

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    
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
      wrappedHandleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, selectedIngredient, wrappedHandleSelectIngredient, stableDependencies]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
    console.log('Map idle:', { center, zoom });
  }, [updateCenter, updateZoom]);

  useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  // Memoize props objects to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    displayedSearchQuery,
    onSelectIngredient: wrappedHandleSelectIngredient,
    onSearchReset: wrappedHandleSearchReset
  }), [displayedSearchQuery, wrappedHandleSelectIngredient, wrappedHandleSearchReset]);

  const contentProps = useMemo(() => ({
    mapHeight,
    selectedIngredient,
    currentSearchQuery,
    mapState,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    onLocationSelect: wrappedHandleLocationSelect,
    onMarkerClick: wrappedHandleMarkerClick,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle,
    onInfoCardClose: wrappedHandleInfoCardClose,
    onViewDetails: wrappedHandleViewDetails
  }), [
    mapHeight,
    selectedIngredient,
    currentSearchQuery,
    mapState,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    wrappedHandleLocationSelect,
    wrappedHandleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    wrappedHandleInfoCardClose,
    wrappedHandleViewDetails
  ]);

  const listProps = useMemo(() => ({
    listRef,
    selectedLocationId: mapState.selectedLocationId,
    onScroll: handleScroll
  }), [listRef, mapState.selectedLocationId, handleScroll]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader {...headerProps} />
      
      <main className="flex-1 flex flex-col relative w-full">
        <MapScreenContent {...contentProps} />
        <MapScreenList {...listProps} />
      </main>
    </div>
  );
};

export default MapScreen;
