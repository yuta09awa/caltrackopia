
import React from 'react';
import MapInfoCard from '@/features/map/components/MapInfoCard';
import { useMapInteractions } from '@/features/map/hooks/useMapInteractions';
import { useLocations } from '@/features/locations/hooks/useLocations';

export const MapScreenInfoCard: React.FC = () => {
  const { selectedLocation, infoCardPosition, handleInfoCardClose, handleViewDetails } = useMapInteractions();
  const { locations } = useLocations();

  if (!selectedLocation) {
    return null;
  }

  return (
    <MapInfoCard
      location={selectedLocation}
      position={infoCardPosition}
      onClose={() => handleInfoCardClose(() => {})} // Pass empty function for selectLocation
      onViewDetails={() => handleViewDetails(selectedLocation.id, locations)}
    />
  );
};

export default MapScreenInfoCard;
