
import React from 'react';
import UnifiedMapLoader from './UnifiedMapLoader';
import CoreMapView from './CoreMapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface SimplifiedMapContainerProps {
  height: string;
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const SimplifiedMapContainer: React.FC<SimplifiedMapContainerProps> = ({
  height,
  mapState,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  onMapLoaded,
  onMapIdle
}) => {
  // Convert MapState to CoreMapState format
  const coreMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || null
  };

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <UnifiedMapLoader height={height}>
        {(isReady) => isReady && (
          <CoreMapView
            mapState={coreMapState}
            onMarkerClick={onMarkerClick}
            onLocationSelect={onLocationSelect}
            onMapLoaded={onMapLoaded}
            onMapIdle={onMapIdle}
          />
        )}
      </UnifiedMapLoader>
    </div>
  );
};

export default SimplifiedMapContainer;
