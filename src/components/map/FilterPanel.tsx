
import React from 'react';
import { useAppStore } from '@/store/appStore';
import IngredientSearch from '@/components/ingredients/IngredientSearch';
import { Ingredient } from '@/hooks/useIngredientSearch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

type FilterPanelProps = {
  isOpen: boolean;
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  cuisineOptions: Array<{ value: string, label: string }>;
  onApplyFilters: () => void;
  onSelectIngredient?: (ingredient: Ingredient) => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  priceFilter,
  setPriceFilter,
  cuisineOptions,
  onApplyFilters,
  onSelectIngredient
}) => {
  // Using the global state for user preferences
  const { userPreferences } = useAppStore();
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 right-4 z-20 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-100 animate-fade-in max-h-[80vh] overflow-y-auto">
      <h3 className="font-medium mb-3">Filter Options</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Price Range</label>
          <div className="flex gap-2 mt-1">
            {['$', '$$', '$$$', '$$$$'].map((price) => (
              <button
                key={price}
                onClick={() => setPriceFilter(price === priceFilter ? null : price)}
                className={`flex-1 py-1 px-2 rounded-md border ${
                  price === priceFilter
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                } transition-colors text-center`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Dietary Preferences</label>
          <Select>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="All Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Options</SelectItem>
              <SelectItem value="high-protein">High Protein</SelectItem>
              <SelectItem value="high-fiber">High Fiber</SelectItem>
              <SelectItem value="low-fat">Low Fat</SelectItem>
              <SelectItem value="keto">Keto Friendly</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Cuisine Type</label>
          <Select>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="All Cuisines" />
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
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Include Ingredients</label>
          <IngredientSearch 
            onSelectIngredient={onSelectIngredient} 
            className="p-0 m-0" 
            compact={true}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Exclude Ingredients</label>
          <input 
            type="text" 
            placeholder="e.g., peanuts, gluten, MSG" 
            className="w-full p-2 rounded-md border border-gray-200 text-sm"
          />
        </div>
        <button 
          className="w-full bg-primary text-white p-2 rounded-md text-sm mt-2"
          onClick={onApplyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
