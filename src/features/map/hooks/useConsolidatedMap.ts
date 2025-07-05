import { useCallback, useRef } from 'react';
import { useMapCore } from './useMapCore';
import { useUserLocation } from './useUserLocation';
import { usePlacesApi } from './usePlacesApi';
import { useToastManager } from './useToastManager';
import { useMapMarkers } from './useMapMarkers';
import { useMapOptions } from './useMapOptions';
import { useInfoCardState } from './useInfoCardState';
import { useSearchState } from './useSearchState';
import { LatLng, MarkerData } from '../types';

export interface ConsolidatedMapOptions {
  initialCenter?: LatLng;
  initialZoom?: number;
  enableSearch?: boolean;
  enableUserLocation?: boolean;
  enableInfoCard?: boolean;
}

/**
 * Consolidated map hook that combines the most commonly used map functionality
 * This replaces the need for multiple separate hooks in most cases
 */
export function useConsolidatedMap(options: ConsolidatedMapOptions = {}) {
  const {
    initialCenter,
    initialZoom,
    enableSearch = true,
    enableUserLocation = true,
    enableInfoCard = true
  } = options;

  // Core map functionality
  const mapCore = useMapCore(initialCenter, initialZoom);
  const { mapOptions } = useMapOptions();
  
  // Location services
  const userLocationHook = enableUserLocation ? useUserLocation() : { userLocation: null, isGettingLocation: false, getUserLocation: async () => null };
  
  // API services
  const placesApi = usePlacesApi();
  const { showSuccessToast, showInfoToast, showErrorToast } = useToastManager();
  
  // Search functionality
  const searchState = enableSearch ? useSearchState() : null;
  
  // Info card functionality
  const infoCard = enableInfoCard ? useInfoCardState() : null;
  
  // Marker management
  const markerHooks = useMapMarkers({
    markers: mapCore.mapState.markers,
    selectedLocationId: mapCore.mapState.selectedLocationId,
    hoveredLocationId: mapCore.mapState.hoveredLocationId
  });

  // Consolidated search function
  const performSearch = useCallback(async (
    query: string,
    options: {
      type?: 'text' | 'nearby';
      center?: LatLng;
      radius?: number;
    } = {}
  ) => {
    const { type = 'text', center = mapCore.mapState.center, radius = 2000 } = options;
    
    try {
      let results: MarkerData[] = [];
      
      if (type === 'text' && mapCore.mapRef.current) {
        results = await placesApi.searchPlacesByText(mapCore.mapRef.current, query, center, radius);
      } else if (type === 'nearby' && mapCore.mapRef.current) {
        results = await placesApi.searchNearbyPlaces(mapCore.mapRef.current, center, radius);
      }
      
      mapCore.updateMarkers(results);
      
      if (results.length > 0) {
        showSuccessToast(`Found ${results.length} places`);
      } else {
        showInfoToast('No places found');
      }
      
      return results;
    } catch (error) {
      showErrorToast('Search failed');
      console.error('Search error:', error);
      return [];
    }
  }, [mapCore, placesApi, showSuccessToast, showInfoToast, showErrorToast]);

  // Consolidated location selection
  const selectLocation = useCallback((locationId: string | null, position?: { x: number; y: number }) => {
    mapCore.selectLocation(locationId);
    
    if (infoCard && locationId && position) {
      infoCard.showCard(position);
    }
  }, [mapCore, infoCard]);

  // Consolidated marker click handler
  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    selectLocation(locationId, position);
  }, [selectLocation]);

  // Consolidated map event handlers
  const handleMapLoaded = useCallback((map: google.maps.Map) => {
    mapCore.handleMapLoaded(map);
    
    // Auto-search nearby places if user location is available
    if (enableUserLocation && userLocationHook.userLocation) {
      performSearch('', {
        type: 'nearby',
        center: userLocationHook.userLocation,
        radius: 2000
      });
    }
  }, [mapCore, enableUserLocation, userLocationHook.userLocation, performSearch]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    mapCore.handleMapIdle(center, zoom);
  }, [mapCore]);

  // Consolidated clear function
  const clearAll = useCallback(() => {
    mapCore.clearMarkers();
    mapCore.selectLocation(null);
    
    if (infoCard) {
      infoCard.hideCard();
    }
    
    if (searchState) {
      searchState.resetSearch();
    }
  }, [mapCore, infoCard, searchState]);

  return {
    // Core map state and actions
    mapState: mapCore.mapState,
    mapRef: mapCore.mapRef,
    mapOptions,
    
    // Location services
    userLocation: userLocationHook.userLocation,
    isGettingLocation: userLocationHook.isGettingLocation,
    getUserLocation: userLocationHook.getUserLocation,
    
    // Search functionality
    searchLoading: searchState?.loading || false,
    searchError: searchState?.error || null,
    searchResultCount: searchState?.resultCount || 0,
    performSearch,
    
    // Selection and interaction
    selectLocation,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    
    // Info card (if enabled)
    infoCardVisible: infoCard?.showInfoCard || false,
    infoCardPosition: infoCard?.infoCardPosition || null,
    selectedLocationId: mapCore.mapState.selectedLocationId,
    showCard: infoCard?.showCard || (() => {}),
    hideCard: infoCard?.hideCard || (() => {}),
    
    // Marker management
    markers: mapCore.mapState.markers,
    memoizedMarkers: markerHooks.memoizedMarkers,
    
    // Utility functions
    clearAll,
    updateCenter: mapCore.updateCenter,
    updateZoom: mapCore.updateZoom,
    updateMarkers: mapCore.updateMarkers,
    
    // Toast notifications
    showSuccessToast,
    showInfoToast,
    showErrorToast,
    
    // Loading states
    loading: mapCore.mapState.isLoading || placesApi.loading,
    error: mapCore.mapState.error || placesApi.error,
    
    // API services (for advanced usage)
    placesApi,
    
    // Direct access to core functionality (for advanced usage)
    mapCore
  };
}

// Type export for external usage
export type ConsolidatedMapHook = ReturnType<typeof useConsolidatedMap>;