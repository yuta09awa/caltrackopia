
import React, { useMemo } from 'react';
import { Marker } from '@react-google-maps/api';
import { MarkerData } from '../types';
import { useMapMarkers } from '../hooks/useMapMarkers';

interface OptimizedMapMarkersProps {
  markers: MarkerData[];
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
  viewportBounds?: google.maps.LatLngBounds | null;
}

const MARKER_LIMIT = 100; // Limit markers for performance

const OptimizedMapMarkers: React.FC<OptimizedMapMarkersProps> = ({ 
  markers, 
  selectedLocationId,
  hoveredLocationId,
  onMarkerClick,
  onMarkerHover,
  viewportBounds
}) => {
  const { memoizedMarkers, handleMarkerClick } = useMapMarkers({
    markers,
    selectedLocationId,
    hoveredLocationId
  });

  // Filter markers based on viewport bounds and limit count
  const visibleMarkers = useMemo(() => {
    let filteredMarkers = memoizedMarkers;

    // Filter by viewport bounds if available
    if (viewportBounds) {
      filteredMarkers = filteredMarkers.filter(marker => 
        viewportBounds.contains(new google.maps.LatLng(marker.position.lat, marker.position.lng))
      );
    }

    // Limit marker count for performance
    if (filteredMarkers.length > MARKER_LIMIT) {
      // Prioritize selected and hovered markers
      const priorityMarkers = filteredMarkers.filter(m => 
        m.isSelected || m.isHovered
      );
      const otherMarkers = filteredMarkers.filter(m => 
        !m.isSelected && !m.isHovered
      ).slice(0, MARKER_LIMIT - priorityMarkers.length);
      
      filteredMarkers = [...priorityMarkers, ...otherMarkers];
    }

    return filteredMarkers;
  }, [memoizedMarkers, viewportBounds]);

  return (
    <>
      {visibleMarkers.map((marker) => (
        <Marker
          key={marker.locationId}
          position={marker.position}
          icon={marker.markerIcon}
          onClick={handleMarkerClick(marker.locationId, onMarkerClick)}
          onMouseOver={() => onMarkerHover?.(marker.locationId)}
          onMouseOut={() => onMarkerHover?.(null)}
          zIndex={marker.isSelected ? 1000 : marker.isHovered ? 999 : 1}
          optimized={true} // Enable marker optimization
        />
      ))}
    </>
  );
};

export default React.memo(OptimizedMapMarkers);
