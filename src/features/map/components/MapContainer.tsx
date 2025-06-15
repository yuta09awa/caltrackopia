
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

const LoadedMap: React.FC<MapContainerProps & { apiKey: string }> = ({
  apiKey,
  height,
  selectedLocationId,
  onMarkerClick,
  mapState,
  searchQuery,
  onMapLoaded,
  onMapIdle,
  onLocationSelect
}) => {
  const { isLoaded: googleMapsLoaded, loadError: googleMapsError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'],
    preventGoogleFontsLoading: true,
  });

  const loadingState = useMapLoadingState({
    apiKeyLoading: false, // API key is already loaded at this point
    apiKeyError: null,
    apiKey,
    googleMapsLoaded,
    googleMapsError
  });

  console.log('LoadedMap render state:', { 
    loadingState,
    googleMapsLoaded,
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom,
  });

  if (!loadingState.isReady) {
    let loadingMessage = 'Initializing map...';
    if (loadingState.isLoading) {
      if (loadingState.stage === 'google-maps') {
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

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { apiKey, error: apiKeyError, loading: apiKeyLoading } = useApiKeyLoader();
  const { height } = props;

  if (apiKeyLoading) {
    return <MapLoadingState height={height} type="loading" errorMessage="Loading API key..." />;
  }

  if (apiKeyError) {
    return <MapLoadingState height={height} type="error" errorMessage={apiKeyError} />;
  }

  if (!apiKey) {
    // This case might happen if loading finishes but key is still null without an error.
    return <MapLoadingState height={height} type="error" errorMessage="API key not available." />;
  }
  
  return <LoadedMap {...props} apiKey={apiKey} />;
};

export default MapContainer;
