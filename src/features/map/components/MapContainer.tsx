
import React from 'react';
import { useApiKeyLoader } from './ApiKeyLoader';
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

  console.log('MapContainer render state:', { 
    apiKey: apiKey ? 'present' : 'missing', 
    apiKeyLoading,
    apiKeyError,
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom,
    searchQuery,
    retryCount,
    currentUrl: window.location.href
  });

  // Show loading while API key is loading
  if (apiKeyLoading) {
    const loadingMessage = retryCount > 0 
      ? `Loading API key (attempt ${retryCount + 1})...`
      : 'Loading API key...';

    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Show error if API key failed to load
  if (apiKeyError) {
    console.error('API key loading error:', { 
      error: apiKeyError,
      retryCount 
    });
    
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={apiKeyError} 
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
      />
    </div>
  );
};

export default MapContainer;
