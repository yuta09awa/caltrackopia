
import React, { useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MapMarkers from './MapMarkers';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';
import { useMapOptions } from '../hooks/useMapOptions';
import { useMapCamera } from '../hooks/useMapCamera';

interface MapViewProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  mapState,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  onMapLoaded,
  onMapIdle
}) => {
  const { mapOptions } = useMapOptions();
  const { mapRef, onLoad, onCameraChanged } = useMapCamera({ mapState, onMapIdle });

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    onLoad(map);
    if (onMapLoaded) {
      onMapLoaded(map);
    }
  }, [onLoad, onMapLoaded]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    if (onMarkerClick) {
      onMarkerClick(locationId, position);
    }
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  }, [onMarkerClick, onLocationSelect]);

  const handleMapClick = useCallback(() => {
    // Clear selection when clicking on empty map area
    if (onLocationSelect) {
      onLocationSelect('');
    }
  }, [onLocationSelect]);

  return (
    <GoogleMap
      onLoad={handleMapLoad}
      zoom={mapState.zoom}
      center={mapState.center}
      onCenterChanged={onCameraChanged}
      onZoomChanged={onCameraChanged}
      mapContainerClassName="w-full h-full"
      options={mapOptions}
      onClick={handleMapClick}
    >
      <MapMarkers 
        markers={mapState.markers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={mapState.hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={(locationId) => {
          // Handle marker hover if needed in future
          console.log('Marker hover:', locationId);
        }}
      />
    </GoogleMap>
  );
};

export default MapView;
