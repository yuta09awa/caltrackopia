
import React from 'react';
import { useAppStore } from '@/app/store';
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import PriceRangeFilter from './filters/PriceRangeFilter';
import CuisineFilter from './filters/CuisineFilter';
import CategoryFilter from './filters/CategoryFilter';
import IngredientSearch from '@/features/ingredients/components/IngredientSearch';
import { filterCategories, defaultFilterValues, cuisineOptions } from '../config/filterConfig';

type FilterSheetProps = {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  onApplyFilters: () => void;
};

const FilterSheet: React.FC<FilterSheetProps> = ({
  priceFilter,
  setPriceFilter,
  onApplyFilters,
}) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({
    sources: mapFilters.sources || [],
    dietary: mapFilters.dietary || [],
    nutrition: mapFilters.nutrition || [],
  });

  React.useEffect(() => {
    updateMapFilters({
      sources: selectedFilters.sources,
      dietary: selectedFilters.dietary,
      nutrition: selectedFilters.nutrition,
    });
  }, [selectedFilters, updateMapFilters]);

  const handleCheckboxChange = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[categoryId] || [];
      const updated = categoryFilters.includes(optionId)
        ? categoryFilters.filter(id => id !== optionId)
        : [...categoryFilters, optionId];
      
      return {
        ...prev,
        [categoryId]: updated
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      sources: [],
      dietary: [],
      nutrition: [],
    });
    setPriceFilter(null);
    updateMapFilters(defaultFilterValues);
  };

  const Content = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Include Ingredients</label>
          <IngredientSearch compact={true} />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Exclude Ingredients</label>
          <IngredientSearch compact={true} />
        </div>
      </div>

      <PriceRangeFilter 
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
      />

      <CuisineFilter cuisineOptions={cuisineOptions} />

      {filterCategories.map((category) => (
        <CategoryFilter
          key={category.id}
          label={category.label}
          options={category.options}
          selectedOptions={selectedFilters[category.id] || []}
          onOptionChange={(optionId) => handleCheckboxChange(category.id, optionId)}
        />
      ))}

      <Button
        variant="outline"
        className="w-full"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  const isMobile = useIsMobile();

  return isMobile ? (
    <DrawerContent>
      <div className="px-4 py-6">
        <Content />
      </div>
    </DrawerContent>
  ) : (
    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
      <Content />
    </SheetContent>
  );
};

export default FilterSheet;
