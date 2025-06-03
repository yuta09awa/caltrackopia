
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { MarkerData } from '../types';
import { useMapMarkers } from '../hooks/useMapMarkers';

interface MapMarkersProps {
  markers: MarkerData[];
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  markers, 
  selectedLocationId,
  hoveredLocationId,
  onMarkerClick,
  onMarkerHover
}) => {
  const { memoizedMarkers, handleMarkerClick } = useMapMarkers({
    markers,
    selectedLocationId,
    hoveredLocationId
  });

  return (
    <>
      {memoizedMarkers.map((marker) => (
        <Marker
          key={marker.locationId}
          position={marker.position}
          icon={marker.markerIcon}
          onClick={handleMarkerClick(marker.locationId, onMarkerClick)}
          onMouseOver={() => onMarkerHover?.(marker.locationId)}
          onMouseOut={() => onMarkerHover?.(null)}
          zIndex={marker.isSelected ? 1000 : marker.isHovered ? 999 : 1}
        />
      ))}
    </>
  );
};

export default MapMarkers;
