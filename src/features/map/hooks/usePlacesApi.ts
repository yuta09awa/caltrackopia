import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useCachedPlacesApi } from './useCachedPlacesApi';
import { useAppStore } from '@/store/appStore';
import { useSearchState } from './useSearchState';

export const usePlacesApi = () => {
  const { mapFilters } = useAppStore();
  const searchState = useSearchState();
  
  const { 
    searchCachedPlaces, 
    searchNearbyPlaces: searchNearbyCached,
    loading: cacheLoading,
    error: cacheError,
    resultCount
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

    searchState.startSearch();

    try {
      console.log(`Hybrid search with filters: ${query} at ${center.lat},${center.lng}`);
      
      const cachedResults = await searchCachedPlaces(query, center, radius);
      
      if (cachedResults.length > 0) {
        console.log(`Found ${cachedResults.length} filtered results from cache`);
        return cachedResults;
      }

      if (!map) {
        console.log('No cached results and no map available');
        searchState.completeSearch(0);
        return [];
      }

      console.log('No filtered cached results, falling back to Google Places API');
      
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
            const filteredResults = results.filter(place => {
              if (mapFilters.excludeIngredients.length > 0) {
                const placeName = place.name?.toLowerCase() || '';
                const hasExcludedIngredient = mapFilters.excludeIngredients.some(ingredient =>
                  placeName.includes(ingredient.toLowerCase())
                );
                if (hasExcludedIngredient) {
                  return false;
                }
              }

              if (mapFilters.priceRange && place.price_level !== undefined && place.price_level !== null) {
                const [minPrice, maxPrice] = mapFilters.priceRange;
                if (place.price_level < minPrice || place.price_level > maxPrice) {
                  return false;
                }
              }

              return true;
            });

            const markers: MarkerData[] = filteredResults
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
            
            console.log(`Found ${markers.length} filtered places from Google API for query: ${query}`);
            searchState.completeSearch(markers.length);
            resolve(markers);
          } else {
            console.log('Google Places search failed or no results:', status);
            searchState.completeSearch(0);
            resolve([]);
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      searchState.errorSearch(errorMessage);
      console.error('Error searching places:', err);
      return [];
    }
  }, [searchCachedPlaces, waitForPlacesApi, mapFilters, searchState]);

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    searchState.startSearch();

    try {
      console.log(`Hybrid nearby search with filters at ${center.lat},${center.lng}`);
      
      const cachedResults = await searchNearbyCached(center, radius);
      
      if (cachedResults.length > 0) {
        console.log(`Found ${cachedResults.length} filtered nearby results from cache`);
        return cachedResults;
      }

      if (!map) {
        console.log('No cached nearby results and no map available');
        searchState.completeSearch(0);
        return [];
      }

      console.log('No filtered cached nearby results, falling back to Google Places API');
      
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
            const filteredResults = results.filter(place => {
              if (mapFilters.excludeIngredients.length > 0) {
                const placeName = place.name?.toLowerCase() || '';
                const hasExcludedIngredient = mapFilters.excludeIngredients.some(ingredient =>
                  placeName.includes(ingredient.toLowerCase())
                );
                if (hasExcludedIngredient) {
                  return false;
                }
              }

              if (mapFilters.priceRange && place.price_level !== undefined && place.price_level !== null) {
                const [minPrice, maxPrice] = mapFilters.priceRange;
                if (place.price_level < minPrice || place.price_level > maxPrice) {
                  return false;
                }
              }

              return true;
            });

            const markers: MarkerData[] = filteredResults
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
            
            console.log(`Found ${markers.length} filtered nearby places from Google API`);
            searchState.completeSearch(markers.length);
            resolve(markers);
          } else {
            console.log('Google nearby search failed or no results:', status);
            searchState.completeSearch(0);
            resolve([]);
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search nearby places';
      searchState.errorSearch(errorMessage);
      console.error('Error searching nearby places:', err);
      return [];
    }
  }, [searchNearbyCached, waitForPlacesApi, mapFilters, searchState]);

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
    loading: searchState.loading || cacheLoading,
    error: searchState.error || cacheError,
    resultCount
  };
};
