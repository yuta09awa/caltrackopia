import { useCallback, useRef, useEffect } from 'react';
import { LocationProviderFactory } from '@/services/providers';
import { GoogleMapsProvider } from '@/services/providers/GoogleMapsProvider';

/**
 * @internal - Used internally by search hooks
 * Provides utilities for working with location provider (abstracted from Google Places API)
 */
export const usePlacesApiService = () => {
  const providerRef = useRef(LocationProviderFactory.getProvider());

  useEffect(() => {
    // Initialize provider on mount
    providerRef.current.initialize();
  }, []);

  const waitForPlacesApi = useCallback(async (): Promise<boolean> => {
    const provider = providerRef.current;
    
    if (provider.isReady()) {
      return true;
    }

    return provider.initialize();
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
      const provider = providerRef.current;
      
      // Set map instance for Google Maps provider
      if (provider instanceof GoogleMapsProvider) {
        provider.setMap(map);
      }

      const ready = await provider.initialize();
      if (!ready) {
        throw new Error('Location provider not available');
      }

      const result = await provider.getPlaceDetails({ placeId });
      
      // Convert to Google Maps format for backward compatibility
      if (result) {
        return {
          place_id: result.place_id,
          name: result.name,
          formatted_address: result.formatted_address,
          geometry: {
            location: new google.maps.LatLng(
              result.geometry.location.lat,
              result.geometry.location.lng
            )
          },
          types: result.types,
          rating: result.rating,
          price_level: result.price_level,
          photos: result.photos as any,
          opening_hours: result.opening_hours as any
        };
      }
      
      return null;
    } catch (err) {
      console.error('Place details request failed:', err);
      return null;
    }
  }, []);

  const getProvider = useCallback(() => {
    return providerRef.current;
  }, []);

  return {
    waitForPlacesApi,
    getPlaceDetails,
    getProvider
  };
};
