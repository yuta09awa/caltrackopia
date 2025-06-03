
import { useCallback } from 'react';
import { Location } from '@/features/locations/types';

interface UseMarkerInteractionsProps {
  onLocationSelect: (locationId: string, locations: Location[], selectLocation: (id: string | null) => void) => void;
  onShowCard: (position: { x: number; y: number }) => void;
  setSelectedLocation: (location: Location | null) => void;
}

export const useMarkerInteractions = ({
  onLocationSelect,
  onShowCard,
  setSelectedLocation
}: UseMarkerInteractionsProps) => {

  const handleMarkerClick = useCallback((
    locationId: string,
    position: { x: number; y: number },
    locations: Location[],
    selectLocation: (id: string | null) => void
  ) => {
    console.log('Marker clicked:', locationId, position);
    const location = locations.find(loc => loc.id === locationId);
    
    if (location && (location.type === "Restaurant" || location.type === "Grocery")) {
      setSelectedLocation(location);
      selectLocation(locationId);
      onShowCard(position);
    } else if (location) {
      console.log('Location found but not a restaurant or grocery, skipping popup:', location.type);
    } else {
      console.warn('Location not found for ID:', locationId);
    }
  }, [onLocationSelect, onShowCard, setSelectedLocation]);

  return {
    handleMarkerClick
  };
};
