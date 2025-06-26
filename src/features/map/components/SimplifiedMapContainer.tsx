
import React from 'react';
import UnifiedMapLoader from './UnifiedMapLoader';
import CoreMapView from './CoreMapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface SimplifiedMapContainerProps {
  height: string;
  mapState: MapState;
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  viewportBounds?: google.maps.LatLngBounds | null;
}

const SimplifiedMapContainer: React.FC<SimplifiedMapContainerProps> = ({
  height,
  mapState,
  selectedLocationId,
  hoveredLocationId,
  onMarkerClick,
  onMarkerHover,
  onLocationSelect,
  onMapLoaded,
  onMapIdle,
  viewportBounds
}) => {
  // Convert MapState to CoreMapState format with optimization props
  const coreMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || null
  };

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <UnifiedMapLoader 
        height={height}
        mapState={mapState}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      >
        {(isReady) => isReady && (
          <CoreMapView
            mapState={coreMapState}
            selectedLocationId={selectedLocationId}
            hoveredLocationId={hoveredLocationId}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
            onLocationSelect={onLocationSelect}
            onMapLoaded={onMapLoaded}
            onMapIdle={onMapIdle}
            viewportBounds={viewportBounds}
          />
        )}
      </UnifiedMapLoader>
    </div>
  );
};

export default SimplifiedMapContainer;
