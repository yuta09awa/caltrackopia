
import React from 'react';
import UnifiedMapView from './core/UnifiedMapView';
import { MapState, LatLng } from '@/features/map/types';
import { UnifiedMapState } from '../types/unified';

interface MapViewProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  mapState,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  onMapLoaded,
  onMapIdle
}) => {
  // Convert MapState to UnifiedMapState format
  const unifiedMapState: UnifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || mapState.selectedLocationId,
    hoveredLocationId: mapState.hoveredLocationId,
    isLoading: false,
    error: null
  };

  return (
    <UnifiedMapView
      mapState={unifiedMapState}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default MapView;
