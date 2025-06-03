
import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useSearchState } from './useSearchState';
import { useEdgeFunctionApi } from './useEdgeFunctionApi';
import { usePlaceFilters } from './usePlaceFilters';
import { usePlacesApiService } from './usePlacesApiService';
import { mapPlaceTypeToMarkerType } from '../utils/placeTypeMapper';

export const useTextSearch = () => {
  const searchState = useSearchState();
  const { callEdgeFunction } = useEdgeFunctionApi();
  const { applyFilters } = usePlaceFilters();
  const { waitForPlacesApi } = usePlacesApiService();

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
      console.log(`Text search: ${query} at ${center.lat},${center.lng}`);
      
      // Try cached results first
      const cachedResults = await callEdgeFunction('places-cache-manager', {
        action: 'search_and_cache',
        search_query: query,
        latitude: center.lat,
        longitude: center.lng,
        radius: radius
      });
      
      if (cachedResults?.success && cachedResults.results?.length > 0) {
        const filteredResults = applyFilters(cachedResults.results);
        console.log(`Found ${filteredResults.length} filtered results from cache`);
        
        const markers: MarkerData[] = filteredResults.map((place: any) => ({
          position: { lat: Number(place.latitude), lng: Number(place.longitude) },
          locationId: place.place_id || place.id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        searchState.completeSearch(markers.length);
        return markers;
      }

      // Fallback to Google Places API
      if (!map) {
        console.log('No cached results and no map available');
        searchState.completeSearch(0);
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
            const filteredResults = applyFilters(results);

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
  }, [callEdgeFunction, applyFilters, waitForPlacesApi, searchState]);

  return {
    searchPlacesByText,
    ...searchState
  };
};
