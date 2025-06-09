
import { useState, useEffect } from 'react';

interface MapLoadingStateProps {
  apiKeyLoading: boolean;
  apiKeyError: string | null;
  apiKey: string | null;
  googleMapsLoaded: boolean;
  googleMapsError: any;
}

interface MapLoadingState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  stage: 'api-key' | 'google-maps' | 'places-api' | 'ready' | 'error';
}

export const useMapLoadingState = ({
  apiKeyLoading,
  apiKeyError,
  apiKey,
  googleMapsLoaded,
  googleMapsError
}: MapLoadingStateProps): MapLoadingState => {
  const [state, setState] = useState<MapLoadingState>({
    isReady: false,
    isLoading: true,
    error: null,
    stage: 'api-key'
  });

  useEffect(() => {
    console.log('useMapLoadingState update:', {
      apiKeyLoading,
      apiKeyError,
      apiKey: apiKey ? 'present' : 'missing',
      googleMapsLoaded,
      googleMapsError
    });

    // Handle API key error
    if (apiKeyError) {
      setState({
        isReady: false,
        isLoading: false,
        error: apiKeyError,
        stage: 'error'
      });
      return;
    }

    // Handle API key loading
    if (apiKeyLoading) {
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'api-key'
      });
      return;
    }

    // Handle Google Maps error
    if (googleMapsError) {
      setState({
        isReady: false,
        isLoading: false,
        error: `Google Maps Error: ${googleMapsError.message}`,
        stage: 'error'
      });
      return;
    }

    // API key loaded, now wait for Google Maps
    if (apiKey && !googleMapsLoaded) {
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'google-maps'
      });
      return;
    }

    // All dependencies loaded successfully
    if (apiKey && googleMapsLoaded) {
      setState({
        isReady: true,
        isLoading: false,
        error: null,
        stage: 'ready'
      });
      return;
    }

    // Default case - still loading API key
    if (!apiKey) {
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'api-key'
      });
    }
  }, [apiKeyLoading, apiKeyError, apiKey, googleMapsLoaded, googleMapsError]);

  return state;
};
