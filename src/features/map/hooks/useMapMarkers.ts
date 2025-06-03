
import { useCallback, useMemo } from 'react';
import { MarkerData } from '../types';
import { useMapMarkerStyles } from './useMapMarkerStyles';

interface UseMapMarkersProps {
  markers: MarkerData[];
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
}

export const useMapMarkers = ({
  markers,
  selectedLocationId,
  hoveredLocationId
}: UseMapMarkersProps) => {
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

  const handleMarkerClick = useCallback((
    locationId: string,
    onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void
  ) => (e: google.maps.MapMouseEvent) => {
    const domEvent = e.domEvent as MouseEvent;
    const rect = (domEvent.target as HTMLElement).getBoundingClientRect();
    onMarkerClick?.(locationId, {
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  }, []);

  return {
    memoizedMarkers,
    handleMarkerClick
  };
};
