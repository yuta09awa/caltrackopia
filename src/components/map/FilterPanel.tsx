
import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

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

  // Sync selected filters with store when categories change
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
      <div className="flex-1 space-y-4 p-3 overflow-y-auto">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Price Range</label>
          <div className="flex gap-1">
            {['$', '$$', '$$$', '$$$$'].map((price) => (
              <button
                key={price}
                onClick={() => setPriceFilter(price === priceFilter ? null : price)}
                className={`flex-1 py-1 px-2 rounded-md border text-sm ${
                  price === priceFilter
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                } transition-colors text-center`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Cuisine Type</label>
          <Select
            value={mapFilters.cuisine}
            onValueChange={(value) => updateMapFilters({ cuisine: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisineOptions.map((cuisine) => (
                <SelectItem key={cuisine.value} value={cuisine.value}>
                  {cuisine.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filterCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground block">
              {category.label}
            </label>
            <div className="grid grid-cols-2 gap-1">
              {category.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-2 text-sm p-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    id={option.id}
                    checked={(selectedFilters[category.id] || []).includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(category.id, option.id)}
                    className="h-4 w-4 rounded-sm border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      </div>

      <div className="p-3 border-t bg-green-50/50">
        <Card className="bg-white border-green-100">
          <CardContent className="p-3">
            <p className="text-sm text-center text-muted-foreground">
              Connect with a Nutritionist
              <br />
              <span className="text-xs">(Premium Feature)</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilterPanel;
