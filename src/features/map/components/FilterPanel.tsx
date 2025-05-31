
import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PriceRangeFilter from '@/features/map/components/filters/PriceRangeFilter';
import CuisineFilter from '@/features/map/components/filters/CuisineFilter';
import GroceryCategoryFilter from '@/features/map/components/filters/GroceryCategoryFilter';
import IngredientFilters from './IngredientFilters';
import CategoryFilter from './filters/CategoryFilter';
import { LocationType } from '@/features/locations/types';
import { defaultFilterValues, cuisineOptions, groceryCategoryOptions } from '../config/filterConfig';
import { useDietaryRestrictions } from '../hooks/filters/useDietaryRestrictions';
import { useIngredientSources } from '../hooks/filters/useIngredientSources';
import { useNutritionGoals } from '../hooks/filters/useNutritionGoals';

type FilterPanelProps = {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  activeTab?: LocationType;
  onApplyFilters: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceFilter,
  setPriceFilter,
  activeTab = 'all',
  onApplyFilters,
}) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  
  // Fetch dynamic filter data
  const { data: dietaryOptions = [], isLoading: dietaryLoading } = useDietaryRestrictions();
  const { data: sourceOptions = [] } = useIngredientSources();
  const { data: nutritionOptions = [] } = useNutritionGoals();

  const handleFilterChange = (categoryId: string, optionId: string) => {
    const currentFilters = mapFilters[categoryId as keyof typeof mapFilters] as string[] || [];
    const updated = currentFilters.includes(optionId)
      ? currentFilters.filter(id => id !== optionId)
      : [...currentFilters, optionId];
    
    updateMapFilters({
      [categoryId]: updated
    });
  };

  const clearAllFilters = () => {
    setPriceFilter(null);
    updateMapFilters(defaultFilterValues);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 p-3 overflow-y-auto">
        {/* Enhanced Ingredient Filters */}
        <IngredientFilters />

        <PriceRangeFilter 
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
        />

        {(activeTab === 'all' || activeTab === 'restaurant') && (
          <CuisineFilter cuisineOptions={cuisineOptions} />
        )}

        {activeTab === 'grocery' && (
          <GroceryCategoryFilter categoryOptions={groceryCategoryOptions} />
        )}

        {/* Dynamic Dietary Restrictions Filter */}
        <CategoryFilter
          label="Dietary Restrictions"
          options={dietaryOptions}
          selectedOptions={mapFilters.dietary || []}
          onOptionChange={(optionId) => handleFilterChange('dietary', optionId)}
          isLoading={dietaryLoading}
        />

        {/* Dynamic Nutrition Focus Filter */}
        <CategoryFilter
          label="Nutrition Focus"
          options={nutritionOptions}
          selectedOptions={mapFilters.nutrition || []}
          onOptionChange={(optionId) => handleFilterChange('nutrition', optionId)}
        />

        {/* Ingredient Sources Filter */}
        <CategoryFilter
          label="Ingredient Sources"
          options={sourceOptions}
          selectedOptions={mapFilters.sources || []}
          onOptionChange={(optionId) => handleFilterChange('sources', optionId)}
        />

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>

        <Card className="bg-white border-green-100 mt-4">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Advertisement Space
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilterPanel;
