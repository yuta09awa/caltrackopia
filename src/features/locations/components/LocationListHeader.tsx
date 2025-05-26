
import React from "react";
import LocationTabs from "./LocationTabs";
import LocationFilters from "./LocationFilters";
import OpenNowFilter from "@/features/map/components/filters/OpenNowFilter";
import { LocationType, SortOption } from "../types";

interface LocationListHeaderProps {
  totalCount: number;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const LocationListHeader: React.FC<LocationListHeaderProps> = ({
  totalCount,
  sortOption,
  setSortOption
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {totalCount} {totalCount === 1 ? 'Location' : 'Locations'}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="default">Default</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
          <option value="distance-near">Closest First</option>
          <option value="distance-far">Farthest First</option>
          <option value="open-first">Open Now</option>
        </select>
      </div>
    </div>
  );
};

export default LocationListHeader;
