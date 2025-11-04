import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location } from '@/features/locations/types';

/**
 * @internal - Used internally by useMapInteractions
 * Handles navigation actions from map markers
 */
export const useNavigationActions = () => {
  const navigate = useNavigate();

  const handleViewDetails = useCallback((locationId: string, locations: Location[]) => {
    console.log('Navigating to location details:', locationId);
    navigate(`/locations/${locationId}`);
  }, [navigate]);

  const handleGetDirections = useCallback((location: Location) => {
    if (location.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    }
  }, []);

  return {
    handleViewDetails,
    handleGetDirections
  };
};
