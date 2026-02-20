export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  id: string;
  position: LatLng;
}

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}

// New unified types
export * from './unified';
