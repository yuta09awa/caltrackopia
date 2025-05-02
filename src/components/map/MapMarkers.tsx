
import React from "react";
import { Marker } from "@react-google-maps/api";

interface MapMarkersProps {
  userLocation: { lat: number; lng: number } | null;
  markers: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  userLocation, 
  markers,
  onMarkerClick
}) => {
  const handleMarkerClick = (markerId: string) => {
    if (onMarkerClick) {
      onMarkerClick(markerId);
    }
  };

  return (
    <>
      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Location"
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />
      )}
      
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          onClick={() => handleMarkerClick(marker.id)}
        />
      ))}
    </>
  );
};

export default MapMarkers;
