
import React from "react";
import { useLocations } from '../hooks/useLocations';
import LocationCard from "./LocationCard";
import LocationFilters from "./LocationFilters";
import LocationTabs from "./LocationTabs";

const LocationList = () => {
  const { locations, activeTab, filterByType, sortOption, setSortOption } = useLocations();
  
  return (
    <div className="w-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Tab buttons for All/Restaurant/Groceries */}
          <LocationTabs activeTab={activeTab} onTabChange={filterByType} />
        </div>
        
        <LocationFilters sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      
      <div className="max-h-[500px] overflow-auto">
        {locations.map((location) => (
          <LocationCard 
            key={location.id}
            location={location}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationList;
