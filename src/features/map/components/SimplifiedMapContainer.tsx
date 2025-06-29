
import React from 'react';
import MapRenderer from './core/MapRenderer';
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

const SimplifiedMapContainer: React.FC<SimplifiedMapContainerProps> = (props) => {
  return <MapRenderer {...props} />;
};

export default SimplifiedMapContainer;
