
import React from "react";
import FilterPanel from "./FilterPanel";
import { Filter } from "lucide-react";
import { LocationType } from "@/features/locations/types";

interface MapSidebarProps {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  activeTab?: LocationType;
  cuisineOptions: Array<{ value: string; label: string }>;
  groceryCategoryOptions: Array<{ value: string; label: string }>;
  onApplyFilters: () => void;
}

const MapSidebar = ({
  priceFilter,
  setPriceFilter,
  activeTab = 'all',
  cuisineOptions,
  groceryCategoryOptions,
  onApplyFilters,
}: MapSidebarProps) => {
  return (
    <div className="w-[280px] hidden md:block border-r border-border bg-card">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <FilterPanel
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          cuisineOptions={cuisineOptions}
          groceryCategoryOptions={groceryCategoryOptions}
          activeTab={activeTab}
          onApplyFilters={onApplyFilters}
        />
      </div>
    </div>
  );
};

export default MapSidebar;
