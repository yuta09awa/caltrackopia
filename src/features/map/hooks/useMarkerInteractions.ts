import { useCallback } from 'react';

interface MarkerInteractionsProps {
  onLocationSelect?: (locationId: string) => void;
  onShowCard?: (position: { x: number; y: number }, locationId: string) => void;
  setSelectedLocation?: (locationId: string | null) => void;
}

/**
 * @internal - Used internally by useMapInteractions
 * Handles marker click and hover interactions
 */
export const useMarkerInteractions = ({
  onLocationSelect,
  onShowCard,
  setSelectedLocation
}: MarkerInteractionsProps) => {
  
  const handleMarkerClick = useCallback((
    locationId: string,
    position: { x: number; y: number }
  ) => {
    console.log('Marker clicked:', locationId);
    
    if (setSelectedLocation) {
      setSelectedLocation(locationId);
    }
    
    if (onShowCard) {
      onShowCard(position, locationId);
    }
    
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  }, [onLocationSelect, onShowCard, setSelectedLocation]);

  const handleMarkerHover = useCallback((
    locationId: string | null
  ) => {
    // Optional: Add hover effects
    console.log('Marker hover:', locationId);
  }, []);

  return {
    handleMarkerClick,
    handleMarkerHover
  };
};
