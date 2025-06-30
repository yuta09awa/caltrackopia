export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  locationId: string;
  position: LatLng;
}

// New unified types
export * from './unified';
