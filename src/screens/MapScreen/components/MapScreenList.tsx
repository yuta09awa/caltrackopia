
import React from 'react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import LocationSidebarHeader from "./LocationSidebarHeader";
import { Location } from '@/models/Location';

interface MapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  locations: Location[];
  onLocationSelect: (locationId: string | null) => void;
  isMobile: boolean;
}

const MapScreenList: React.FC<MapScreenListProps> = React.memo(({
  listRef,
  selectedLocationId,
  onScroll,
  locations,
  onLocationSelect,
  isMobile
}) => {
  if (isMobile) {
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
  }

  // Desktop sidebar layout
  return (
    <div
      ref={listRef}
      className="flex flex-col h-full bg-card"
      onScroll={onScroll}
    >
      <LocationSidebarHeader 
        locationCount={locations.length}
      />
      
      <div className="flex-1 overflow-y-auto">
        <LocationList
          locations={locations}
          selectedLocationId={selectedLocationId}
          onLocationSelect={onLocationSelect}
        />
      </div>
    </div>
  );
});

MapScreenList.displayName = 'MapScreenList';

export default MapScreenList;
