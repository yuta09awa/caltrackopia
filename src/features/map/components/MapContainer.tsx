import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useApiKeyLoader } from './ApiKeyLoader';
import MapLoadingState from './MapLoadingState';
import MapView from './MapView';
import { Ingredient } from '@/hooks/useIngredientSearch';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface MapContainerProps {
  height: string;
  selectedIngredient?: Ingredient | null;
  onLocationSelect?: (locationId: string) => void;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  mapState: MapState;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

// Define libraries array outside component to prevent re-renders - only include marker for now
const libraries: ("marker")[] = ['marker'];

const MapContainer: React.FC<MapContainerProps> = ({ 
  height, 
  selectedIngredient, 
  onLocationSelect,
  selectedLocationId,
  onMarkerClick,
  mapState,
  searchQuery,
  onMapLoaded,
  onMapIdle
}) => {
  const { apiKey, error, loading } = useApiKeyLoader();

  console.log('MapContainer render state:', { 
    loading, 
    error, 
    apiKey: apiKey ? 'present' : 'missing', 
    markersCount: mapState.markers.length,
    center: mapState.center,
    zoom: mapState.zoom,
    searchQuery,
    currentUrl: window.location.href
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
        mapState={mapState}
        selectedLocationId={selectedLocationId}
        onMarkerClick={onMarkerClick}
        onLocationSelect={onLocationSelect}
        height={height}
        searchQuery={searchQuery}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      />
    </div>
  );
};

// Separate component that handles the Google Maps script loading
const MapWithScript: React.FC<{
  apiKey: string;
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  height: string;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}> = ({ 
  apiKey, 
  mapState,
  selectedLocationId, 
  onMarkerClick, 
  onLocationSelect, 
  height,
  searchQuery,
  onMapLoaded,
  onMapIdle
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  console.log('MapWithScript state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    loadError: loadError?.message,
    loadErrorStack: loadError?.stack,
    markersCount: mapState.markers.length,
    searchQuery,
    googleMapsAvailable: typeof window !== 'undefined' && 'google' in window
  });

  // Show error if Google Maps failed to load
  if (loadError) {
    console.error('Google Maps load error details:', {
      message: loadError.message,
      stack: loadError.stack,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
      currentDomain: window.location.hostname,
      fullUrl: window.location.href
    });
    
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={`Google Maps Error: ${loadError.message}. Check console for details.`} 
      />
    );
  }

  // Wait for script to load
  if (!isLoaded) {
    console.log('Waiting for Google Maps script to load...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  console.log('Google Maps successfully loaded, rendering MapView with markers:', mapState.markers);

  return (
    <MapView
      mapState={mapState}
      selectedLocationId={selectedLocationId}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      searchQuery={searchQuery}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default MapContainer;
