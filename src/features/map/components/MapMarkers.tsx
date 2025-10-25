
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { MarkerData } from '../types';
import { useMapMarkers } from '../hooks/useMapMarkers';
import { ComponentErrorBoundary } from '@/features/errors/components/GlobalErrorBoundary';

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
    <ComponentErrorBoundary>
      <>
        {memoizedMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.markerIcon}
            onClick={handleMarkerClick(marker.id, onMarkerClick)}
            onMouseOver={() => onMarkerHover?.(marker.id)}
            onMouseOut={() => onMarkerHover?.(null)}
            zIndex={marker.isSelected ? 1000 : marker.isHovered ? 999 : 1}
          />
        ))}
      </>
    </ComponentErrorBoundary>
  );
};

export default MapMarkers;
