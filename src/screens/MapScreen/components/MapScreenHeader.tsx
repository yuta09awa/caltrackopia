
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import GlobalSearch from "@/components/search/GlobalSearch";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Ingredient } from "@/models/NutritionalInfo";

interface MapScreenHeaderProps {
  displayedSearchQuery: string;
  onSelectIngredient: (ingredient: Ingredient) => void;
  onSearchReset: () => void;
}

const MapScreenHeader: React.FC<MapScreenHeaderProps> = ({
  displayedSearchQuery,
  onSelectIngredient,
  onSearchReset
}) => {
  return (
    <Navbar>
      <div className="flex-1 max-w-2xl mx-4">
        <GlobalSearch 
          onSelectIngredient={onSelectIngredient}
          onSearchReset={onSearchReset}
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
};

export default MapScreenHeader;
