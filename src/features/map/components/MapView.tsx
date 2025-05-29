import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, LatLng } from '@react-google-maps/api';
import { Map } from "@react-google-maps/api";
import { MarkerData } from '../hooks/useMapState';
import MapMarkers from './MapMarkers';

interface MapViewProps {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  center, 
  zoom, 
  markers,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onCameraChanged = () => {
    if (mapRef.current) {
      // console.log('center', mapRef.current.getCenter()?.toJSON());
      // console.log('zoom', mapRef.current.getZoom());
    }
  };

  const handleMarkerClick = (locationId: string, position: { x: number; y: number }) => {
    if (onMarkerClick) {
      onMarkerClick(locationId, position);
    }
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  };

  return (
    <Map
      ref={mapRef}
      zoom={zoom}
      center={center}
      onCameraChanged={onCameraChanged}
      mapId="bf51a910020fa25a"
      className="w-full h-full"
      onClick={() => {
        // Clear selection when clicking on empty map area
        if (onLocationSelect) {
          onLocationSelect('');
        }
      }}
    >
      <MapMarkers 
        markers={markers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={setHoveredLocationId}
      />
    </Map>
  );
};

export default MapView;
