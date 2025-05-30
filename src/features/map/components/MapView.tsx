import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MarkerData } from '../types';
import MapMarkers from './MapMarkers';

interface MapViewProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  updateCenter: (center: google.maps.LatLngLiteral) => void;
  updateZoom: (zoom: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  center, 
  zoom, 
  markers,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  updateCenter,
  updateZoom
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const lastCenter = useRef<google.maps.LatLngLiteral>(center);
  const lastZoom = useRef<number>(zoom);

  const onCameraChanged = useCallback(() => {
    if (!mapRef.current) return;
    
    const newCenter = mapRef.current.getCenter();
    const newZoom = mapRef.current.getZoom();
    
    if (newCenter && newZoom !== undefined) {
      const centerLat = Number(newCenter.lat().toFixed(6));
      const centerLng = Number(newCenter.lng().toFixed(6));
      const roundedZoom = Math.round(newZoom * 100) / 100;
      
      // Only update if values have actually changed significantly
      const centerChanged = Math.abs(centerLat - lastCenter.current.lat) > 0.000001 || 
                           Math.abs(centerLng - lastCenter.current.lng) > 0.000001;
      const zoomChanged = Math.abs(roundedZoom - lastZoom.current) > 0.01;
      
      if (centerChanged) {
        const newCenterObj = { lat: centerLat, lng: centerLng };
        lastCenter.current = newCenterObj;
        updateCenter(newCenterObj);
      }
      
      if (zoomChanged) {
        lastZoom.current = roundedZoom;
        updateZoom(roundedZoom);
      }
    }
  }, [updateCenter, updateZoom]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (locationId: string, position: { x: number; y: number }) => {
    if (onMarkerClick) {
      onMarkerClick(locationId, position);
    }
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  };

  // Update refs when props change
  React.useEffect(() => {
    lastCenter.current = center;
    lastZoom.current = zoom;
  }, [center, zoom]);

  // Map style to hide POI and keep only food-related locations
  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.attraction",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.government",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.medical",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.park",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.place_of_worship",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.school",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.sports_complex",
      stylers: [{ visibility: "off" }]
    }
  ];

  // Google Maps options with POI disabled and proper interaction settings
  const mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy', // Enable drag and zoom without requiring ctrl/cmd
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    clickableIcons: false, // This disables clicking on POI icons
    styles: mapStyles, // Apply custom styles to hide POI
  };

  return (
    <GoogleMap
      onLoad={onLoad}
      zoom={zoom}
      center={center}
      onCenterChanged={onCameraChanged}
      onZoomChanged={onCameraChanged}
      mapContainerClassName="w-full h-full"
      options={mapOptions}
      onClick={() => {
        // Clear selection when clicking on empty map area
        if (onLocationSelect) {
          onLocationSelect('');
        }
      }}
    >
      <MapMarkers 
        markers={markers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={setHoveredLocationId}
      />
    </GoogleMap>
  );
};

export default MapView;
