
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useMapState } from '../hooks/useMapState';
import MapMarkers from './MapMarkers';
import { MarkerData } from '../types';
import { Ingredient } from '@/hooks/useIngredientSearch';
import { supabase } from '@/integrations/supabase/client';

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
        console.log('Fetching Google Maps API key from Edge Function...');
        
        const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');

        if (error) {
          console.error('Error calling Edge Function:', error);
          setError('Failed to load Google Maps API key');
          setLoading(false);
          return;
        }

        if (data && data.apiKey) {
          console.log('Successfully retrieved API key');
          setApiKey(data.apiKey);
        } else {
          console.error('No API key in response:', data);
          setError('Google Maps API key not found in response');
        }
      } catch (e: any) {
        console.error('Exception when fetching API key:', e);
        setError(`Failed to load API key: ${e.message}`);
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
          <div className="text-sm font-medium mb-2">Map Configuration Error</div>
          <div className="text-xs">
            {error || loadError?.message || 'Failed to load Google Maps'}
          </div>
          <div className="text-xs mt-2 opacity-90">
            Please check that your Google Maps API key is properly configured.
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
  const lastCenter = React.useRef<google.maps.LatLngLiteral>(center);
  const lastZoom = React.useRef<number>(zoom);

  const onCameraChanged = React.useCallback(() => {
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

  // Update refs when props change
  React.useEffect(() => {
    lastCenter.current = center;
    lastZoom.current = zoom;
  }, [center, zoom]);

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
