
import { useState, useCallback } from 'react';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  category?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  // Added locations where this ingredient can be found
  locations?: Array<{
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number; // miles or km from user
    price?: string; // price indicator ($, $$, $$$)
  }>;
}

// Mock data for demo purposes with real store chains
const mockIngredients: Ingredient[] = [
  {
    id: 'whole-foods',
    name: 'Whole Foods',
    description: 'Whole Foods Market - organic and natural groceries',
    category: 'Grocery Store',
    locations: [
      { id: 'wf1', name: 'Whole Foods Union Square', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 },
      { id: 'wf2', name: 'Whole Foods Tribeca', address: '270 Greenwich St, New York, NY', lat: 40.7205, lng: -74.0134 }
    ]
  },
  {
    id: 'trader-joes',
    name: "Trader Joe's",
    description: "Trader Joe's - unique groceries at great prices",
    category: 'Grocery Store',
    locations: [
      { id: 'tj1', name: "Trader Joe's Union Square", address: '142 E 14th St, New York, NY', lat: 40.7328, lng: -73.9888 }
    ]
  },
  {
    id: 'target',
    name: 'Target',
    description: 'Target - groceries, household items, and more',
    category: 'Department Store',
    locations: [
      { id: 'target1', name: 'Target Tribeca', address: '255 Greenwich St, New York, NY', lat: 40.7133, lng: -74.0103 }
    ]
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    description: 'Starbucks Coffee - coffee and light meals',
    category: 'Restaurant',
    locations: [
      { id: 'sbux1', name: 'Starbucks Midtown', address: '4 Park Ave, New York, NY', lat: 40.7505, lng: -73.9806 }
    ]
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    description: "McDonald's - fast food restaurant",
    category: 'Restaurant',
    locations: [
      { id: 'mcd1', name: "McDonald's Financial District", address: '160 Broadway, New York, NY', lat: 40.7092, lng: -74.0106 }
    ]
  },
  {
    id: 'chipotle',
    name: 'Chipotle',
    description: 'Chipotle Mexican Grill - fresh Mexican food',
    category: 'Restaurant',
    locations: [
      { id: 'chipotle1', name: 'Chipotle Union Square', address: '150 E 14th St, New York, NY', lat: 40.7331, lng: -73.9873 }
    ]
  },
  // Original ingredient-based entries
  {
    id: '1',
    name: 'Organic Kale',
    description: 'Fresh locally grown kale',
    category: 'Vegetables',
    locations: [
      { id: 'wf1', name: 'Whole Foods Market', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 },
      { id: 'tj1', name: "Trader Joe's", address: '142 E 14th St, New York, NY', lat: 40.7328, lng: -73.9888 }
    ]
  },
  {
    id: '2',
    name: 'Grass-fed Beef',
    description: 'Sustainably raised beef',
    category: 'Meat',
    locations: [
      { id: 'wf1', name: 'Whole Foods Market', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 }
    ]
  },
  {
    id: '3',
    name: 'Avocado',
    description: 'Ripe Hass avocados',
    category: 'Fruits',
    locations: [
      { id: 'target1', name: 'Target', address: '255 Greenwich St, New York, NY', lat: 40.7133, lng: -74.0103 },
      { id: 'wf1', name: 'Whole Foods Market', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 }
    ]
  },
  {
    id: '5',
    name: 'Quinoa',
    description: 'Organic quinoa grain',
    category: 'Grains',
    locations: [
      { id: 'wf1', name: 'Whole Foods Market', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 }
    ]
  },
  {
    id: '6',
    name: 'Salmon',
    description: 'Fresh Atlantic salmon',
    category: 'Seafood',
    locations: [
      { id: 'wf1', name: 'Whole Foods Market', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9906 }
    ]
  }
];

export const useIngredientSearch = () => {
  const [results, setResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const searchIngredients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter mock data by search term
      const filteredResults = mockIngredients.filter(
        item => item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.category?.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
    } catch (err: any) {
      console.error('Ingredient search failed:', err);
      setError(err.message || 'An error occurred while searching ingredients');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectIngredient = useCallback((ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  }, []);

  const clearSelectedIngredient = useCallback(() => {
    setSelectedIngredient(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchIngredients,
    selectedIngredient,
    selectIngredient,
    clearSelectedIngredient
  };
};
