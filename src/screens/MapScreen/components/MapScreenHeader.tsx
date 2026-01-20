
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import GlobalSearch from "@/components/search/GlobalSearch";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Ingredient } from "@/models/NutritionalInfo";

interface MapScreenHeaderProps {
  displayedSearchQuery: string;
  onSelectIngredient: (ingredient: Ingredient) => void;
  onSearchReset: () => void;
  onSearchOnMap?: (query: string) => void;
}

const MapScreenHeader: React.FC<MapScreenHeaderProps> = React.memo(({
  displayedSearchQuery,
  onSelectIngredient,
  onSearchReset,
  onSearchOnMap
}) => {
  return (
    <Navbar>
      <div className="flex-1 max-w-2xl mx-4">
        <GlobalSearch 
          onSelectIngredient={onSelectIngredient}
          onSearchReset={onSearchReset}
          onSearchOnMap={onSearchOnMap}
          displayValue={displayedSearchQuery}
          className="w-full"
          compact={true}
        />
      </div>
      <div className="hidden sm:block">
        <CacheStatusIndicator cacheHitRate={null} />
      </div>
    </Navbar>
  );
});

MapScreenHeader.displayName = 'MapScreenHeader';

export default MapScreenHeader;
