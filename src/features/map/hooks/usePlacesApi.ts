
import { useState, useCallback } from 'react';
import { MarkerData } from '../types';
import { useCachedPlacesApi } from './useCachedPlacesApi';

export interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: google.maps.LatLng;
  };
  types: string[];
  rating?: number;
  price_level?: number;
  photos?: google.maps.places.PlacePhoto[];
}

export const usePlacesApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use cached Places API as primary source
  const { 
    searchCachedPlaces, 
    searchNearbyPlaces: searchNearbyCached,
    loading: cacheLoading,
    error: cacheError,
    cacheHitRate
  } = useCachedPlacesApi();

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

  const searchPlacesByText = useCallback(async (
    map: google.maps.Map,
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 20000
  ): Promise<MarkerData[]> => {
    if (!query.trim()) {
      console.log('Invalid query for search');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Hybrid search: ${query} at ${center.lat},${center.lng}`);
      
      // First try cached search
      const cachedResults = await searchCachedPlaces(query, center, radius);
      
      if (cachedResults.length > 0) {
        console.log(`Found ${cachedResults.length} results from cache`);
        setLoading(false);
        return cachedResults;
      }

      // Fallback to Google Places API if no cached results and map is available
      if (!map) {
        console.log('No cached results and no map available');
        setLoading(false);
        return [];
      }

      console.log('No cached results, falling back to Google Places API');
      
      const placesReady = await waitForPlacesApi();
      if (!placesReady) {
        throw new Error('Places API not available');
      }

      const service = new google.maps.places.PlacesService(map);
      
      return new Promise<MarkerData[]>((resolve) => {
        const request: google.maps.places.TextSearchRequest = {
          query: query,
          location: new google.maps.LatLng(center.lat, center.lng),
          radius: radius,
          type: 'restaurant'
        };

        service.textSearch(request, (results, status) => {
          console.log('Google Places API response:', { status, resultsCount: results?.length });
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 20)
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} places from Google API for query: ${query}`);
            setLoading(false);
            resolve(markers);
          } else {
            console.log('Google Places search failed or no results:', status);
            setLoading(false);
            resolve([]);
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      setLoading(false);
      console.error('Error searching places:', err);
      return [];
    }
  }, [searchCachedPlaces, waitForPlacesApi]);

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Hybrid nearby search at ${center.lat},${center.lng}`);
      
      // First try cached nearby search
      const cachedResults = await searchNearbyCached(center, radius);
      
      if (cachedResults.length > 0) {
        console.log(`Found ${cachedResults.length} nearby results from cache`);
        setLoading(false);
        return cachedResults;
      }

      // Fallback to Google Places API if no cached results and map is available
      if (!map) {
        console.log('No cached nearby results and no map available');
        setLoading(false);
        return [];
      }

      console.log('No cached nearby results, falling back to Google Places API');
      
      const placesReady = await waitForPlacesApi();
      if (!placesReady) {
        throw new Error('Places API not available');
      }

      const service = new google.maps.places.PlacesService(map);
      
      return new Promise<MarkerData[]>((resolve) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(center.lat, center.lng),
          radius: radius,
          type: 'restaurant'
        };

        service.nearbySearch(request, (results, status) => {
          console.log('Google Places nearby API response:', { status, resultsCount: results?.length });
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 6)
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} nearby places from Google API`);
            setLoading(false);
            resolve(markers);
          } else {
            console.log('Google nearby search failed or no results:', status);
            setLoading(false);
            resolve([]);
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search nearby places';
      setError(errorMessage);
      setLoading(false);
      console.error('Error searching nearby places:', err);
      return [];
    }
  }, [searchNearbyCached, waitForPlacesApi]);

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
    searchPlacesByText,
    searchNearbyPlaces,
    getPlaceDetails,
    loading: loading || cacheLoading,
    error: error || cacheError,
    cacheHitRate
  };
};
