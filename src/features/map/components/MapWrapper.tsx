
import React from 'react';
import MapContainer from './MapContainer';
import { useMapStore } from '../hooks/useMapStore';

interface MapWrapperProps {
  height: string;
  onLocationSelect?: (locationId: string) => void;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: { lat: number; lng: number }, zoom: number) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ 
  height,
  onLocationSelect,
  onMarkerClick,
  onMapLoaded,
  onMapIdle
}) => {
  const { mapState, currentSearchQuery } = useMapStore();

  return (
    <MapContainer 
      height={height}
      selectedIngredient={null}
      onLocationSelect={onLocationSelect}
      selectedLocationId={mapState.selectedLocationId}
      onMarkerClick={onMarkerClick}
      mapState={mapState}
      searchQuery={currentSearchQuery}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default MapWrapper;
