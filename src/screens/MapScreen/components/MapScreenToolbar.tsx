import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Search, 
  Filter,
  MapPin,
  Layers,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EnhancedGlobalSearch from '@/components/search/EnhancedGlobalSearch';
import { Ingredient } from '@/models/NutritionalInfo';

interface MapScreenToolbarProps {
  onMenuToggle: () => void;
  onSearchIngredient: (ingredient: Ingredient) => void;
  onSearchReset: () => void;
  searchValue: string;
  activeFiltersCount?: number;
  onFilterToggle?: () => void;
  onLayersToggle?: () => void;
  onSettingsToggle?: () => void;
  className?: string;
}

const MapScreenToolbar: React.FC<MapScreenToolbarProps> = ({
  onMenuToggle,
  onSearchIngredient,
  onSearchReset,
  searchValue,
  activeFiltersCount = 0,
  onFilterToggle,
  onLayersToggle,
  onSettingsToggle,
  className
}) => {
  return (
    <div className={cn(
      "absolute top-4 left-4 right-4 z-40 flex items-center gap-3",
      "bg-background/80 backdrop-blur-md rounded-lg border border-border/50 p-3 shadow-lg",
      className
    )}>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="flex-shrink-0 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <EnhancedGlobalSearch
          onSelectIngredient={onSearchIngredient}
          onSearchReset={onSearchReset}
          displayValue={searchValue}
          compact
          showSuggestions={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Filter Button with Badge */}
        {onFilterToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilterToggle}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Current Location Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Get current location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log('Current position:', position.coords);
                  // Handle location update
                },
                (error) => {
                  console.error('Error getting location:', error);
                }
              );
            }
          }}
          className="hidden sm:flex"
        >
          <MapPin className="h-4 w-4" />
        </Button>

        {/* Map Layers Toggle */}
        {onLayersToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLayersToggle}
            className="hidden md:flex"
          >
            <Layers className="h-4 w-4" />
          </Button>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative hidden lg:flex"
        >
          <Bell className="h-4 w-4" />
          <div className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></div>
        </Button>

        {/* Settings */}
        {onSettingsToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsToggle}
            className="hidden xl:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapScreenToolbar;