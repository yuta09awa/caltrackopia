import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useApiKeyLoader } from './ApiKeyLoader';
import { useMapLoadingState } from '../hooks/useMapLoadingState';
import MapLoadingState from './MapLoadingState';
import MapView from './MapView';
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
  const { apiKey, error: apiKeyError, loading: apiKeyLoading } = useApiKeyLoader();

  const { isLoaded: googleMapsLoaded, loadError: googleMapsError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey!,
    libraries: ['places'],
    preventGoogleFontsLoading: true,
    // Only attempt to load the script once we have an API key
    disabled: !apiKey,
  });

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
  });

  // Show loading or error states
  if (!loadingState.isReady) {
    let loadingMessage = 'Initializing map...';
    if (loadingState.isLoading) {
      if (loadingState.stage === 'api-key') {
        loadingMessage = 'Loading API key...';
      } else if (loadingState.stage === 'google-maps') {
        loadingMessage = 'Loading Google Maps...';
      }
    }

    if (loadingState.error) {
      console.error('Map loading error:', { 
        error: loadingState.error,
        stage: loadingState.stage,
      });
      return <MapLoadingState height={height} type="error" errorMessage={loadingState.error} />;
    }

    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }
  
  // Now we can safely render the map
  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <MapView
        mapState={mapState}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        searchQuery={searchQuery}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      />
    </div>
  );
};

export default MapContainer;
