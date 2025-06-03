
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location } from '@/features/locations/types';

export const useNavigationActions = () => {
  const navigate = useNavigate();

  const handleViewDetails = useCallback((locationId: string, locations: Location[]) => {
    console.log('Viewing details for location:', locationId);
    const location = locations.find(loc => loc.id === locationId);
    let detailPath = `/location/${locationId}`;

    if (location?.type.toLowerCase() === "grocery" && 
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      detailPath = `/markets/${locationId}`;
    }
    
    navigate(detailPath);
  }, [navigate]);

  return {
    handleViewDetails
  };
};
