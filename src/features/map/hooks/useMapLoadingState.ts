
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

    // Handle Google Maps loading
    if (apiKey && !googleMapsLoaded) {
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'google-maps'
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

    // All dependencies loaded successfully
    if (apiKey && googleMapsLoaded) {
      setState({
        isReady: true,
        isLoading: false,
        error: null,
        stage: 'ready'
      });
    }
  }, [apiKeyLoading, apiKeyError, apiKey, googleMapsLoaded, googleMapsError]);

  return state;
};
