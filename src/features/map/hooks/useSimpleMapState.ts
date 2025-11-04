
import { useState, useCallback } from 'react';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  id: string;
  type: string;
}

export interface SimpleMapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
}

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 }; // NYC
const DEFAULT_ZOOM = 12;

/**
 * @deprecated This hook is legacy. Please migrate to useConsolidatedMap instead.
 * @see useConsolidatedMap
 * @see {@link file://./docs/migrations/legacy-map-hooks.md Migration Guide}
 */
export const useSimpleMapState = (initialCenter?: LatLng, initialZoom?: number) => {
  const [mapState, setMapState] = useState<SimpleMapState>({
    center: initialCenter || DEFAULT_CENTER,
    zoom: initialZoom || DEFAULT_ZOOM,
    markers: [],
    selectedLocationId: null
  });

  const updateCenter = useCallback((center: LatLng) => {
    setMapState(prev => ({ ...prev, center }));
  }, []);

  const updateZoom = useCallback((zoom: number) => {
    setMapState(prev => ({ ...prev, zoom }));
  }, []);

  const updateMarkers = useCallback((markers: MarkerData[]) => {
    setMapState(prev => ({ ...prev, markers }));
  }, []);

  const selectLocation = useCallback((locationId: string | null) => {
    setMapState(prev => ({ ...prev, selectedLocationId: locationId }));
  }, []);

  const clearMarkers = useCallback(() => {
    setMapState(prev => ({ ...prev, markers: [] }));
  }, []);

  return {
    mapState,
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    clearMarkers
  };
};
