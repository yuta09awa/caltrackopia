
import { useState, useCallback } from 'react';
import { Location } from '@/features/locations/types';
import { toast } from 'sonner';

export const useLocationSelection = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = useCallback((
    locationId: string,
    locations: Location[],
    selectLocation: (id: string | null) => void
  ) => {
    console.log('Location selected:', locationId);
    selectLocation(locationId);
    
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      toast.info(`Showing ${location.name} on map`, { duration: 2000 });
    }
  }, []);

  return {
    selectedLocation,
    setSelectedLocation,
    handleLocationSelect
  };
};
