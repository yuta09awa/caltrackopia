
import React from 'react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Location } from '@/models/Location';

interface MapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  locations: Location[];
  onLocationSelect: (locationId: string | null) => void;
}

const MapScreenList: React.FC<MapScreenListProps> = React.memo(({
  listRef,
  selectedLocationId,
  onScroll,
  locations,
  onLocationSelect
}) => {
  return (
    <div
      ref={listRef}
      className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10 overflow-y-auto"
      onScroll={onScroll}
    >
      <div className="w-full flex justify-center py-2">
        <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
      </div>

      <div className="sm:hidden px-4 pb-2">
        <CacheStatusIndicator cacheHitRate={null} />
      </div>

      <LocationList
        locations={locations}
        selectedLocationId={selectedLocationId}
        onLocationSelect={onLocationSelect}
      />
    </div>
  );
});

MapScreenList.displayName = 'MapScreenList';

export default MapScreenList;
