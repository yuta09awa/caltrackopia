export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  id: string; // Changed from locationId to id for consistency
  position: LatLng;
}

// New unified types
export * from './unified';
