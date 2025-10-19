
import React from 'react';
import MapRenderer from './core/MapRenderer';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';
import { UnifiedMapState } from '../types/unified';
import { StandardComponentProps } from '@/types/standardProps';

interface MapContainerProps extends Omit<StandardComponentProps, 'children'> {
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
  mapState,
  selectedLocationId,
  ...props
}) => {
  // Convert MapState to UnifiedMapState
  const unifiedMapState: UnifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || mapState.selectedLocationId,
    hoveredLocationId: mapState.hoveredLocationId,
    isLoading: false,
    error: null
  };

  return <MapRenderer {...props} mapState={unifiedMapState} />;
};

export default MapContainer;
