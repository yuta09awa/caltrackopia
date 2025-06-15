
import React from 'react';
import MapInfoCard from "@/features/map/components/MapInfoCard";
import { Location } from "@/features/locations/types";

interface MapScreenInfoCardProps {
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  onInfoCardClose: () => void;
  onViewDetails: (locationId: string) => void;
}

const MapScreenInfoCard: React.FC<MapScreenInfoCardProps> = React.memo(({
  showInfoCard,
  selectedLocation,
  infoCardPosition,
  onInfoCardClose,
  onViewDetails
}) => {
  if (!showInfoCard || !selectedLocation || (selectedLocation.type !== "Restaurant" && selectedLocation.type !== "Grocery")) {
    return null;
  }

  return (
    <MapInfoCard
      location={selectedLocation}
      position={infoCardPosition}
      onClose={onInfoCardClose}
      onViewDetails={onViewDetails}
    />
  );
});

MapScreenInfoCard.displayName = 'MapScreenInfoCard';

export default MapScreenInfoCard;
