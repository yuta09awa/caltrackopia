
import React, { useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MapMarkers from './MapMarkers';
import { LatLng, MarkerData } from '@/features/map/types';
import { useMapOptions } from '../hooks/useMapOptions';

export interface SimpleMapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
}

interface SimpleMapViewProps {
  mapState: SimpleMapState;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const SimpleMapView: React.FC<SimpleMapViewProps> = ({ 
  mapState,
  onMarkerClick,
  onLocationSelect,
  onMapLoaded,
  onMapIdle
}) => {
  const { mapOptions } = useMapOptions();

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    if (onMapLoaded) {
      onMapLoaded(map);
    }
  }, [onMapLoaded]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    if (onMarkerClick) {
      onMarkerClick(locationId, position);
    }
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  }, [onMarkerClick, onLocationSelect]);

  const handleMapClick = useCallback(() => {
    if (onLocationSelect) {
      onLocationSelect('');
    }
  }, [onLocationSelect]);

  const handleCameraChanged = useCallback(() => {
    // Debounced camera change handler can be added here if needed
  }, []);

  const handleMapIdle = useCallback(() => {
    if (onMapIdle) {
      const map = window.google?.maps ? document.querySelector('.gm-style')?.closest('[data-map-id]') : null;
      // We'll get the map instance from the onLoad callback instead
      // This is a simpler approach that doesn't require complex map instance tracking
    }
  }, [onMapIdle]);

  return (
    <GoogleMap
      onLoad={handleMapLoad}
      onIdle={handleMapIdle}
      zoom={mapState.zoom}
      center={mapState.center}
      onCenterChanged={handleCameraChanged}
      onZoomChanged={handleCameraChanged}
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

export default SimpleMapView;
