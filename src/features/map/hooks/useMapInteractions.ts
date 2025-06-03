
import { useCallback } from 'react';
import { Location } from '@/features/locations/types';
import { useLocationSelection } from './useLocationSelection';
import { useInfoCardState } from './useInfoCardState';
import { useMarkerInteractions } from './useMarkerInteractions';
import { useNavigationActions } from './useNavigationActions';

export const useMapInteractions = () => {
  const locationSelection = useLocationSelection();
  const infoCardState = useInfoCardState();
  const navigationActions = useNavigationActions();

  const markerInteractions = useMarkerInteractions({
    onLocationSelect: locationSelection.handleLocationSelect,
    onShowCard: infoCardState.showCard,
    setSelectedLocation: locationSelection.setSelectedLocation
  });

  const handleInfoCardClose = useCallback((selectLocation: (id: string | null) => void) => {
    console.log('Info card closed');
    infoCardState.hideCard();
    selectLocation(null);
    locationSelection.setSelectedLocation(null);
  }, [infoCardState, locationSelection]);

  const handleViewDetails = useCallback((locationId: string, locations: Location[]) => {
    navigationActions.handleViewDetails(locationId, locations);
    infoCardState.hideCard();
    locationSelection.setSelectedLocation(null);
  }, [navigationActions, infoCardState, locationSelection]);

  return {
    // State
    showInfoCard: infoCardState.showInfoCard,
    infoCardPosition: infoCardState.infoCardPosition,
    selectedLocation: locationSelection.selectedLocation,
    
    // Actions
    handleLocationSelect: locationSelection.handleLocationSelect,
    handleMarkerClick: markerInteractions.handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
  };
};
