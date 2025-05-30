
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

  // Conditionally use useLoadScript - only when we have an API key
  const shouldLoadScript = Boolean(apiKey && !loading && !error);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  console.log('MapContainer render state:', { 
    loading, 
    error, 
    apiKey: apiKey ? 'present' : 'missing', 
    shouldLoadScript,
    isLoaded, 
    loadError: loadError?.message,
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom
  });

  // Show loading while fetching API key
  if (loading) {
    return <MapLoadingState height={height} type="loading" />;
  }

  // Show error if API key fetch failed or Google Maps failed to load
  if (error || loadError) {
    console.error('Map error details:', { error, loadError: loadError?.message });
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={error || loadError?.message} 
      />
    );
  }

  // Don't render until we have both API key and script loaded
  if (!apiKey || !isLoaded) {
    console.log('Waiting for API key and script load:', { apiKey: !!apiKey, isLoaded });
    return <MapLoadingState height={height} type="initializing" />;
  }

  console.log('Rendering MapView with markers:', mapState.markers);

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

export default MapContainer;
