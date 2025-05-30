
import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useMapState } from '../hooks/useMapState';
import { useApiKeyLoader } from './ApiKeyLoader';
import MapLoadingState from './MapLoadingState';
import MapView from './MapView';
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
  const { apiKey, error, loading } = useApiKeyLoader();

  console.log('MapContainer render state:', { 
    loading, 
    error, 
    apiKey: apiKey ? 'present' : 'missing', 
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom
  });

  // Show loading while fetching API key
  if (loading) {
    return <MapLoadingState height={height} type="loading" />;
  }

  // Show error if API key fetch failed
  if (error) {
    console.error('Map error details:', { error });
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={error} 
      />
    );
  }

  // Don't render map component until we have API key
  if (!apiKey) {
    console.log('Waiting for API key...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  // Now we can safely render the map with the API key
  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <MapWithScript
        apiKey={apiKey}
        center={mapState.center}
        zoom={mapState.zoom}
        markers={mapState.markers}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        updateCenter={updateCenter}
        updateZoom={updateZoom}
        height={height}
      />
    </div>
  );
};

// Separate component that handles the Google Maps script loading
const MapWithScript: React.FC<{
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  markers: any[];
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  updateCenter: (center: { lat: number; lng: number }) => void;
  updateZoom: (zoom: number) => void;
  height: string;
}> = ({ 
  apiKey, 
  center, 
  zoom, 
  markers, 
  selectedLocationId, 
  onMarkerClick, 
  onLocationSelect, 
  updateCenter, 
  updateZoom,
  height 
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  console.log('MapWithScript state:', { 
    apiKey: 'present',
    isLoaded, 
    loadError: loadError?.message,
    markersCount: markers.length
  });

  // Show error if Google Maps failed to load
  if (loadError) {
    console.error('Google Maps load error:', loadError.message);
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={loadError.message} 
      />
    );
  }

  // Wait for script to load
  if (!isLoaded) {
    console.log('Waiting for Google Maps script to load...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  console.log('Rendering MapView with markers:', markers);

  return (
    <MapView
      center={center}
      zoom={zoom}
      markers={markers}
      selectedLocationId={selectedLocationId}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      updateCenter={updateCenter}
      updateZoom={updateZoom}
    />
  );
};

export default MapContainer;
