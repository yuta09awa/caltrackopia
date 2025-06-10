
import React, { useEffect, useState, useCallback } from 'react';
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
  onGoogleMapsLoad?: () => void;
  onGoogleMapsError?: (error: any) => void;
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
  onMapIdle,
  onGoogleMapsLoad,
  onGoogleMapsError
}) => {
  const [isMapReady, setIsMapReady] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Handle the loading state and notify parent when ready
  const handleGoogleMapsReady = useCallback(() => {
    console.log('🎉 Google Maps is fully ready');
    setIsMapReady(true);
    if (onGoogleMapsLoad) {
      console.log('📢 Notifying parent that Google Maps is ready');
      onGoogleMapsLoad();
    }
  }, [onGoogleMapsLoad]);

  // Check Google Maps readiness when script loads
  useEffect(() => {
    if (!isLoaded) {
      console.log('⏳ Waiting for Google Maps script to load...');
      return;
    }

    console.log('📝 Google Maps script loaded, checking API availability...');
    
    // Check if Google Maps API is available
    if (window.google?.maps?.Map) {
      console.log('✅ Google Maps core API confirmed available');
      handleGoogleMapsReady();
    } else {
      console.error('❌ Google Maps core API not available after script load');
      const error = new Error('Google Maps core API not available');
      if (onGoogleMapsError) {
        onGoogleMapsError(error);
      }
    }
  }, [isLoaded, handleGoogleMapsReady, onGoogleMapsError]);

  // Handle load errors
  useEffect(() => {
    if (loadError) {
      console.error('❌ Google Maps script load error:', loadError);
      if (onGoogleMapsError) {
        onGoogleMapsError(loadError);
      }
    }
  }, [loadError, onGoogleMapsError]);

  console.log('🔍 GoogleMapsLoader state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    isMapReady,
    loadError: loadError?.message,
    markersCount: mapState.markers.length,
    windowGoogleAvailable: typeof window !== 'undefined' && 'google' in window
  });

  // Show error if Google Maps failed to load
  if (loadError) {
    console.error('💥 Google Maps load error details:', {
      message: loadError.message,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing'
    });
    
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
    console.log('⏳ GoogleMapsLoader: Waiting for script...');
    return <MapLoadingState height={height} type="loading" errorMessage="Loading Google Maps script..." />;
  }

  // Wait for map to be ready
  if (!isMapReady) {
    console.log('⏳ GoogleMapsLoader: Waiting for map to be ready...');
    return <MapLoadingState height={height} type="loading" errorMessage="Initializing Google Maps..." />;
  }

  console.log('🚀 GoogleMapsLoader: Rendering MapView');

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
