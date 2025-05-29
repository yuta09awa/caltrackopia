
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

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: { lat: 40.7589, lng: -73.9851 }, // NYC coordinates
    zoom: 12,
    markers: []
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
