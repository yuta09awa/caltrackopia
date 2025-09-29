import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/appStore";
import IngredientSearch from "@/components/ingredients/IngredientSearch";
import { LocationType } from "@/features/locations/types";

interface LocationSidebarHeaderProps {
  locationCount: number;
  activeTab: LocationType;
  onTabChange: (tab: LocationType) => void;
  onSortChange?: (sort: string) => void;
  onOpenNowToggle?: (enabled: boolean) => void;
}

const LocationSidebarHeader: React.FC<LocationSidebarHeaderProps> = ({
  locationCount,
  activeTab,
  onTabChange,
  onSortChange,
  onOpenNowToggle
}) => {
  const [sortValue, setSortValue] = useState("default");
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters, updateMapFilters } = useAppStore();

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange?.(value);
  };

  const handleOpenNowToggle = (checked: boolean) => {
    setIsOpenNow(checked);
    onOpenNowToggle?.(checked);
  };

  const tabs: { value: LocationType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'grocery', label: 'Markets' }
  ];

  return (
    <div className="p-3 border-b border-border bg-card">
      {/* Location count, Open Now, and sort */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground leading-tight">
            {locationCount} Location{locationCount !== 1 ? 's' : ''}
          </h3>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={isOpenNow}
              onCheckedChange={handleOpenNowToggle}
              id="open-now"
              className="scale-75"
            />
            <label htmlFor="open-now" className="text-xs text-muted-foreground cursor-pointer">
              Open Now
            </label>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-7 px-2"
            >
              <Filter className="w-3 h-3" />
              <span className="text-xs">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-popover border border-border shadow-lg">
            <div className="p-3">
              <div className="space-y-3">
                {/* Nutrition Focus Section */}
                <div>
                  <label className="text-xs font-medium mb-1 block text-foreground">Nutrition Focus</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['high-protein', 'low-carb', 'low-fat', 'keto'].map((option) => (
                      <label key={option} className="flex items-center gap-1.5 text-xs py-0.5 px-1 rounded hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={mapFilters.nutrition.includes(option)}
                          onCheckedChange={(checked) => {
                            const newNutrition = checked
                              ? [...mapFilters.nutrition, option]
                              : mapFilters.nutrition.filter(n => n !== option);
                            updateMapFilters({ nutrition: newNutrition });
                          }}
                          className="h-3 w-3"
                        />
                        <span className="capitalize leading-none">{option.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="text-xs font-medium mb-1 block text-foreground">Dietary Restrictions</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['vegan', 'vegetarian', 'gluten-free', 'dairy-free'].map((option) => (
                      <label key={option} className="flex items-center gap-1.5 text-xs py-0.5 px-1 rounded hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={mapFilters.dietary.includes(option)}
                          onCheckedChange={(checked) => {
                            const newDietary = checked
                              ? [...mapFilters.dietary, option]
                              : mapFilters.dietary.filter(d => d !== option);
                            updateMapFilters({ dietary: newDietary });
                          }}
                          className="h-3 w-3"
                        />
                        <span className="capitalize leading-none">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ingredient Sources */}
                <div>
                  <label className="text-xs font-medium mb-1 block text-foreground">Ingredient Sources</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['organic', 'local', 'seasonal', 'sustainable'].map((option) => (
                      <label key={option} className="flex items-center gap-1.5 text-xs py-0.5 px-1 rounded hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={mapFilters.sources.includes(option)}
                          onCheckedChange={(checked) => {
                            const newSources = checked
                              ? [...mapFilters.sources, option]
                              : mapFilters.sources.filter(s => s !== option);
                            updateMapFilters({ sources: newSources });
                          }}
                          className="h-3 w-3"
                        />
                        <span className="capitalize leading-none">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ingredients Search Section */}
                <div className="space-y-2">
                  <IngredientSearch
                    compact={true}
                    className="w-full text-xs"
                    placeholder="Include ingredients..."
                    onSelectIngredient={(ingredient) => {
                      const newIncluded = [...mapFilters.includeIngredients, ingredient.name];
                      updateMapFilters({ includeIngredients: newIncluded });
                    }}
                  />
                  
                  <IngredientSearch
                    compact={true}
                    className="w-full text-xs"
                    placeholder="Exclude ingredients..."
                    onSelectIngredient={(ingredient) => {
                      const newExcluded = [...mapFilters.excludeIngredients, ingredient.name];
                      updateMapFilters({ excludeIngredients: newExcluded });
                    }}
                  />
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.value)}
              className="px-2 py-1 h-7 text-xs rounded-full"
            >
              {tab.label}
            </Button>
          ))}
        </div>
        
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSidebarHeader;