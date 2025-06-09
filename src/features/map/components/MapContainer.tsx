
import React, { useState, useCallback } from 'react';
import { useApiKeyLoader } from './ApiKeyLoader';
import { useMapLoadingState } from '../hooks/useMapLoadingState';
import MapLoadingState from './MapLoadingState';
import GoogleMapsLoader from './GoogleMapsLoader';
import { Ingredient } from '@/models/NutritionalInfo';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface MapContainerProps {
  height: string;
  selectedIngredient?: Ingredient | null;
  onLocationSelect?: (locationId: string) => void;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  mapState: MapState;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  height, 
  selectedLocationId,
  onMarkerClick,
  mapState,
  searchQuery,
  onMapLoaded,
  onMapIdle,
  onLocationSelect
}) => {
  const { apiKey, error: apiKeyError, loading: apiKeyLoading, retryCount } = useApiKeyLoader();
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [googleMapsError, setGoogleMapsError] = useState<any>(null);

  // Use unified loading state to coordinate all dependencies
  const loadingState = useMapLoadingState({
    apiKeyLoading,
    apiKeyError,
    apiKey,
    googleMapsLoaded,
    googleMapsError
  });

  console.log('MapContainer render state:', { 
    loadingState,
    apiKey: apiKey ? 'present' : 'missing', 
    googleMapsLoaded,
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom,
    searchQuery,
    retryCount,
    currentUrl: window.location.href
  });

  const handleGoogleMapsLoad = useCallback(() => {
    console.log('Google Maps successfully loaded');
    setGoogleMapsLoaded(true);
    setGoogleMapsError(null);
  }, []);

  const handleGoogleMapsError = useCallback((error: any) => {
    console.error('Google Maps loading error:', error);
    setGoogleMapsError(error);
    setGoogleMapsLoaded(false);
  }, []);

  // Show loading while in loading states
  if (loadingState.isLoading) {
    const loadingMessage = loadingState.stage === 'api-key' 
      ? retryCount > 0 
        ? `Loading API key (attempt ${retryCount + 1})...`
        : 'Loading API key...'
      : loadingState.stage === 'google-maps'
        ? 'Loading Google Maps...'
        : 'Initializing map...';

    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Show error if any dependency failed
  if (loadingState.error) {
    console.error('Map loading error:', { 
      error: loadingState.error,
      stage: loadingState.stage,
      retryCount 
    });
    
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={loadingState.error} 
      />
    );
  }

  // Don't render map component until we have API key
  if (!apiKey) {
    console.log('Waiting for API key...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  // Now we can safely render the map with the API key
  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <GoogleMapsLoader
        apiKey={apiKey}
        mapState={mapState}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        height={height}
        searchQuery={searchQuery}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
        onGoogleMapsLoad={handleGoogleMapsLoad}
        onGoogleMapsError={handleGoogleMapsError}
      />
    </div>
  );
};

export default MapContainer;
