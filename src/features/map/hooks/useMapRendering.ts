
import { useCallback, useState, useMemo } from 'react';
import { useMapOptions } from './useMapOptions';
import { LatLng } from '../types';

export const useMapRendering = () => {
  const { mapOptions } = useMapOptions();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapIdle = useCallback((onMapIdle?: (center: LatLng, zoom: number) => void) => {
    if (map && onMapIdle) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom !== undefined) {
        onMapIdle({ lat: center.lat(), lng: center.lng() }, zoom);
      }
    }
  }, [map]);

  const getCurrentViewportBounds = useMemo(() => {
    return map?.getBounds() || null;
  }, [map]);

  return {
    mapOptions,
    map,
    handleMapLoad,
    handleMapIdle,
    getCurrentViewportBounds
  };
};
