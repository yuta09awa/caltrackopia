
// Define our own LatLng interface since @react-google-maps/api doesn't export it directly
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}
