
import { MarkerData, LatLng } from './index';

export interface UnifiedMapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface MapViewProps {
  mapState: UnifiedMapState;
  height?: string;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  viewportBounds?: google.maps.LatLngBounds | null;
}

export interface MapRendererProps extends MapViewProps {
  height: string;
}

// Re-export LatLng to fix import issues
export { LatLng, MarkerData } from './index';
