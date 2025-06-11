
import React from 'react';
import MapScreenMap from './MapScreenMap';
import MapScreenInfoCard from './MapScreenInfoCard';

interface MapScreenContentProps {
  mapHeight: string;
}

const MapScreenContent: React.FC<MapScreenContentProps> = React.memo(({
  mapHeight
}) => {
  return (
    <div className="relative">
      <MapScreenMap mapHeight={mapHeight} />
      <MapScreenInfoCard />
    </div>
  );
});

MapScreenContent.displayName = 'MapScreenContent';

export default MapScreenContent;
