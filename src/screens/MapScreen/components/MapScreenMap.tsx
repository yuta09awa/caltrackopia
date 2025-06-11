
import React from 'react';
import MapComponent from "@/features/map/components/MapComponent";

interface MapScreenMapProps {
  mapHeight: string;
}

const MapScreenMap: React.FC<MapScreenMapProps> = React.memo(({
  mapHeight
}) => {
  return (
    <MapComponent height={mapHeight} />
  );
});

MapScreenMap.displayName = 'MapScreenMap';

export default MapScreenMap;
