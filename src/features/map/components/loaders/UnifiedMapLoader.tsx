
import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useApiKeyState } from '../../hooks/useApiKeyState';
import MapLoadingState from '../MapLoadingState';
import { MapState, LatLng } from '../../hooks/useMapState';

interface UnifiedMapLoaderProps {
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  height: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  children: (isReady: boolean) => React.ReactNode;
}

const libraries: ("places" | "marker")[] = ['places', 'marker'];

const UnifiedMapLoader: React.FC<UnifiedMapLoaderProps> = ({
  height,
  children,
  ...otherProps
}) => {
  const { apiKey, error: apiKeyError, loading: apiKeyLoading } = useApiKeyState();
  const [placesReady, setPlacesReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<'apiKey' | 'script' | 'places' | 'ready'>('apiKey');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Handle API key loading
  useEffect(() => {
    if (apiKeyLoading) {
      setLoadingStage('apiKey');
    } else if (apiKeyError) {
      setInitializationError(apiKeyError);
    } else if (apiKey) {
      setLoadingStage('script');
    }
  }, [apiKey, apiKeyError, apiKeyLoading]);

  // Wait for Places API to be fully ready
  useEffect(() => {
    if (!isLoaded || !apiKey) return;

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
  }, [isLoaded, apiKey]);

  // Handle loading error
  if (loadError || initializationError) {
    const errorMessage = loadError 
      ? `Google Maps Error: ${loadError.message}` 
      : initializationError || 'Unknown error';
    
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={errorMessage} 
      />
    );
  }

  // Show appropriate loading message based on stage
  if (!apiKey || !isLoaded || !placesReady) {
    const loadingMessage = loadingStage === 'apiKey'
      ? 'Loading API key...'
      : loadingStage === 'script' 
        ? 'Loading Google Maps...'
        : loadingStage === 'places'
          ? 'Initializing Places API...'
          : 'Preparing map...';

    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Maps API is ready
  return <>{children(true)}</>;
};

export default UnifiedMapLoader;
