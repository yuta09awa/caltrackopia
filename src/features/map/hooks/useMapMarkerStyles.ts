
import { useCallback } from "react";

export interface MarkerIconOptions {
  fillColor?: string;
  strokeColor?: string;
  strokeWeight?: number;
  scale?: number;
}

export type MarkerType = 'user' | 'selected' | 'default' | 'highlighted';

export const useMapMarkerStyles = () => {
  const getUserLocationIcon = useCallback((options?: MarkerIconOptions) => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: options?.scale || 8,
      fillColor: options?.fillColor || "#4285F4",
      fillOpacity: 1,
      strokeColor: options?.strokeColor || "#ffffff",
      strokeWeight: options?.strokeWeight || 2,
    };
  }, []);

  const getMarkerIcon = useCallback((isSelected?: boolean, options?: MarkerIconOptions) => {
    if (isSelected) {
      return {
        // Custom SVG path for map pin shape
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        scale: options?.scale || 1.2,
        fillColor: options?.fillColor || "#22C55E",
        fillOpacity: 1,
        strokeColor: options?.strokeColor || "#ffffff",
        strokeWeight: options?.strokeWeight || 2,
        // Position the marker correctly with anchor
        anchor: new google.maps.Point(0, 0)
      };
    }
    return undefined; // Use default marker
  }, []);

  /**
   * Get marker icons for different states
   */
  const getMarkerByType = useCallback((type: MarkerType = 'default', options?: MarkerIconOptions) => {
    switch (type) {
      case 'selected':
        return getMarkerIcon(true, {
          ...options,
          fillColor: options?.fillColor || "#22C55E" // Green for selected
        });
      case 'highlighted':
        return getMarkerIcon(true, {
          ...options,
          fillColor: options?.fillColor || "#F59E0B" // Amber for highlighted
        });
      case 'user':
        return getUserLocationIcon(options);
      default:
        return undefined; // Default Google marker
    }
  }, [getMarkerIcon, getUserLocationIcon]);

  return {
    getUserLocationIcon,
    getMarkerIcon,
    getMarkerByType
  };
};
