
import { useState, useCallback, useRef } from 'react';
import { LatLng, MarkerData } from '../types';

export interface CoreMapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
}

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 }; // NYC
const DEFAULT_ZOOM = 12;

export const useCoreMapState = (initialCenter?: LatLng, initialZoom?: number) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [mapState, setMapState] = useState<CoreMapState>({
    center: initialCenter || DEFAULT_CENTER,
    zoom: initialZoom || DEFAULT_ZOOM,
    markers: [],
    selectedLocationId: null
  });

  const updateMapState = useCallback((updates: Partial<CoreMapState>) => {
    setMapState(prev => ({ ...prev, ...updates }));
  }, []);

  const setMapRef = useCallback((map: google.maps.Map | null) => {
    mapRef.current = map;
  }, []);

  return {
    mapState,
    mapRef,
    updateMapState,
    setMapRef,
    // Convenience methods
    updateCenter: useCallback((center: LatLng) => updateMapState({ center }), [updateMapState]),
    updateZoom: useCallback((zoom: number) => updateMapState({ zoom }), [updateMapState]),
    updateMarkers: useCallback((markers: MarkerData[]) => updateMapState({ markers }), [updateMapState]),
    selectLocation: useCallback((locationId: string | null) => updateMapState({ selectedLocationId: locationId }), [updateMapState]),
    clearMarkers: useCallback(() => updateMapState({ markers: [] }), [updateMapState])
  };
};
