
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MapMarkers from './MapMarkers';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface MapViewProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  mapState,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  searchQuery,
  onMapLoaded,
  onMapIdle
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced camera change handler - waits 300ms after user stops interacting
  const onCameraChanged = useCallback(() => {
    if (!mapRef.current || !onMapIdle) return;
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      if (!mapRef.current) return;
      
      const newCenter = mapRef.current.getCenter();
      const newZoom = mapRef.current.getZoom();
      
      if (newCenter && newZoom !== undefined) {
        const centerLat = Number(newCenter.lat().toFixed(6));
        const centerLng = Number(newCenter.lng().toFixed(6));
        const roundedZoom = Math.round(newZoom * 100) / 100;
        
        // Only update if values have changed significantly
        const centerChanged = Math.abs(centerLat - mapState.center.lat) > 0.000001 || 
                             Math.abs(centerLng - mapState.center.lng) > 0.000001;
        const zoomChanged = Math.abs(roundedZoom - mapState.zoom) > 0.01;
        
        if (centerChanged || zoomChanged) {
          onMapIdle({ lat: centerLat, lng: centerLng }, roundedZoom);
        }
      }
    }, 300); // 300ms debounce
  }, [mapState.center, mapState.zoom, onMapIdle]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Notify parent that map is loaded
    if (onMapLoaded) {
      onMapLoaded(map);
    }
  }, [onMapLoaded]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    if (onMarkerClick) {
      onMarkerClick(locationId, position);
    }
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  }, [onMarkerClick, onLocationSelect]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Memoize map styles to prevent recreation on every render
  const mapStyles = useMemo(() => [
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
  ], []);

  // Memoize Google Maps options to prevent recreation on every render
  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    clickableIcons: false,
    styles: mapStyles,
  }), [mapStyles]);

  // Memoize markers to prevent unnecessary re-renders
  const memoizedMarkers = useMemo(() => mapState.markers, [mapState.markers]);

  return (
    <GoogleMap
      onLoad={onLoad}
      zoom={mapState.zoom}
      center={mapState.center}
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
        markers={memoizedMarkers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={mapState.hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={(locationId) => {
          // Handle marker hover if needed in future
          console.log('Marker hover:', locationId);
        }}
      />
    </GoogleMap>
  );
};

export default MapView;
