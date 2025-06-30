
import React from 'react';
import UnifiedMapLoader from '../loaders/UnifiedMapLoader';
import UnifiedMapView from './UnifiedMapView';
import { MapRendererProps, UnifiedMapState } from '../../types/unified';

const MapRenderer: React.FC<MapRendererProps> = ({
  height,
  mapState,
  onMarkerClick,
  onMarkerHover,
  onLocationSelect,
  onMapLoaded,
  onMapIdle,
  viewportBounds
}) => {
  // Ensure mapState conforms to UnifiedMapState
  const unifiedMapState: UnifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: mapState.selectedLocationId || null,
    hoveredLocationId: mapState.hoveredLocationId || null,
    isLoading: mapState.isLoading || false,
    error: mapState.error || null
  };

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <UnifiedMapLoader 
        height={height}
        mapState={unifiedMapState}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      >
        {(isReady) => isReady && (
          <UnifiedMapView
            mapState={unifiedMapState}
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
