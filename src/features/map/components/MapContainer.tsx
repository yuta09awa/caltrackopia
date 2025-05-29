
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useMapState } from '../hooks/useMapState';
import MapMarkers from './MapMarkers';
import { MarkerData } from '../types';
import { Ingredient } from '@/hooks/useIngredientSearch';

interface MapContainerProps {
  height: string;
  selectedIngredient?: Ingredient | null;
  onLocationSelect?: (locationId: string) => void;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
}

// Define libraries array outside component to prevent re-renders
const libraries: ("marker")[] = ['marker'];

const MapContainer: React.FC<MapContainerProps> = ({ 
  height, 
  selectedIngredient, 
  onLocationSelect,
  selectedLocationId,
  onMarkerClick
}) => {
  const { mapState, updateCenter, updateZoom } = useMapState();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/get-google-maps-api-key');
        
        // Check if the response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If it's not JSON, it means the API endpoint doesn't exist
          setError('Google Maps API key not configured. Please set up the API endpoint.');
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data && data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError('Google Maps API key not found in response');
        }
      } catch (e: any) {
        // Handle both network errors and JSON parsing errors
        if (e.message.includes('Unexpected token')) {
          setError('Google Maps API endpoint not configured properly');
        } else {
          setError(`Failed to load API key: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
  });

  if (loading) {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
          Loading map...
        </div>
      </div>
    );
  }

  if (error || loadError) {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
          <div className="text-sm font-medium mb-2">Map Configuration Required</div>
          <div className="text-xs">
            {error || loadError?.message || 'Failed to load Google Maps'}
          </div>
          <div className="text-xs mt-2 opacity-90">
            To use maps, please set up a Google Maps API key endpoint.
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded || !apiKey) {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
          Initializing map...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <MapView
        center={mapState.center}
        zoom={mapState.zoom}
        markers={mapState.markers}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        updateCenter={updateCenter}
        updateZoom={updateZoom}
      />
    </div>
  );
};

interface MapViewProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  updateCenter: (center: any) => void;
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
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const onCameraChanged = React.useCallback(() => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    const newZoom = mapRef.current.getZoom();
    
    if (newCenter) {
      updateCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
    if (newZoom) {
      updateZoom(newZoom);
    }
  }, [updateCenter, updateZoom]);

  const onLoad = React.useCallback((map: google.maps.Map) => {
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

  return (
    <GoogleMap
      onLoad={onLoad}
      zoom={zoom}
      center={center}
      onCenterChanged={onCameraChanged}
      onZoomChanged={onCameraChanged}
      mapContainerClassName="w-full h-full"
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

export default MapContainer;
