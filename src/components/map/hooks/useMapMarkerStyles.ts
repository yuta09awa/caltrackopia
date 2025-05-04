
import { useCallback } from "react";

export const useMapMarkerStyles = () => {
  const getUserLocationIcon = useCallback(() => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  }, []);

  const getMarkerIcon = useCallback((isSelected?: boolean) => {
    if (isSelected) {
      return {
        path: google.maps.SymbolPath.MARKER,
        scale: 1.2,
        fillColor: "#22C55E",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      };
    }
    return undefined; // Use default marker
  }, []);

  return {
    getUserLocationIcon,
    getMarkerIcon,
  };
};
