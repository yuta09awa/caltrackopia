
import { useState, useCallback } from 'react';
import { LatLng, MarkerData } from '../types';

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}

// Sample test markers - only restaurants to limit popups to food locations
const TEST_MARKERS: MarkerData[] = [
  {
    position: { lat: 40.7589, lng: -73.9851 }, // Times Square area
    id: 'loc-1' // This should match an actual location ID
  },
  {
    position: { lat: 40.7505, lng: -73.9934 }, // Herald Square area  
    id: 'loc-2' // This should match an actual location ID
  }
];

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: { lat: 40.7589, lng: -73.9851 }, // NYC coordinates
    zoom: 12,
    markers: TEST_MARKERS,
    selectedLocationId: null,
    hoveredLocationId: null
  });

  const updateCenter = useCallback((newCenter: LatLng) => {
    setMapState(prevState => ({
      ...prevState,
      center: newCenter
    }));
  }, []);

  const updateZoom = useCallback((newZoom: number) => {
    setMapState(prevState => ({
      ...prevState,
      zoom: newZoom
    }));
  }, []);

  const updateMarkers = useCallback((newMarkers: MarkerData[]) => {
    setMapState(prevState => ({
      ...prevState,
      markers: newMarkers
    }));
  }, []);

  const selectLocation = useCallback((locationId: string | null) => {
    setMapState(prevState => ({
      ...prevState,
      selectedLocationId: locationId
    }));
  }, []);

  const hoverLocation = useCallback((locationId: string | null) => {
    setMapState(prevState => ({
      ...prevState,
      hoveredLocationId: locationId
    }));
  }, []);

  const clearMarkers = useCallback(() => {
    setMapState(prevState => ({
      ...prevState,
      markers: []
    }));
  }, []);

  return {
    mapState,
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    hoverLocation,
    clearMarkers
  };
};

// Re-export types for backward compatibility
export type { LatLng, MarkerData };
