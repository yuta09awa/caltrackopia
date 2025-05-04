
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
        // Using a custom SVG path instead of the non-existent SymbolPath.MARKER
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        scale: 1.2,
        fillColor: "#22C55E",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        // Add anchor to position the marker correctly
        anchor: new google.maps.Point(0, 0)
      };
    }
    return undefined; // Use default marker
  }, []);

  return {
    getUserLocationIcon,
    getMarkerIcon,
  };
};
