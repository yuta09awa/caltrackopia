
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

  console.log('🔍 GoogleMapsLoader state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    loadError: loadError?.message,
    markersCount: mapState.markers.length
  });

  // Show error if Google Maps failed to load
  if (loadError) {
    console.error('💥 Google Maps load error:', loadError);
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={`Google Maps Error: ${loadError.message}`} 
      />
    );
  }

  // Wait for script to load
  if (!isLoaded) {
    console.log('⏳ GoogleMapsLoader: Waiting for Google Maps to load...');
    return <MapLoadingState height={height} type="loading" errorMessage="Loading Google Maps..." />;
  }

  console.log('🚀 GoogleMapsLoader: Google Maps loaded, rendering MapView');

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
