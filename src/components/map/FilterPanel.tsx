import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PriceRangeFilter from './filters/PriceRangeFilter';
import CuisineFilter from './filters/CuisineFilter';
import CategoryFilter from './filters/CategoryFilter';

type FilterCategory = {
  id: string;
  label: string;
  options: { id: string; label: string }[];
};

const filterCategories: FilterCategory[] = [
  {
    id: 'sources',
    label: 'Ingredient Sources',
    options: [
      { id: 'organic', label: 'Organic' },
      { id: 'local', label: 'Local' },
      { id: 'seasonal', label: 'Seasonal' },
      { id: 'sustainable', label: 'Sustainable' }
    ]
  },
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
  }
];

type FilterPanelProps = {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  cuisineOptions: Array<{ value: string, label: string }>;
  onApplyFilters: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceFilter,
  setPriceFilter,
  cuisineOptions,
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
      priceRange: null,
      sources: [],
      dietary: [],
      nutrition: [],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 p-3 overflow-y-auto">
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
