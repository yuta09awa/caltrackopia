
import React, { useCallback, useState, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import OptimizedMapMarkers from './OptimizedMapMarkers';
import { useMapOptions } from '../hooks/useMapOptions';
import { MarkerData } from '../types';
import { LatLng } from '../hooks/useMapState';

interface CoreMapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId?: string | null;
}

interface CoreMapViewProps {
  mapState: CoreMapState;
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  viewportBounds?: google.maps.LatLngBounds | null;
}

const CoreMapView: React.FC<CoreMapViewProps> = ({
  mapState,
  selectedLocationId,
  hoveredLocationId,
  onMarkerClick,
  onMarkerHover,
  onLocationSelect,
  onMapLoaded,
  onMapIdle,
  viewportBounds
}) => {
  const { mapOptions } = useMapOptions();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    onMapLoaded?.(mapInstance);
  }, [onMapLoaded]);

  const handleMapIdle = useCallback(() => {
    if (map && onMapIdle) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom !== undefined) {
        onMapIdle({ lat: center.lat(), lng: center.lng() }, zoom);
      }
    }
  }, [map, onMapIdle]);

  // Get current viewport bounds for marker optimization
  const currentViewportBounds = useMemo(() => {
    return map?.getBounds() || viewportBounds;
  }, [map, viewportBounds]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    onMarkerClick?.(locationId, position);
    onLocationSelect?.(locationId);
  }, [onMarkerClick, onLocationSelect]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapState.center}
      zoom={mapState.zoom}
      options={mapOptions}
      onLoad={handleMapLoad}
      onIdle={handleMapIdle}
    >
      <OptimizedMapMarkers
        markers={mapState.markers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={onMarkerHover}
        viewportBounds={currentViewportBounds}
      />
    </GoogleMap>
  );
};

export default React.memo(CoreMapView);
