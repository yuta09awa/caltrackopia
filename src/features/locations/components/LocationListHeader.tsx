import React from "react";
import LocationTabs from "./LocationTabs";
import LocationFilters from "./LocationFilters";
import OpenNowFilter from "@/features/map/components/filters/OpenNowFilter";
import { LocationType, SortOption } from "../types";

interface LocationListHeaderProps {
  activeTab: LocationType;
  filterByType: (type: LocationType) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isOpenNow: boolean;
  setIsOpenNow: (isOpen: boolean) => void;
}

const LocationListHeader: React.FC<LocationListHeaderProps> = ({
  activeTab,
  filterByType,
  sortOption,
  setSortOption,
  isOpenNow,
  setIsOpenNow
}) => {
  const handleOpenNowChange = (checked: boolean) => {
    setIsOpenNow(checked);
    if (checked) {
      setSortOption("open-first");
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-border">
      <div className="flex items-center gap-2">
        <LocationTabs activeTab={activeTab} onTabChange={filterByType} />
      </div>
      
      <div className="flex items-center gap-3">
        <OpenNowFilter checked={isOpenNow} onChange={handleOpenNowChange} />
        
        <LocationFilters 
          sortOption={sortOption}
          setSortOption={setSortOption}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default LocationListHeader;
