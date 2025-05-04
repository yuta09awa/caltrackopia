
import React from "react";
import { Marker } from "@react-google-maps/api";
import { useMapMarkerStyles } from "./hooks/useMapMarkerStyles";

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  isSelected?: boolean;
}

interface MapMarkersProps {
  userLocation: { lat: number; lng: number } | null;
  markers: MarkerData[];
  onMarkerClick?: (markerId: string) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  userLocation, 
  markers,
  onMarkerClick
}) => {
  const { getUserLocationIcon, getMarkerIcon } = useMapMarkerStyles();
  
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
          icon={getUserLocationIcon()}
        />
      )}
      
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          onClick={() => handleMarkerClick(marker.id)}
          icon={getMarkerIcon(marker.isSelected)}
        />
      ))}
    </>
  );
};

export default MapMarkers;
