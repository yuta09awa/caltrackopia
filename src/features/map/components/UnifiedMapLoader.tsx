
import React from 'react';
import { useApiKeyState } from '../hooks/useApiKeyState';
import MapApiLoader from './MapApiLoader';
import MapLoadingState from './MapLoadingState';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface UnifiedMapLoaderProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  height: string;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  children: (isReady: boolean) => React.ReactNode;
}

const UnifiedMapLoader: React.FC<UnifiedMapLoaderProps> = ({
  height,
  children,
  ...props
}) => {
  const { apiKey, error, loading } = useApiKeyState();

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
    <MapApiLoader apiKey={apiKey} height={height}>
      {children}
    </MapApiLoader>
  );
};

export default UnifiedMapLoader;
