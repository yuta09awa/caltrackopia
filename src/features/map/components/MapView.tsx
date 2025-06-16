
import React from 'react';
import SimpleMapView from './SimpleMapView';
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
  // Convert MapState to SimpleMapState format
  const simpleMapState = {
    center: mapState.center,
    zoom: mapState.zoom,
    markers: mapState.markers,
    selectedLocationId: selectedLocationId || null
  };

  return (
    <SimpleMapView
      mapState={simpleMapState}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default MapView;
