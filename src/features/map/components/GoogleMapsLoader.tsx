
import React, { useEffect, useState } from 'react';
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
  const [placesReady, setPlacesReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<'script' | 'places' | 'ready'>('script');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Wait for Places API to be fully ready
  useEffect(() => {
    if (!isLoaded) {
      setLoadingStage('script');
      return;
    }

    setLoadingStage('places');

    const checkPlacesApi = async () => {
      const maxAttempts = 20;
      let attempts = 0;
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        if (window.google?.maps?.places?.PlacesService) {
          console.log('Places API is ready');
          setPlacesReady(true);
          setLoadingStage('ready');
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          console.error('Places API failed to load after maximum attempts');
          setInitializationError('Places API failed to initialize');
          clearInterval(checkInterval);
        }
      }, 100);
    };

    checkPlacesApi();
  }, [isLoaded]);

  console.log('GoogleMapsLoader state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    placesReady,
    loadingStage,
    loadError: loadError?.message,
    initializationError,
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

  // Show error if initialization failed
  if (initializationError) {
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={initializationError} 
      />
    );
  }

  // Show appropriate loading message based on stage
  if (!isLoaded || !placesReady) {
    const loadingMessage = loadingStage === 'script' 
      ? 'Loading Google Maps...'
      : loadingStage === 'places'
        ? 'Initializing Places API...'
        : 'Preparing map...';

    console.log(`Loading stage: ${loadingStage} - ${loadingMessage}`);
    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  console.log('Google Maps and Places API successfully loaded, rendering MapView with markers:', mapState.markers);

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
