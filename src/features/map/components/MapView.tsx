import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MarkerData } from '../types';
import MapMarkers from './MapMarkers';
import { usePlacesApi } from '../hooks/usePlacesApi';
import { MapState } from '@/features/map/hooks/useMapState';

interface MapViewProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  searchQuery?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  mapState,
  selectedLocationId,
  onMarkerClick,
  onLocationSelect,
  searchQuery
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [placesMarkers, setPlacesMarkers] = useState<MarkerData[]>([]);
  
  const { searchPlacesByText, searchNearbyPlaces, loading: placesLoading } = usePlacesApi();

  const onCameraChanged = useCallback(() => {
    if (!mapRef.current) return;
    
    const newCenter = mapRef.current.getCenter();
    const newZoom = mapRef.current.getZoom();
    
    if (newCenter && newZoom !== undefined) {
      const centerLat = Number(newCenter.lat().toFixed(6));
      const centerLng = Number(newCenter.lng().toFixed(6));
      const roundedZoom = Math.round(newZoom * 100) / 100;
      
      // Only update if values have actually changed significantly
      const centerChanged = Math.abs(centerLat - mapState.center.lat) > 0.000001 || 
                           Math.abs(centerLng - mapState.center.lng) > 0.000001;
      const zoomChanged = Math.abs(roundedZoom - mapState.zoom) > 0.01;
      
      if (centerChanged) {
        // updateCenter({ lat: centerLat, lng: centerLng });
      }
      
      if (zoomChanged) {
        // updateZoom(roundedZoom);
      }
    }
  }, [mapState.center, mapState.zoom]);

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

  // Search for places based on search query
  const searchPlaces = useCallback(async () => {
    if (!mapRef.current) return;
    
    try {
      if (searchQuery && searchQuery.trim()) {
        console.log('Searching for places with query:', searchQuery);
        const places = await searchPlacesByText(mapRef.current, searchQuery, mapState.center);
        setPlacesMarkers(places);
      } else {
        // Only load nearby places if there's no active search
        console.log('Loading nearby places (no search query)');
        const places = await searchNearbyPlaces(mapRef.current, mapState.center);
        setPlacesMarkers(places);
      }
    } catch (error) {
      console.error('Failed to search places:', error);
    }
  }, [searchPlacesByText, searchNearbyPlaces, mapState.center, searchQuery]);

  // Update places when search query changes or map loads
  useEffect(() => {
    if (mapRef.current) {
      searchPlaces();
    }
  }, [searchPlaces]);

  // Determine which markers to show
  // Priority: search results from ingredients > places search results > default nearby places
  const allMarkers = mapState.markers.length > 0 
    ? mapState.markers  // Show ingredient location search results first
    : placesMarkers;    // Fall back to places API results

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
    gestureHandling: 'greedy',
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    clickableIcons: false,
    styles: mapStyles,
  };

  return (
    <GoogleMap
      onLoad={(map) => {
        mapRef.current = map;
        // Search places after map is loaded
        searchPlaces();
      }}
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
        markers={allMarkers}
        selectedLocationId={selectedLocationId}
        hoveredLocationId={hoveredLocationId}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={setHoveredLocationId}
      />
      
      {placesLoading && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md text-sm">
          {searchQuery ? `Searching for ${searchQuery}...` : 'Loading nearby restaurants...'}
        </div>
      )}
    </GoogleMap>
  );
};

export default MapView;
