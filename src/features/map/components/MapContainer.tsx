
import React from 'react';
import { useApiKeyLoader } from './ApiKeyLoader';
import MapLoadingState from './MapLoadingState';
import MapApiLoader from './MapApiLoader';
import MapView from './MapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface MapContainerProps {
  height: string;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
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
  const { apiKey, error, loading } = useApiKeyLoader();

  // Handle API key loading states
  if (loading) {
    return <MapLoadingState height={height} type="loading" errorMessage="Loading API key..." />;
  }

  if (error) {
    return <MapLoadingState height={height} type="error" errorMessage={error} />;
  }

  if (!apiKey) {
    return <MapLoadingState height={height} type="initializing" />;
  }

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <MapApiLoader apiKey={apiKey} height={height}>
        {(isReady) => isReady && (
          <MapView
            mapState={mapState}
            selectedLocationId={selectedLocationId}
            onMarkerClick={onMarkerClick}
            onLocationSelect={onLocationSelect}
            searchQuery={searchQuery}
            onMapLoaded={onMapLoaded}
            onMapIdle={onMapIdle}
          />
        )}
      </MapApiLoader>
    </div>
  );
};

export default MapContainer;
