
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

  console.log('🏗️ MapContainer render:', { 
    apiKey: apiKey ? 'present' : 'missing', 
    apiKeyLoading,
    apiKeyError,
    markersCount: mapState.markers.length,
    retryCount
  });

  // Show loading while API key loads
  if (apiKeyLoading) {
    const loadingMessage = retryCount > 0 
      ? `Loading API key (attempt ${retryCount + 1})...`
      : 'Loading API key...';
    
    console.log('⏳ MapContainer: Loading API key');
    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Show error if API key failed
  if (apiKeyError) {
    console.error('💥 MapContainer: API key error:', apiKeyError);
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={apiKeyError} 
      />
    );
  }

  // Check we have API key
  if (!apiKey) {
    console.log('⚠️ MapContainer: No API key available');
    return <MapLoadingState height={height} type="loading" errorMessage="Waiting for API key..." />;
  }

  console.log('🚀 MapContainer: API key ready, rendering GoogleMapsLoader');

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
