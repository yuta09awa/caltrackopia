
import React, { useMemo } from 'react';
import { Marker } from '@react-google-maps/api';
import { MarkerData } from '../types';
import { useMapMarkerStyles } from '../hooks/useMapMarkerStyles';

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
  const { getMarkerByType } = useMapMarkerStyles();

  // Memoize markers to prevent unnecessary re-renders
  const memoizedMarkers = useMemo(() => markers.map((marker) => {
    const isSelected = selectedLocationId === marker.locationId;
    const isHovered = hoveredLocationId === marker.locationId;
    
    // Determine marker type based on state
    let markerType: 'default' | 'selected' | 'highlighted' = 'default';
    if (isSelected) {
      markerType = 'selected';
    } else if (isHovered) {
      markerType = 'highlighted';
    }

    // Get the appropriate marker icon
    const markerIcon = getMarkerByType(markerType);

    return {
      ...marker,
      markerIcon,
      isSelected,
      isHovered
    };
  }), [markers, selectedLocationId, hoveredLocationId, getMarkerByType]);

  return (
    <>
      {memoizedMarkers.map((marker) => (
        <Marker
          key={marker.locationId}
          position={marker.position}
          icon={marker.markerIcon}
          onClick={(e) => {
            const domEvent = e.domEvent as MouseEvent;
            const rect = (domEvent.target as HTMLElement).getBoundingClientRect();
            onMarkerClick(marker.locationId, {
              x: rect.left + rect.width / 2,
              y: rect.top
            });
          }}
          onMouseOver={() => onMarkerHover?.(marker.locationId)}
          onMouseOut={() => onMarkerHover?.(null)}
          zIndex={marker.isSelected ? 1000 : marker.isHovered ? 999 : 1}
        />
      ))}
    </>
  );
};

export default MapMarkers;
