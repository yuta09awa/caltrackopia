
import React, { useState, useMemo } from 'react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import LocationSidebarHeader from "./LocationSidebarHeader";
import { Location } from '@/models/Location';
import { LocationType } from '@/features/locations/types';
import { filterLocationsByType, filterLocationsByOpenStatus, sortLocations } from '@/features/locations/utils/locationUtils';

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
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState('default');
  const [isOpenNow, setIsOpenNow] = useState(false);

  const filteredLocations = useMemo(() => {
    let filtered = filterLocationsByType(locations, activeTab);
    filtered = filterLocationsByOpenStatus(filtered, isOpenNow);
    filtered = sortLocations(filtered, sortOption as any);
    
    return filtered;
  }, [locations, activeTab, isOpenNow, sortOption]);

  const handleTabChange = (tab: LocationType) => {
    setActiveTab(tab);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };

  const handleOpenNowToggle = (enabled: boolean) => {
    setIsOpenNow(enabled);
  };
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
          locations={filteredLocations}
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
        locationCount={filteredLocations.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSortChange={handleSortChange}
        onOpenNowToggle={handleOpenNowToggle}
      />
      
      <div className="flex-1 overflow-y-auto">
        <LocationList
          locations={filteredLocations}
          selectedLocationId={selectedLocationId}
          onLocationSelect={onLocationSelect}
        />
      </div>
    </div>
  );
});

MapScreenList.displayName = 'MapScreenList';

export default MapScreenList;
