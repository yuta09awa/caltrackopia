
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface LatLng {
  lat: number;
  lng: number;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getUserLocation = useCallback(async (): Promise<LatLng | null> => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser');
      return null;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      console.log('Got user location:', location);
      return location;
    } catch (error) {
      console.warn('Could not get user location:', error);
      // Don't show toast for location errors as they're common and not critical
      return null;
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  return {
    userLocation,
    getUserLocation,
    isGettingLocation
  };
};
