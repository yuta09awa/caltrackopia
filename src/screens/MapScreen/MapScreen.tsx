
import { useRef, useEffect, useCallback } from "react";
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

  // Wrapped handlers to connect hooks
  const wrappedHandleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await handleSelectIngredient(
      ingredient,
      mapRef,
      mapState,
      updateMarkers,
      updateCenter,
      searchPlacesByText
    );
  }, [handleSelectIngredient, mapState, updateMarkers, updateCenter, searchPlacesByText]);

  const wrappedHandleSearchReset = useCallback(() => {
    handleSearchReset(
      clearMarkers,
      mapRef,
      mapState,
      searchNearbyPlaces,
      updateMarkers
    );
  }, [handleSearchReset, clearMarkers, mapState, searchNearbyPlaces, updateMarkers]);

  const wrappedHandleLocationSelect = useCallback((locationId: string) => {
    handleLocationSelect(locationId, locations, selectLocation);
  }, [handleLocationSelect, locations, selectLocation]);

  const wrappedHandleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    handleMarkerClick(locationId, position, locations, selectLocation);
  }, [handleMarkerClick, locations, selectLocation]);

  const wrappedHandleInfoCardClose = useCallback(() => {
    handleInfoCardClose(selectLocation);
  }, [handleInfoCardClose, selectLocation]);

  const wrappedHandleViewDetails = useCallback((locationId: string) => {
    handleViewDetails(locationId, locations);
    wrappedHandleInfoCardClose();
  }, [handleViewDetails, locations, wrappedHandleInfoCardClose]);

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
    } else if (selectedIngredient) {
      wrappedHandleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, searchNearbyPlaces, updateMarkers, showInfoToast, showErrorToast, selectedIngredient, wrappedHandleSelectIngredient]);

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

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader 
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={wrappedHandleSelectIngredient}
        onSearchReset={wrappedHandleSearchReset}
      />
      
      <main className="flex-1 flex flex-col relative w-full">
        <MapScreenContent 
          mapHeight={mapHeight}
          selectedIngredient={selectedIngredient}
          currentSearchQuery={currentSearchQuery}
          mapState={mapState}
          showInfoCard={showInfoCard}
          selectedLocation={selectedLocation}
          infoCardPosition={infoCardPosition}
          onLocationSelect={wrappedHandleLocationSelect}
          onMarkerClick={wrappedHandleMarkerClick}
          onMapLoaded={handleMapLoaded}
          onMapIdle={handleMapIdle}
          onInfoCardClose={wrappedHandleInfoCardClose}
          onViewDetails={wrappedHandleViewDetails}
        />

        <MapScreenList 
          listRef={listRef}
          selectedLocationId={mapState.selectedLocationId}
          onScroll={handleScroll}
        />
      </main>
    </div>
  );
};

export default MapScreen;
