
import React from 'react';
import UnifiedMapView from './core/UnifiedMapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

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
  const unifiedMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || null,
    hoveredLocationId: mapState.hoveredLocationId || null
  };

  return (
    <UnifiedMapView
      mapState={unifiedMapState}
      selectedLocationId={selectedLocationId}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default MapView;
