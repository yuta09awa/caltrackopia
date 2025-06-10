
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
  stage: 'api-key' | 'google-maps' | 'ready' | 'error';
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
    console.log('🔄 useMapLoadingState evaluation:', {
      apiKeyLoading,
      apiKeyError,
      apiKey: apiKey ? 'present' : 'missing',
      googleMapsLoaded,
      googleMapsError,
      currentStage: state.stage
    });

    // Handle errors first
    if (apiKeyError) {
      console.log('❌ API key error detected');
      setState({
        isReady: false,
        isLoading: false,
        error: apiKeyError,
        stage: 'error'
      });
      return;
    }

    if (googleMapsError) {
      console.log('❌ Google Maps error detected');
      setState({
        isReady: false,
        isLoading: false,
        error: `Google Maps Error: ${googleMapsError.message}`,
        stage: 'error'
      });
      return;
    }

    // Step 1: Loading API key
    if (apiKeyLoading || !apiKey) {
      console.log('🔑 Loading API key...');
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'api-key'
      });
      return;
    }

    // Step 2: API key loaded, waiting for Google Maps
    if (apiKey && !googleMapsLoaded) {
      console.log('🗺️ API key ready, loading Google Maps...');
      setState({
        isReady: false,
        isLoading: true,
        error: null,
        stage: 'google-maps'
      });
      return;
    }

    // Step 3: Everything is ready
    if (apiKey && googleMapsLoaded) {
      console.log('✅ All dependencies ready, map should render');
      setState({
        isReady: true,
        isLoading: false,
        error: null,
        stage: 'ready'
      });
      return;
    }

    // Fallback - shouldn't reach here
    console.warn('⚠️ Unexpected loading state combination');
  }, [apiKeyLoading, apiKeyError, apiKey, googleMapsLoaded, googleMapsError]);

  console.log('📊 useMapLoadingState result:', {
    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,
    stage: state.stage
  });

  return state;
};
