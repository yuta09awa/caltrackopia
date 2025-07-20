
import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useApiKeyState } from '../../hooks/useApiKeyState';
import MapLoadingState from '../MapLoadingState';
import { UnifiedMapState, LatLng } from '../../types/unified';

interface UnifiedMapLoaderProps {
  mapState: UnifiedMapState;
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
  const [retryCount, setRetryCount] = useState(0);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Handle API key loading with mobile-specific timeouts
  useEffect(() => {
    if (apiKeyLoading) {
      setLoadingStage('apiKey');
    } else if (apiKeyError) {
      console.error('API Key Error:', apiKeyError);
      setInitializationError(apiKeyError);
    } else if (apiKey) {
      setLoadingStage('script');
    }
  }, [apiKey, apiKeyError, apiKeyLoading]);

  // Wait for Places API with mobile-optimized timing
  useEffect(() => {
    if (!isLoaded || !apiKey) return;

    setLoadingStage('places');

    const checkPlacesApi = async () => {
      const maxAttempts = 15; // Reduced for mobile
      const checkInterval = 150; // Slightly longer for mobile
      let attempts = 0;
      
      const intervalId = setInterval(() => {
        attempts++;
        
        try {
          if (window.google?.maps?.places?.PlacesService) {
            console.log('Places API is ready');
            setPlacesReady(true);
            setLoadingStage('ready');
            clearInterval(intervalId);
          } else if (attempts >= maxAttempts) {
            console.error('Places API failed to load after maximum attempts');
            if (retryCount < 2) {
              console.log(`Retrying Places API initialization (attempt ${retryCount + 1})`);
              setRetryCount(prev => prev + 1);
              setPlacesReady(false);
              setLoadingStage('script');
              clearInterval(intervalId);
              // Retry after a short delay
              setTimeout(() => {
                setLoadingStage('places');
                checkPlacesApi();
              }, 1000);
            } else {
              setInitializationError('Places API failed to initialize after retries');
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error('Error checking Places API:', error);
          if (attempts >= maxAttempts) {
            setInitializationError('Places API check failed');
            clearInterval(intervalId);
          }
        }
      }, checkInterval);
    };

    checkPlacesApi();
  }, [isLoaded, apiKey, retryCount]);

  // Handle loading error with better mobile messaging
  if (loadError || initializationError) {
    const errorMessage = loadError 
      ? `Google Maps Error: ${loadError.message}` 
      : initializationError || 'Unknown error';
    
    console.error('Map loading error:', errorMessage);
    
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
          ? retryCount > 0 ? `Retrying... (${retryCount}/2)` : 'Initializing Places API...'
          : 'Preparing map...';

    return <MapLoadingState height={height} type="loading" errorMessage={loadingMessage} />;
  }

  // Maps API is ready
  return <>{children(true)}</>;
};

export default UnifiedMapLoader;
