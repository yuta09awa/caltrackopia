
// src/features/map/config/filterConfig.ts

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export const filterCategories: FilterCategory[] = [
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

export const defaultFilterValues = {
  dietary: [],
  nutrition: [],
  sources: [],
  priceRange: null,
  cuisine: 'all',
  groceryCategory: 'all',
  excludeIngredients: []
};

// Cuisine options configuration
export const cuisineOptions = [
  { value: "american", label: "American" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "asian", label: "Asian" },
  { value: "italian", label: "Italian" },
];

// Grocery category options configuration
export const groceryCategoryOptions = [
  { value: "produce", label: "Produce" },
  { value: "dairy", label: "Dairy" },
  { value: "bakery", label: "Bakery" },
  { value: "meat", label: "Meat & Seafood" },
  { value: "organic", label: "Organic" },
  { value: "frozen", label: "Frozen Foods" },
];
