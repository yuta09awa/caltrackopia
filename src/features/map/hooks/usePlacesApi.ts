
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
    radius: number = 20000
  ): Promise<MarkerData[]> => {
    if (!map || !window.google?.maps?.places || !query.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Use the traditional PlacesService instead of the new Place class
      const service = new google.maps.places.PlacesService(map);
      
      return new Promise<MarkerData[]>((resolve, reject) => {
        const request: google.maps.places.TextSearchRequest = {
          query: query,
          location: new google.maps.LatLng(center.lat, center.lng),
          radius: radius,
          type: 'restaurant'
        };

        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 20) // Limit results
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} places for query: ${query} using PlacesService`);
            setLoading(false);
            resolve(markers);
          } else {
            console.log('Places search failed with status:', status);
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
      // Use the traditional PlacesService
      const service = new google.maps.places.PlacesService(map);
      
      return new Promise<MarkerData[]>((resolve, reject) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(center.lat, center.lng),
          radius: radius,
          type: 'restaurant'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 6) // Limit to 6 results for better performance
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} nearby places using PlacesService`);
            setLoading(false);
            resolve(markers);
          } else {
            console.log('Nearby search failed with status:', status);
            setLoading(false);
            resolve([]);
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      setLoading(false);
      console.error('Error searching nearby places:', err);
      return [];
    }
  }, []);

  const getPlaceDetails = useCallback(async (
    map: google.maps.Map,
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> => {
    if (!map || !window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return null;
    }

    try {
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
  }, []);

  return {
    searchPlacesByText,
    searchNearbyPlaces,
    getPlaceDetails,
    loading,
    error
  };
};
