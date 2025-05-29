
import React from "react";
import { Marker } from "@react-google-maps/api";

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  isSelected?: boolean;
}

interface MapMarkersProps {
  userLocation: { lat: number; lng: number } | null;
  markers: MarkerData[];
  onMarkerClick?: (markerId: string, event?: google.maps.MapMouseEvent) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  userLocation, 
  markers,
  onMarkerClick
}) => {
  const getUserLocationIcon = () => ({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  });
  
  const getMarkerIcon = (isSelected?: boolean) => {
    if (isSelected) {
      return {
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        scale: 1.4,
        fillColor: "#22C55E",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
        anchor: new google.maps.Point(0, 0)
      };
    }
    return undefined; // Use default marker
  };
  
  const handleMarkerClick = (markerId: string) => (event: google.maps.MapMouseEvent) => {
    if (onMarkerClick) {
      onMarkerClick(markerId, event);
    }
  };

  return (
    <>
      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Location"
          icon={getUserLocationIcon()}
        />
      )}
      
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          onClick={handleMarkerClick(marker.id)}
          icon={getMarkerIcon(marker.isSelected)}
        />
      ))}
    </>
  );
};

export default MapMarkers;
