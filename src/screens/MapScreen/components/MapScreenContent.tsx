
import React from 'react';
import MapContainer from "@/features/map/components/MapContainer";
import MapInfoCard from "@/features/map/components/MapInfoCard";
import { Ingredient } from "@/models/NutritionalInfo";
import { Location } from "@/features/locations/types";
import { MapState, LatLng } from "@/features/map/hooks/useMapState";

interface MapScreenContentProps {
  mapHeight: string;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  mapState: MapState;
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  onLocationSelect: (locationId: string) => void;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMapLoaded: (map: google.maps.Map) => void;
  onMapIdle: (center: LatLng, zoom: number) => void;
  onInfoCardClose: () => void;
  onViewDetails: (locationId: string) => void;
}

const MapScreenContent: React.FC<MapScreenContentProps> = ({
  mapHeight,
  selectedIngredient,
  currentSearchQuery,
  mapState,
  showInfoCard,
  selectedLocation,
  infoCardPosition,
  onLocationSelect,
  onMarkerClick,
  onMapLoaded,
  onMapIdle,
  onInfoCardClose,
  onViewDetails
}) => {
  return (
    <div className="relative">
      <MapContainer 
        height={mapHeight}
        selectedIngredient={selectedIngredient}
        onLocationSelect={onLocationSelect}
        selectedLocationId={mapState.selectedLocationId}
        onMarkerClick={onMarkerClick}
        mapState={mapState}
        searchQuery={currentSearchQuery}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      />
      
      {showInfoCard && selectedLocation && (selectedLocation.type === "Restaurant" || selectedLocation.type === "Grocery") && (
        <MapInfoCard
          location={selectedLocation}
          position={infoCardPosition}
          onClose={onInfoCardClose}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};

export default MapScreenContent;
