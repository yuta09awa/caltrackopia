
import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import MapLoadingState from './MapLoadingState';
import MapView from './MapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface GoogleMapsLoaderProps {
  apiKey: string;
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  height: string;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
}

// Include places library to fix the Places API error
const libraries: ("places" | "marker")[] = ['places', 'marker'];

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ 
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

  console.log('GoogleMapsLoader state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    loadError: loadError?.message,
    markersCount: mapState.markers.length,
    searchQuery,
    googleMapsAvailable: typeof window !== 'undefined' && 'google' in window,
    placesAvailable: typeof window !== 'undefined' && window.google?.maps?.places
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

export default GoogleMapsLoader;
