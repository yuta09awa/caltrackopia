
import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
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
        const data = await response.json();

        if (data && data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError('Failed to load API key from /api/get-google-maps-api-key');
        }
      } catch (e: any) {
        setError(`Failed to load API key: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['marker'],
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

  if (error) {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!isLoaded || !apiKey) {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
          Failed to load map. Please check your API key.
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

  const handleMapLoad = React.useCallback((map: google.maps.Map) => {
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
      ref={handleMapLoad}
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
