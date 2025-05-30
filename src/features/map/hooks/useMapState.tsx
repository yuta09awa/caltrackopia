
import { useState } from 'react';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
}

// Sample test markers that correspond to actual location IDs from mockLocations
const TEST_MARKERS: MarkerData[] = [
  {
    position: { lat: 40.7589, lng: -73.9851 }, // Times Square area
    locationId: 'loc-1', // This should match an actual location ID
    type: 'restaurant'
  },
  {
    position: { lat: 40.7505, lng: -73.9934 }, // Herald Square area  
    locationId: 'loc-2', // This should match an actual location ID
    type: 'restaurant'
  },
  {
    position: { lat: 40.7614, lng: -73.9776 }, // Central Park area
    locationId: 'loc-3', // This should match an actual location ID
    type: 'grocery'
  }
];

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: { lat: 40.7589, lng: -73.9851 }, // NYC coordinates
    zoom: 12,
    markers: TEST_MARKERS
  });
  
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const updateCenter = (newCenter: LatLng) => {
    setMapState(prevState => ({
      ...prevState,
      center: newCenter
    }));
  };

  const updateZoom = (newZoom: number) => {
    setMapState(prevState => ({
      ...prevState,
      zoom: newZoom
    }));
  };

  const updateMarkers = (newMarkers: MarkerData[]) => {
    setMapState(prevState => ({
      ...prevState,
      markers: newMarkers
    }));
  };

  const selectLocation = (locationId: string | null) => {
    setSelectedLocationId(locationId);
  };

  const hoverLocation = (locationId: string | null) => {
    setHoveredLocationId(locationId);
  };

  return {
    mapState,
    selectedLocationId,
    hoveredLocationId,
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    hoverLocation
  };
};
