
import React from 'react';
import MapContainer from "@/features/map/components/MapContainer";
import { Ingredient } from "@/models/NutritionalInfo";
import { MapState, LatLng } from "@/features/map/hooks/useMapState";

interface MapScreenMapProps {
  mapHeight: string;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  mapState: MapState;
  onLocationSelect: (locationId: string) => void;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMapLoaded: (map: google.maps.Map) => void;
  onMapIdle: (center: LatLng, zoom: number) => void;
}

const MapScreenMap: React.FC<MapScreenMapProps> = React.memo(({
  mapHeight,
  selectedIngredient,
  currentSearchQuery,
  mapState,
  onLocationSelect,
  onMarkerClick,
  onMapLoaded,
  onMapIdle
}) => {
  return (
    <MapContainer 
      height={mapHeight}
      onLocationSelect={onLocationSelect}
      selectedLocationId={mapState.selectedLocationId}
      onMarkerClick={onMarkerClick}
      mapState={mapState}
      searchQuery={currentSearchQuery}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
});

MapScreenMap.displayName = 'MapScreenMap';

export default MapScreenMap;
