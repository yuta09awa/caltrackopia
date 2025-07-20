
import React from 'react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";

interface MapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const MapScreenList: React.FC<MapScreenListProps> = React.memo(({
  listRef,
  selectedLocationId,
  onScroll
}) => {
  return (
    <div 
      ref={listRef}
      className="flex-1 bg-background rounded-t-xl shadow-lg relative z-10 overflow-y-auto sm:rounded-none sm:shadow-none"
      onScroll={onScroll}
      style={{
        // Mobile-specific height calculation
        height: 'calc(100vh - var(--map-height, 50vh) - 100px)',
        minHeight: '300px'
      }}
    >
      {/* Mobile drag handle */}
      <div className="w-full flex justify-center py-2 sm:hidden">
        <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
      </div>
      
      {/* Mobile cache status */}
      <div className="sm:hidden px-4 pb-2">
        <CacheStatusIndicator cacheHitRate={null} />
      </div>
      
      <LocationList selectedLocationId={selectedLocationId} />
    </div>
  );
});

MapScreenList.displayName = 'MapScreenList';

export default MapScreenList;
