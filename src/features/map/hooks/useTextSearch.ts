
import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useSearchState } from './useSearchState';
import { EdgeAPIClient } from '@/lib/edge-api-client';
import { usePlaceFilters } from './usePlaceFilters';
import { usePlacesApiService } from './usePlacesApiService';
import { mapPlaceTypeToMarkerType } from '../utils/placeTypeMapper';
import { GoogleMapsProvider } from '@/services/providers/GoogleMapsProvider';

export const useTextSearch = () => {
  const searchState = useSearchState();
  const edgeClient = new EdgeAPIClient();
  const { applyFilters } = usePlaceFilters();
  const { waitForPlacesApi, getProvider } = usePlacesApiService();

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
      console.log(`Text search via Edge API: ${query} at ${center.lat},${center.lng}`);
      
      // Use Edge API for fast global search
      const edgeResults = await edgeClient.searchRestaurants({
        q: query,
        lat: center.lat,
        lng: center.lng,
        radius: radius
      });
      
      if (edgeResults.results?.length > 0) {
        console.log(`Found ${edgeResults.results.length} results from Edge API (cached at edge)`);
        
        const markers: MarkerData[] = edgeResults.results.map((place) => ({
          position: { lat: place.latitude, lng: place.longitude },
          id: place.id,
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

      console.log('No cached results, falling back to location provider API');
      
      const provider = getProvider();
      const ready = await waitForPlacesApi();
      
      if (!ready) {
        throw new Error('Location provider not available');
      }

      // Set map instance for Google Maps provider
      if (provider instanceof GoogleMapsProvider) {
        provider.setMap(map);
      }

      const results = await provider.searchPlacesByText({
        query,
        center,
        radius,
        type: 'restaurant'
      });

      console.log('Location provider API response:', { resultsCount: results.length });
      
      const filteredResults = applyFilters(results);

      const markers: MarkerData[] = filteredResults
        .slice(0, 20)
        .map(place => ({
          position: place.geometry.location,
          id: place.place_id,
          type: 'restaurant'
        }));
      
      console.log(`Found ${markers.length} filtered places from provider API for query: ${query}`);
      searchState.completeSearch(markers.length);
      return markers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      searchState.errorSearch(errorMessage);
      console.error('Error searching places:', err);
      return [];
    }
  }, [applyFilters, waitForPlacesApi, getProvider, searchState]);

  return {
    searchPlacesByText,
    ...searchState
  };
};
