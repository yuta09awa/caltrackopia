
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface MapInteractionState {
  showInfoCard: boolean;
  infoCardPosition: { x: number; y: number };
  selectedLocation: any | null;
}

export interface MapInteractionActions {
  handleLocationSelect: (location: any) => void;
  handleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  handleInfoCardClose: () => void;
  handleViewDetails: (locationId: string) => void;
}

export const useMapInteractions = () => {
  const navigate = useNavigate();
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const handleLocationSelect = useCallback((location: any) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
  }, []);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    console.log('Marker clicked:', locationId, position);
    // Find location by ID and show info card
    setInfoCardPosition(position);
    setShowInfoCard(true);
  }, []);

  const handleInfoCardClose = useCallback(() => {
    console.log('Info card closed');
    setShowInfoCard(false);
    setSelectedLocation(null);
  }, []);

  const handleViewDetails = useCallback((locationId: string) => {
    console.log('Viewing details for location:', locationId);
    navigate(`/location/${locationId}`);
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
