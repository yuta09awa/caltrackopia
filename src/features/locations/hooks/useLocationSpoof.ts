
import { useState, useEffect } from 'react';
import { LOCATION_SPOOFS, spoofUserLocation, getLocationsByRegion } from '../data/mockLocations';
import { validateAndSanitizeLocations, validateSpoofedLocation } from '../utils/validationUtils';

export function useLocationSpoof() {
  const [activeSpoof, setActiveSpoof] = useState<keyof typeof LOCATION_SPOOFS | null>(
    () => {
      // Check if there's a saved spoof preference
      const saved = localStorage.getItem('location-spoof');
      return saved && saved in LOCATION_SPOOFS ? saved as keyof typeof LOCATION_SPOOFS : null;
    }
  );

  const [spoofedLocation, setSpoofedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (activeSpoof) {
      const location = spoofUserLocation(activeSpoof);
      // Validate the spoofed location
      const validatedLocation = validateSpoofedLocation(location);
      setSpoofedLocation(validatedLocation);
      localStorage.setItem('location-spoof', activeSpoof);
    } else {
      setSpoofedLocation(null);
      localStorage.removeItem('location-spoof');
    }
  }, [activeSpoof]);

  const enableSpoof = (spoofKey: keyof typeof LOCATION_SPOOFS) => {
    setActiveSpoof(spoofKey);
  };

  const disableSpoof = () => {
    setActiveSpoof(null);
  };

  const getFilteredLocations = () => {
    if (!activeSpoof) return [];
    const rawLocations = getLocationsByRegion(activeSpoof);
    // Validate and sanitize all locations before returning
    return validateAndSanitizeLocations(rawLocations);
  };

  return {
    activeSpoof,
    spoofedLocation,
    availableSpoofs: Object.keys(LOCATION_SPOOFS) as (keyof typeof LOCATION_SPOOFS)[],
    enableSpoof,
    disableSpoof,
    getFilteredLocations,
    spoofRegionName: activeSpoof ? LOCATION_SPOOFS[activeSpoof].region : null
  };
}
