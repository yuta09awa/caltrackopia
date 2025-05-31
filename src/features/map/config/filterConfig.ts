
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

// Dynamic filter categories that will be populated from database
export const dynamicFilterCategories: FilterCategory[] = [
  {
    id: 'dietary',
    label: 'Dietary Restrictions',
    options: [], // Will be populated dynamically
  },
  {
    id: 'nutrition',
    label: 'Nutrition Focus',
    options: [], // Will be populated dynamically
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

// Static filter options for components that don't need dynamic loading yet
export const staticFilterOptions = {
  nutritionFocus: [
    { id: 'high-protein', label: 'High Protein' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'low-fat', label: 'Low Fat' },
    { id: 'keto', label: 'Keto Friendly' }
  ]
};

// Legacy export for backward compatibility
export const filterCategories = dynamicFilterCategories;

export const defaultFilterValues = {
  dietary: [],
  nutrition: [],
  sources: [],
  priceRange: null,
  cuisine: 'all',
  groceryCategory: 'all',
  excludeIngredients: [],
  includeIngredients: [], // Added for explicit inclusion filtering
};

// Enhanced cuisine options
export const cuisineOptions = [
  { value: "american", label: "American" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "asian", label: "Asian" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "japanese", label: "Japanese" },
  { value: "thai", label: "Thai" },
  { value: "french", label: "French" },
  { value: "chinese", label: "Chinese" },
  { value: "korean", label: "Korean" },
  { value: "vietnamese", label: "Vietnamese" },
];

// Enhanced grocery category options
export const groceryCategoryOptions = [
  { value: "produce", label: "Produce" },
  { value: "dairy", label: "Dairy" },
  { value: "bakery", label: "Bakery" },
  { value: "meat", label: "Meat & Seafood" },
  { value: "organic", label: "Organic" },
  { value: "frozen", label: "Frozen Foods" },
  { value: "pantry", label: "Pantry Staples" },
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks" },
  { value: "deli", label: "Deli" },
  { value: "health", label: "Health & Wellness" },
];
