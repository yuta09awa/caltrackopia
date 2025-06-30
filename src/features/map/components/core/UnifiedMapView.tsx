
import React, { useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import OptimizedMapMarkers from '../OptimizedMapMarkers';
import { useMapRendering } from '../../hooks/useMapRendering';
import { MapViewProps } from '../../types/unified';

const UnifiedMapView: React.FC<MapViewProps> = ({
  mapState,
  onMarkerClick,
  onMarkerHover,
  onLocationSelect,
  onMapLoaded,
  onMapIdle,
  viewportBounds
}) => {
  const { mapOptions, handleMapLoad, handleMapIdle, getCurrentViewportBounds } = useMapRendering();

  const handleMapLoadComplete = useCallback((mapInstance: google.maps.Map) => {
    handleMapLoad(mapInstance);
    onMapLoaded?.(mapInstance);
  }, [handleMapLoad, onMapLoaded]);

  const handleMapIdleComplete = useCallback(() => {
    handleMapIdle(onMapIdle);
  }, [handleMapIdle, onMapIdle]);

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
