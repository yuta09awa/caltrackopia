import { useCallback } from 'react';

/**
 * @internal - Used internally by search hooks
 * Provides utilities for working with Google Places API
 */
export const usePlacesApiService = () => {
  const waitForPlacesApi = useCallback(async (): Promise<boolean> => {
    // Check if Google Maps Places API is loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      return true;
    }

    // Wait for API to load (max 5 seconds)
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;

      const checkInterval = setInterval(() => {
        attempts++;
        
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          clearInterval(checkInterval);
          resolve(true);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('Google Places API failed to load');
          resolve(false);
        }
      }, 100);
    });
  }, []);

  return {
    waitForPlacesApi
  };
};
