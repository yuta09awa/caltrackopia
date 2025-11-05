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

  const getPlaceDetails = useCallback(async (
    map: google.maps.Map,
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> => {
    if (!map) {
      console.log('No map provided for place details');
      return null;
    }

    try {
      const placesReady = await waitForPlacesApi();
      if (!placesReady) {
        throw new Error('Places API not available');
      }

      const service = new google.maps.places.PlacesService(map);
      
      return new Promise<google.maps.places.PlaceResult | null>((resolve) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'photos', 'price_level', 'types', 'opening_hours']
        };

        service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place);
          } else {
            console.error('Place details request failed:', status);
            resolve(null);
          }
        });
      });
    } catch (err) {
      console.error('Place details request failed:', err);
      return null;
    }
  }, [waitForPlacesApi]);

  return {
    waitForPlacesApi,
    getPlaceDetails
  };
};
