import React, { useState, useEffect } from 'react';
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sort, Filter } from "lucide-react";
import LocationCard from './LocationCard';
import { useDebounce } from "@/hooks/use-debounce";
import { Ingredient } from "@/hooks/useIngredientSearch";
import IngredientSearch from '@/components/ingredients/IngredientSearch';
import CheckboxPopover from "../filters/CheckboxPopover";

const PRICE_OPTIONS = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
  { value: "$$$$", label: "$$$$" }
];

const NUTRITION_OPTIONS = [
  { value: "high-protein", label: "High Protein" },
  { value: "low-carb", label: "Low Carb" },
  { value: "low-fat", label: "Low Fat" },
  { value: "keto", label: "Keto Friendly" }
];

const DIETARY_OPTIONS = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "dairy-free", label: "Dairy Free" }
];

const SOURCE_OPTIONS = [
  { value: "organic", label: "Organic" },
  { value: "local", label: "Local" },
  { value: "seasonal", label: "Seasonal" },
  { value: "sustainable", label: "Sustainable" }
];

const LocationList = () => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const [locations, setLocations] = useState([
    {
      id: '1',
      name: 'Delicious Delights',
      address: '123 Main St',
      lat: 34.0522,
      lng: -118.2437,
      distance: 0.5,
      price: '$$',
    },
    {
      id: '2',
      name: 'Gourmet Grub',
      address: '456 Elm St',
      lat: 34.0522,
      lng: -118.2437,
      distance: 1.2,
      price: '$$$',
    },
    {
      id: '3',
      name: 'Tasty Treats',
      address: '789 Oak St',
      lat: 34.0522,
      lng: -118.2437,
      distance: 2.1,
      price: '$',
    },
  ]);
  const [sortBy, setSortBy] = useState<"distance" | "price">("distance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const cuisineOptions = [
    { value: "italian", label: "Italian" },
    { value: "mexican", label: "Mexican" },
    { value: "chinese", label: "Chinese" },
    { value: "american", label: "American" },
  ];

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  useEffect(() => {
    // Apply price filter
    updateMapFilters({ priceRange: selectedPrices.join(',') });
  }, [selectedPrices, updateMapFilters]);

  useEffect(() => {
    // Simulate fetching locations based on search term
    // In a real app, this would be an API call
    const filteredLocations = locations.filter((location) =>
      location.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setLocations(filteredLocations);
  }, [debouncedSearchTerm]);

  const handleSort = (sortType: "distance" | "price") => {
    setSortBy(sortType);
    const sortedLocations = [...locations].sort((a, b) => {
      if (sortType === "distance") {
        return (a.distance || 0) - (b.distance || 0);
      } else {
        const priceMap = { $: 1, "$$": 2, "$$$": 3, "$$$$": 4 };
        return (priceMap[a.price || "$"] || 0) - (priceMap[b.price || "$"] || 0);
      }
    });
    setLocations(sortedLocations);
  };

  return (
    <div className="h-full bg-background">
      <div className="p-4 border-b">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {/* Sort button */}
            <Button
              variant="outline"
              onClick={() => handleSort(sortBy === "distance" ? "price" : "distance")}
            >
              <Sort className="w-4 h-4 mr-2" />
              Sort by {sortBy === "distance" ? "Price" : "Distance"}
            </Button>

            {/* Filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh]">
                <div className="space-y-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Price Range Multi-select */}
                    <CheckboxPopover
                      options={PRICE_OPTIONS}
                      selectedValues={selectedPrices}
                      onChange={setSelectedPrices}
                      triggerText="Price Range"
                    />

                    {/* Cuisine Type (Single Select) */}
                    <Select
                      value={mapFilters.cuisine}
                      onValueChange={(value) => updateMapFilters({ cuisine: value })}
                    >
                      <SelectTrigger className="w-[140px] bg-background">
                        <SelectValue placeholder="Cuisine Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        {cuisineOptions.map((cuisine) => (
                          <SelectItem key={cuisine.value} value={cuisine.value}>
                            {cuisine.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Nutrition Focus Multi-select */}
                    <CheckboxPopover
                      options={NUTRITION_OPTIONS}
                      selectedValues={mapFilters.nutrition}
                      onChange={(values) => updateMapFilters({ nutrition: values })}
                      triggerText="Nutrition"
                    />

                    {/* Dietary Restrictions Multi-select */}
                    <CheckboxPopover
                      options={DIETARY_OPTIONS}
                      selectedValues={mapFilters.dietary}
                      onChange={(values) => updateMapFilters({ dietary: values })}
                      triggerText="Dietary"
                    />

                    {/* Sources Multi-select */}
                    <CheckboxPopover
                      options={SOURCE_OPTIONS}
                      selectedValues={mapFilters.sources}
                      onChange={(values) => updateMapFilters({ sources: values })}
                      triggerText="Sources"
                    />
                  </div>

                  {/* Ingredient search sections */}
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Location cards section */}
      <div className="p-4 space-y-4">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

export default LocationList;
