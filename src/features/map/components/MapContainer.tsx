
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

  console.log('🏗️ MapContainer render:', { 
    loadingState: {
      stage: loadingState.stage,
      isReady: loadingState.isReady,
      isLoading: loadingState.isLoading,
      error: loadingState.error
    },
    apiKey: apiKey ? 'present' : 'missing', 
    googleMapsLoaded,
    googleMapsError: googleMapsError?.message,
    markersCount: mapState.markers.length,
    retryCount
  });

  const handleGoogleMapsLoad = useCallback(() => {
    console.log('📢 MapContainer received Google Maps ready signal');
    setGoogleMapsLoaded(true);
    setGoogleMapsError(null);
  }, []);

  const handleGoogleMapsError = useCallback((error: any) => {
    console.error('💥 MapContainer received Google Maps error:', error);
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

    console.log('⏳ MapContainer showing loading:', { stage: loadingState.stage, message: loadingMessage });
    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Show error if any dependency failed
  if (loadingState.error) {
    console.error('💥 MapContainer showing error:', { 
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

  // Double check we have what we need before rendering
  if (!apiKey) {
    console.log('⚠️ MapContainer: No API key available');
    return <MapLoadingState height={height} type="loading" errorMessage="Waiting for API key..." />;
  }

  if (!loadingState.isReady) {
    console.log('⚠️ MapContainer: Loading state says not ready');
    return <MapLoadingState height={height} type="loading" errorMessage="Preparing map..." />;
  }

  console.log('🚀 MapContainer: All ready, rendering GoogleMapsLoader');

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
