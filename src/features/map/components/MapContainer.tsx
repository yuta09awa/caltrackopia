
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

  // Only initialize useLoadScript when we have a valid API key
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
    isLoaded, 
    loadError: loadError?.message 
  });

  if (loading) {
    return <MapLoadingState height={height} type="loading" />;
  }

  if (error || loadError) {
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
    return <MapLoadingState height={height} type="initializing" />;
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

export default MapContainer;
