
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location } from '@/features/locations/types';
import { toast } from 'sonner';

export interface MapInteractionState {
  showInfoCard: boolean;
  infoCardPosition: { x: number; y: number };
  selectedLocation: Location | null;
}

export interface MapInteractionActions {
  handleLocationSelect: (
    locationId: string,
    locations: Location[],
    selectLocation: (id: string | null) => void
  ) => void;
  handleMarkerClick: (
    locationId: string,
    position: { x: number; y: number },
    locations: Location[],
    selectLocation: (id: string | null) => void
  ) => void;
  handleInfoCardClose: (selectLocation: (id: string | null) => void) => void;
  handleViewDetails: (locationId: string, locations: Location[]) => void;
}

export const useMapInteractions = () => {
  const navigate = useNavigate();
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
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
      setInfoCardPosition(position);
      setShowInfoCard(true);
    } else if (location) {
      console.log('Location found but not a restaurant or grocery, skipping popup:', location.type);
    } else {
      console.warn('Location not found for ID:', locationId);
    }
  }, []);

  const handleInfoCardClose = useCallback((selectLocation: (id: string | null) => void) => {
    console.log('Info card closed');
    setShowInfoCard(false);
    selectLocation(null);
    setSelectedLocation(null);
  }, []);

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
    setShowInfoCard(false);
    setSelectedLocation(null);
  }, [navigate]);

  return {
    // State
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    
    // Actions
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
  };
};
