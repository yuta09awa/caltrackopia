
import { useCallback } from 'react';

export const usePlacesApiService = () => {
  const waitForPlacesApi = useCallback(async (): Promise<boolean> => {
    const maxAttempts = 10;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      if (window.google?.maps?.places?.PlacesService) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    console.error('Places API not available after waiting');
    return false;
  }, []);

  return { waitForPlacesApi };
};
