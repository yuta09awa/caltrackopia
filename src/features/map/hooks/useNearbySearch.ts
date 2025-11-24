
import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useSearchState } from './useSearchState';
import { EdgeAPIClient } from '@/lib/edge-api-client';
import { usePlaceFilters } from './usePlaceFilters';
import { usePlacesApiService } from './usePlacesApiService';
import { mapPlaceTypeToMarkerType } from '../utils/placeTypeMapper';
import { GoogleMapsProvider } from '@/services/providers/GoogleMapsProvider';

export const useNearbySearch = () => {
  const searchState = useSearchState();
  const edgeClient = new EdgeAPIClient();
  const { applyFilters } = usePlaceFilters();
  const { waitForPlacesApi, getProvider } = usePlacesApiService();

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    searchState.startSearch();

    try {
      console.log(`Nearby search via Edge API at ${center.lat},${center.lng}`);
      
      // Use Edge API for fast global search
      const edgeResults = await edgeClient.searchRestaurants({
        lat: center.lat,
        lng: center.lng,
        radius: radius
      });
      
      if (edgeResults.results?.length > 0) {
        console.log(`Found ${edgeResults.results.length} nearby results from Edge API (cached at edge)`);
        
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
        console.log('No cached nearby results and no map available');
        searchState.completeSearch(0);
        return [];
      }

      console.log('No cached nearby results, falling back to location provider API');
      
      const provider = getProvider();
      const ready = await waitForPlacesApi();
      
      if (!ready) {
        throw new Error('Location provider not available');
      }

      // Set map instance for Google Maps provider
      if (provider instanceof GoogleMapsProvider) {
        provider.setMap(map);
      }

      const results = await provider.searchNearbyPlaces({
        center,
        radius,
        type: 'restaurant'
      });

      console.log('Location provider nearby API response:', { resultsCount: results.length });
      
      const filteredResults = applyFilters(results);

      const markers: MarkerData[] = filteredResults
        .slice(0, 6)
        .map(place => ({
          position: place.geometry.location,
          id: place.place_id,
          type: 'restaurant'
        }));
      
      console.log(`Found ${markers.length} filtered nearby places from provider API`);
      searchState.completeSearch(markers.length);
      return markers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search nearby places';
      searchState.errorSearch(errorMessage);
      console.error('Error searching nearby places:', err);
      return [];
    }
  }, [applyFilters, waitForPlacesApi, getProvider, searchState]);

  return {
    searchNearbyPlaces,
    ...searchState
  };
};
