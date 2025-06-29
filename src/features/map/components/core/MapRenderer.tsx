
import React from 'react';
import UnifiedMapLoader from '../loaders/UnifiedMapLoader';
import UnifiedMapView from './UnifiedMapView';
import { MapState, LatLng } from '../../hooks/useMapState';

interface MapRendererProps {
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

const MapRenderer: React.FC<MapRendererProps> = ({
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
  // Convert MapState to UnifiedMapState format
  const unifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || null,
    hoveredLocationId: hoveredLocationId || null
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
          <UnifiedMapView
            mapState={unifiedMapState}
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

export default MapRenderer;
