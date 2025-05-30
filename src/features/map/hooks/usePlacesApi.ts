
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
      const service = new google.maps.places.PlacesService(map);
      
      // Use text search for more specific results
      const request: google.maps.places.TextSearchRequest = {
        query: `${query} restaurants near me`,
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: radius,
      };

      return new Promise((resolve, reject) => {
        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 10) // Limit to 10 results to avoid overwhelming the map
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} places for query: ${query}`);
            resolve(markers);
          } else {
            console.log('Places text search returned no results for:', query);
            resolve([]);
          }
          setLoading(false);
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
      const service = new google.maps.places.PlacesService(map);
      
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: radius,
        type: 'restaurant',
      };

      return new Promise((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const markers: MarkerData[] = results
              .filter(place => place.geometry?.location && place.place_id)
              .slice(0, 8) // Limit to 8 results for cleaner map
              .map(place => ({
                position: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                },
                locationId: place.place_id!,
                type: 'restaurant'
              }));
            
            console.log(`Found ${markers.length} nearby places`);
            resolve(markers);
          } else {
            console.error('Places search failed:', status);
            resolve([]);
          }
          setLoading(false);
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

  const getPlaceDetails = useCallback(async (
    map: google.maps.Map,
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> => {
    if (!map || !window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return null;
    }

    const service = new google.maps.places.PlacesService(map);
    
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'photos', 'price_level', 'types', 'opening_hours']
    };

    return new Promise((resolve, reject) => {
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          console.error('Place details request failed:', status);
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }, []);

  return {
    searchPlacesByText,
    searchNearbyPlaces,
    getPlaceDetails,
    loading,
    error
  };
};
