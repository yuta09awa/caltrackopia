
import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PriceRangeFilter from '@/features/map/components/filters/PriceRangeFilter';
import CuisineFilter from '@/features/map/components/filters/CuisineFilter';
import GroceryCategoryFilter from '@/features/map/components/filters/GroceryCategoryFilter';
import CategoryFilter from '@/features/map/components/filters/CategoryFilter';
import IngredientSearch from '@/components/ingredients/IngredientSearch';
import { LocationType } from '@/features/locations/hooks/useLocations';

type FilterCategory = {
  id: string;
  label: string;
  options: { id: string; label: string }[];
};

// Reordered filter categories based on importance
const filterCategories: FilterCategory[] = [
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

type FilterPanelProps = {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  cuisineOptions: Array<{ value: string, label: string }>;
  groceryCategoryOptions: Array<{ value: string, label: string }>;
  activeTab?: LocationType;
  onApplyFilters: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceFilter,
  setPriceFilter,
  cuisineOptions,
  groceryCategoryOptions,
  activeTab = 'all',
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
    updateMapFilters({ 
      cuisine: 'all',
      groceryCategory: 'all',
      priceRange: null,
      sources: [],
      dietary: [],
      nutrition: [],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 p-3 overflow-y-auto">
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

        {(activeTab === 'all' || activeTab === 'restaurant') && (
          <CuisineFilter cuisineOptions={cuisineOptions} />
        )}

        {activeTab === 'grocery' && (
          <GroceryCategoryFilter categoryOptions={groceryCategoryOptions} />
        )}

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
