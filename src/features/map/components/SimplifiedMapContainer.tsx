
import React from 'react';
import MapRenderer from './core/MapRenderer';
import { MapState, LatLng } from '@/features/map/types';
import { UnifiedMapState } from '../types/unified';

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
  mapState,
  selectedLocationId,
  hoveredLocationId,
  ...props
}) => {
  // Convert MapState to UnifiedMapState
  const unifiedMapState: UnifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || mapState.selectedLocationId,
    hoveredLocationId: hoveredLocationId || mapState.hoveredLocationId,
    isLoading: false,
    error: null
  };

  return <MapRenderer {...props} mapState={unifiedMapState} />;
};

export default SimplifiedMapContainer;
