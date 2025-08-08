
import { useCallback } from 'react';
import { LatLng, MarkerData } from '../types';
import { useAppStore } from '@/store/appStore';

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}

export const useMapState = () => {
  const mapState = useAppStore((s) => s.mapState);
  const updateCenter = useAppStore((s) => s.updateCenter);
  const updateZoom = useAppStore((s) => s.updateZoom);
  const updateMarkers = useAppStore((s) => s.updateMarkers);
  const selectLocation = useAppStore((s) => s.selectLocation);
  const hoverLocation = useAppStore((s) => s.hoverLocation);
  const clearMarkers = useAppStore((s) => s.clearMarkers);

  // Keep stable callbacks (optional, mirrors previous API with useCallback)
  const setCenter = useCallback((newCenter: LatLng) => updateCenter(newCenter), [updateCenter]);
  const setZoom = useCallback((newZoom: number) => updateZoom(newZoom), [updateZoom]);
  const setMarkers = useCallback((newMarkers: MarkerData[]) => updateMarkers(newMarkers), [updateMarkers]);
  const setSelectLocation = useCallback((locationId: string | null) => selectLocation(locationId), [selectLocation]);
  const setHoverLocation = useCallback((locationId: string | null) => hoverLocation(locationId), [hoverLocation]);
  const setClearMarkers = useCallback(() => clearMarkers(), [clearMarkers]);

  return {
    mapState,
    updateCenter: setCenter,
    updateZoom: setZoom,
    updateMarkers: setMarkers,
    selectLocation: setSelectLocation,
    hoverLocation: setHoverLocation,
    clearMarkers: setClearMarkers,
  };
};

// Re-export types for backward compatibility
export type { LatLng, MarkerData };
