
import React from 'react';
import MapScreenMap from './MapScreenMap';
import MapScreenInfoCard from './MapScreenInfoCard';
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
  isMobile: boolean;
}

const MapScreenContent: React.FC<MapScreenContentProps> = React.memo(({
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
  onViewDetails,
  isMobile
}) => {
  return (
    <div className="relative">
      <MapScreenMap
        mapHeight={mapHeight}
        selectedIngredient={selectedIngredient}
        currentSearchQuery={currentSearchQuery}
        mapState={mapState}
        onLocationSelect={onLocationSelect}
        onMarkerClick={onMarkerClick}
        onMapLoaded={onMapLoaded}
        onMapIdle={onMapIdle}
      />
      
      <MapScreenInfoCard
        showInfoCard={showInfoCard}
        selectedLocation={selectedLocation}
        infoCardPosition={infoCardPosition}
        onInfoCardClose={onInfoCardClose}
        onViewDetails={onViewDetails}
      />
    </div>
  );
});

MapScreenContent.displayName = 'MapScreenContent';

export default MapScreenContent;
