
import React from 'react';
import { useAppStore } from "@/store/appStore";
import LocationTabs from "./LocationTabs";
import InlineFilters from "./InlineFilters";
import FilterActions from "./FilterActions";
import { LocationType } from '../types';

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
  const cuisineOptions = [
    { value: "american", label: "American" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "asian", label: "Asian" },
    { value: "italian", label: "Italian" },
  ];

  const groceryCategoryOptions = [
    { value: "produce", label: "Produce" },
    { value: "dairy", label: "Dairy" },
    { value: "bakery", label: "Bakery" },
    { value: "meat", label: "Meat & Seafood" },
    { value: "organic", label: "Organic" },
    { value: "frozen", label: "Frozen Foods" },
  ];

  return (
    <div className="p-3 border-b border-border">
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
