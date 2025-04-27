
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
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({});

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
    setSelectedFilters({});
    setPriceFilter(null);
    updateMapFilters({ cuisine: 'all' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <label className="text-sm text-muted-foreground block mb-2">Price Range</label>
          <div className="flex gap-2">
            {['$', '$$', '$$$', '$$$$'].map((price) => (
              <button
                key={price}
                onClick={() => setPriceFilter(price === priceFilter ? null : price)}
                className={`flex-1 py-1 px-2 rounded-md border ${
                  price === priceFilter
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                } transition-colors text-center`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-2">Cuisine Type</label>
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
          <div key={category.id} className="space-y-3">
            <label className="text-sm text-muted-foreground block">
              {category.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {category.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    id={option.id}
                    checked={(selectedFilters[category.id] || []).includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(category.id, option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={clearAllFilters}
        >
          <XCircle className="h-4 w-4" />
          Clear All Filters
        </Button>
      </div>

      <div className="p-4 border-t">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4">
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
