
import React, { useCallback, useState, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import OptimizedMapMarkers from '../OptimizedMapMarkers';
import { useMapOptions } from '../../hooks/useMapOptions';
import { MapViewProps } from '../../types/unified';
import { LatLng } from '../../types';

const UnifiedMapView: React.FC<MapViewProps> = ({
  mapState,
  onMarkerClick,
  onMarkerHover,
  onLocationSelect,
  onMapLoaded,
  onMapIdle,
  viewportBounds
}) => {
  const { mapOptions } = useMapOptions();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Get current viewport bounds
  const getCurrentViewportBounds = useMemo(() => {
    return map?.getBounds() || null;
  }, [map]);

  const handleMapLoadComplete = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    onMapLoaded?.(mapInstance);
  }, [onMapLoaded]);

  const handleMapIdleComplete = useCallback(() => {
    if (map && onMapIdle) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom !== undefined) {
        onMapIdle({ lat: center.lat(), lng: center.lng() }, zoom);
      }
    }
  }, [map, onMapIdle]);

  const handleMapClick = useCallback(() => {
    onLocationSelect?.('');
  }, [onLocationSelect]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    onMarkerClick?.(locationId, position);
    onLocationSelect?.(locationId);
  }, [onMarkerClick, onLocationSelect]);

  const currentViewportBounds = getCurrentViewportBounds || viewportBounds;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapState.center}
      zoom={mapState.zoom}
      options={mapOptions}
      onLoad={handleMapLoadComplete}
      onIdle={handleMapIdleComplete}
      onClick={handleMapClick}
    >
      <OptimizedMapMarkers
        markers={mapState.markers}
        selectedLocationId={mapState.selectedLocationId}
        hoveredLocationId={mapState.hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={onMarkerHover}
        viewportBounds={currentViewportBounds}
      />
    </GoogleMap>
  );
};

export default React.memo(UnifiedMapView);
