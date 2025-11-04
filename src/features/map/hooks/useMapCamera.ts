
import { useRef, useCallback, useEffect } from 'react';
import { LatLng } from './useMapState';

interface UseMapCameraProps {
  mapState: {
    center: LatLng;
    zoom: number;
  };
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

/**
 * @deprecated This hook is legacy. Please migrate to useConsolidatedMap instead.
 * @see useConsolidatedMap
 * @see {@link file://./docs/migrations/legacy-map-hooks.md Migration Guide}
 */
export const useMapCamera = ({ mapState, onMapIdle }: UseMapCameraProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced camera change handler - waits 300ms after user stops interacting
  const onCameraChanged = useCallback(() => {
    if (!mapRef.current || !onMapIdle) return;
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      if (!mapRef.current) return;
      
      const newCenter = mapRef.current.getCenter();
      const newZoom = mapRef.current.getZoom();
      
      if (newCenter && newZoom !== undefined) {
        const centerLat = Number(newCenter.lat().toFixed(6));
        const centerLng = Number(newCenter.lng().toFixed(6));
        const roundedZoom = Math.round(newZoom * 100) / 100;
        
        // Only update if values have changed significantly
        const centerChanged = Math.abs(centerLat - mapState.center.lat) > 0.000001 || 
                             Math.abs(centerLng - mapState.center.lng) > 0.000001;
        const zoomChanged = Math.abs(roundedZoom - mapState.zoom) > 0.01;
        
        if (centerChanged || zoomChanged) {
          onMapIdle({ lat: centerLat, lng: centerLng }, roundedZoom);
        }
      }
    }, 300); // 300ms debounce
  }, [mapState.center, mapState.zoom, onMapIdle]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    mapRef,
    onLoad,
    onCameraChanged
  };
};
