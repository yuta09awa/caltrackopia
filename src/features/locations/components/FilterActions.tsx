
import React from 'react';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/appStore";
import { Checkbox } from "@/components/ui/checkbox";
import IngredientSearch from "@/components/ingredients/IngredientSearch";
import OpenNowFilter from "@/features/map/components/filters/OpenNowFilter";

interface FilterActionsProps {
  isOpenNow: boolean;
  setIsOpenNow: (isOpen: boolean) => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  isOpenNow,
  setIsOpenNow
}) => {
  const { mapFilters, updateMapFilters } = useAppStore();

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <OpenNowFilter checked={isOpenNow} onChange={setIsOpenNow} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
            <Filter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:text-xs">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <div className="p-2">
            <div className="space-y-4">
              {/* Nutrition Focus Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">Nutrition Focus</label>
                <div className="grid grid-cols-2 gap-1">
                  {['high-protein', 'low-carb', 'low-fat', 'keto'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <Checkbox
                        checked={mapFilters.nutrition.includes(option)}
                        onCheckedChange={(checked) => {
                          const newNutrition = checked
                            ? [...mapFilters.nutrition, option]
                            : mapFilters.nutrition.filter(n => n !== option);
                          updateMapFilters({ nutrition: newNutrition });
                        }}
                      />
                      <span className="text-sm capitalize">{option.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="text-sm font-medium mb-2 block">Dietary Restrictions</label>
                <div className="grid grid-cols-2 gap-1">
                  {['vegan', 'vegetarian', 'gluten-free', 'dairy-free'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <Checkbox
                        checked={mapFilters.dietary.includes(option)}
                        onCheckedChange={(checked) => {
                          const newDietary = checked
                            ? [...mapFilters.dietary, option]
                            : mapFilters.dietary.filter(d => d !== option);
                          updateMapFilters({ dietary: newDietary });
                        }}
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingredient Sources */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ingredient Sources</label>
                <div className="grid grid-cols-2 gap-1">
                  {['organic', 'local', 'seasonal', 'sustainable'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <Checkbox
                        checked={mapFilters.sources.includes(option)}
                        onCheckedChange={(checked) => {
                          const newSources = checked
                            ? [...mapFilters.sources, option]
                            : mapFilters.sources.filter(s => s !== option);
                          updateMapFilters({ sources: newSources });
                        }}
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingredients Search Section */}
              <div className="space-y-4">
                <IngredientSearch
                  compact={true}
                  className="w-full"
                  placeholder="Include..."
                  onSelectIngredient={(ingredient) => {
                    // Handle included ingredient selection
                  }}
                />
                
                <IngredientSearch
                  compact={true}
                  className="w-full"
                  placeholder="Exclude..."
                  onSelectIngredient={(ingredient) => {
                    // Handle excluded ingredient selection
                  }}
                />
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterActions;
