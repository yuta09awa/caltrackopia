
import React from 'react';
import { useAppStore } from "@/app/store";
import LocationTabs from "./LocationTabs";
import InlineFilters from "./InlineFilters";
import FilterActions from "./FilterActions";
import { LocationType } from '../types';
import { cuisineOptions, groceryCategoryOptions } from '@/features/map/config/filterConfig';

interface LocationFiltersProps {
  activeTab: LocationType;
  onTabChange: (type: LocationType) => void;
  isOpenNow: boolean;
  setIsOpenNow: (isOpen: boolean) => void;
}

const LocationFilters: React.FC<LocationFiltersProps> = ({ 
  activeTab,
  onTabChange,
  isOpenNow,
  setIsOpenNow
}) => {
  return (
    <div className="py-2 border-b border-border">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <LocationTabs activeTab={activeTab} onTabChange={onTabChange} />
          <InlineFilters
            activeTab={activeTab}
            cuisineOptions={cuisineOptions}
            groceryCategoryOptions={groceryCategoryOptions}
          />
        </div>
        
        <FilterActions 
          isOpenNow={isOpenNow}
          setIsOpenNow={setIsOpenNow}
        />
      </div>
    </div>
  );
};

export default LocationFilters;
