
import React from 'react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";

interface MapScreenListProps {
  selectedLocationId: string | null;
  onScroll: () => void;
}

const MapScreenList: React.FC<MapScreenListProps> = React.memo(({
  selectedLocationId,
  onScroll
}) => {
  return (
    <div className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10">
      <div className="w-full flex justify-center py-2">
        <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
      </div>
      
      <div className="sm:hidden px-4 pb-2">
        <CacheStatusIndicator cacheHitRate={null} />
      </div>
      
      <LocationList 
        selectedLocationId={selectedLocationId} 
        onScroll={onScroll}
      />
    </div>
  );
});

MapScreenList.displayName = 'MapScreenList';

export default MapScreenList;
