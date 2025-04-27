
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import FilterPanel from "./FilterPanel";
import { Filter } from "lucide-react";
import { Ingredient } from "@/hooks/useIngredientSearch";

interface MapSidebarProps {
  isFilterOpen?: boolean;
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  cuisineOptions: Array<{ value: string; label: string }>;
  onApplyFilters: () => void;
  onSelectIngredient?: (ingredient: Ingredient) => void;
}

const MapSidebar = ({
  priceFilter,
  setPriceFilter,
  cuisineOptions,
  onApplyFilters,
  onSelectIngredient,
}: MapSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search & Filter</SidebarGroupLabel>
          <SidebarGroupContent>
            <FilterPanel
              isOpen={true}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              cuisineOptions={cuisineOptions}
              onApplyFilters={onApplyFilters}
              onSelectIngredient={onSelectIngredient}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default MapSidebar;
