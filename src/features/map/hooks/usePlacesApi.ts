
import { useState, useCallback } from 'react';
import { MarkerData } from '../types';

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

  const searchPlacesByText = useCallback(async (
    map: google.maps.Map,
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    if (!map || !window.google?.maps?.places || !query.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Use the new Places API (Place class) instead of deprecated PlacesService
      const { Place, SearchNearbyRankPreference } = google.maps.places;
      
      const request = {
        textQuery: `${query} restaurants`,
        fields: ['id', 'displayName', 'location', 'types', 'rating', 'priceLevel'],
        locationBias: {
          center: { lat: center.lat, lng: center.lng },
          radius: radius
        },
        maxResultCount: 8, // Limit results to reduce latency
        language: 'en',
        region: 'US'
      };

      const { places } = await Place.searchByText(request);
      
      if (places && places.length > 0) {
        const markers: MarkerData[] = places
          .filter(place => place.location && place.id)
          .map(place => ({
            position: {
              lat: place.location!.lat(),
              lng: place.location!.lng()
            },
            locationId: place.id!,
            type: 'restaurant'
          }));
        
        console.log(`Found ${markers.length} places for query: ${query} using new Places API`);
        setLoading(false);
        return markers;
      } else {
        console.log('Places search returned no results for:', query);
        setLoading(false);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      setLoading(false);
      console.error('Error searching places with new API:', err);
      return [];
    }
  }, []);

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    if (!map || !window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Use the new Places API for nearby search
      const { Place, SearchNearbyRankPreference } = google.maps.places;
      
      const request = {
        fields: ['id', 'displayName', 'location', 'types'],
        locationRestriction: {
          center: { lat: center.lat, lng: center.lng },
          radius: radius
        },
        includedTypes: ['restaurant', 'meal_takeaway', 'food'],
        maxResultCount: 6, // Reduced for better performance
        rankPreference: SearchNearbyRankPreference.DISTANCE,
        language: 'en',
        region: 'US'
      };

      const { places } = await Place.searchNearby(request);
      
      if (places && places.length > 0) {
        const markers: MarkerData[] = places
          .filter(place => place.location && place.id)
          .map(place => ({
            position: {
              lat: place.location!.lat(),
              lng: place.location!.lng()
            },
            locationId: place.id!,
            type: 'restaurant'
          }));
        
        console.log(`Found ${markers.length} nearby places using new Places API`);
        setLoading(false);
        return markers;
      } else {
        console.log('No nearby places found');
        setLoading(false);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      setLoading(false);
      console.error('Error searching nearby places with new API:', err);
      return [];
    }
  }, []);

  const getPlaceDetails = useCallback(async (
    map: google.maps.Map,
    placeId: string
  ): Promise<google.maps.places.Place | null> => {
    if (!map || !window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return null;
    }

    try {
      // Use the new Places API for place details
      const { Place } = google.maps.places;
      
      const place = new Place({
        id: placeId,
        requestedLanguage: 'en',
      });

      await place.fetchFields({
        fields: ['id', 'displayName', 'formattedAddress', 'location', 'rating', 'photos', 'priceLevel', 'types', 'regularOpeningHours']
      });

      return place;
    } catch (err) {
      console.error('Place details request failed:', err);
      return null;
    }
  }, []);

  return {
    searchPlacesByText,
    searchNearbyPlaces,
    getPlaceDetails,
    loading,
    error
  };
};
