
import React, { useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MapMarkers from './MapMarkers';
import { CoreMapState } from '@/features/map/hooks/useCoreMapState';
import { useMapOptions } from '../hooks/useMapOptions';
import { LatLng } from '../types';

interface CoreMapViewProps {
  mapState: CoreMapState;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const CoreMapView: React.FC<CoreMapViewProps> = ({
  mapState,
  onMarkerClick,
  onLocationSelect,
  onMapLoaded,
  onMapIdle
}) => {
  const { mapOptions } = useMapOptions();

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    onMapLoaded?.(map);
  }, [onMapLoaded]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    onMarkerClick?.(locationId, position);
    onLocationSelect?.(locationId);
  }, [onMarkerClick, onLocationSelect]);

  const handleMapClick = useCallback(() => {
    onLocationSelect?.('');
  }, [onLocationSelect]);

  const handleMapIdle = useCallback(() => {
    // This will be called by the Google Maps API after the map becomes idle
    // We can get the current center and zoom from the map state
    if (onMapIdle) {
      onMapIdle(mapState.center, mapState.zoom);
    }
  }, [onMapIdle, mapState.center, mapState.zoom]);

  return (
    <GoogleMap
      onLoad={handleMapLoad}
      onIdle={handleMapIdle}
      zoom={mapState.zoom}
      center={mapState.center}
      mapContainerClassName="w-full h-full"
      options={mapOptions}
      onClick={handleMapClick}
    >
      <MapMarkers
        markers={mapState.markers}
        selectedLocationId={mapState.selectedLocationId}
        hoveredLocationId={null}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={() => {}}
      />
    </GoogleMap>
  );
};

export default CoreMapView;
