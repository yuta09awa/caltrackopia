
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import GlobalSearch from "@/components/search/GlobalSearch";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Ingredient } from "@/models/NutritionalInfo";

interface MapScreenHeaderProps {
  displayedSearchQuery: string;
  onSelectIngredient: (ingredient: Ingredient) => void;
  onSearchReset: () => void;
}

const MapScreenHeader: React.FC<MapScreenHeaderProps> = React.memo(({
  displayedSearchQuery,
  onSelectIngredient,
  onSearchReset
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold md:text-xl">
            {displayedSearchQuery ? `Results for "${displayedSearchQuery}"` : "Discover Locations"}
          </h1>
        </div>
        
        <div className="flex flex-1 items-center justify-center max-w-2xl mx-4">
          <GlobalSearch 
            onSelectIngredient={onSelectIngredient}
            onSearchReset={onSearchReset}
            displayValue={displayedSearchQuery}
            className="w-full"
            compact={true}
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {displayedSearchQuery && (
            <Button variant="ghost" size="icon" onClick={onSearchReset}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="hidden sm:block">
            <CacheStatusIndicator cacheHitRate={null} />
          </div>
        </div>
      </div>
    </header>
  );
});

MapScreenHeader.displayName = 'MapScreenHeader';

export default MapScreenHeader;
