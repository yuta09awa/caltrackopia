
import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import PriceRangeFilter from '@/components/map/filters/PriceRangeFilter';
import CuisineFilter from '@/components/map/filters/CuisineFilter';
import CategoryFilter from '@/components/map/filters/CategoryFilter';
import IngredientSearch from '@/components/ingredients/IngredientSearch';

type FilterSheetProps = {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  cuisineOptions: Array<{ value: string, label: string }>;
  onApplyFilters: () => void;
};

const filterCategories = [
  {
    id: 'dietary',
    label: 'Dietary Restrictions',
    options: [
      { id: 'vegan', label: 'Vegan' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'gluten-free', label: 'Gluten Free' },
      { id: 'dairy-free', label: 'Dairy Free' }
    ]
  },
  {
    id: 'nutrition',
    label: 'Nutrition Focus',
    options: [
      { id: 'high-protein', label: 'High Protein' },
      { id: 'low-carb', label: 'Low Carb' },
      { id: 'low-fat', label: 'Low Fat' },
      { id: 'keto', label: 'Keto Friendly' }
    ]
  },
  {
    id: 'sources',
    label: 'Ingredient Sources',
    options: [
      { id: 'organic', label: 'Organic' },
      { id: 'local', label: 'Local' },
      { id: 'seasonal', label: 'Seasonal' },
      { id: 'sustainable', label: 'Sustainable' }
    ]
  }
];

const FilterSheet: React.FC<FilterSheetProps> = ({
  priceFilter,
  setPriceFilter,
  cuisineOptions,
  onApplyFilters,
}) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const isMobile = useIsMobile();
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
    updateMapFilters({ 
      cuisine: 'all', // Using 'all' instead of empty string
      priceRange: null,
      sources: [],
      dietary: [],
      nutrition: [],
      excludeIngredients: [],
    });
  };

  const Content = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Include Ingredients</label>
          <IngredientSearch compact={true} placeholder="Search ingredients to include..." />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Exclude Ingredients</label>
          <IngredientSearch compact={true} placeholder="Search ingredients to exclude..." />
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
