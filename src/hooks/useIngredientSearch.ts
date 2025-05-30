
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

// Mock data for demo purposes
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Organic Kale',
    description: 'Fresh locally grown kale',
    category: 'Vegetables',
    locations: [
      { id: 'loc1', name: 'Farmers Market', address: '123 Market St', lat: 40.7589, lng: -73.9851 },
      { id: 'loc2', name: 'Green Grocery', address: '456 Organic Ave', lat: 40.7505, lng: -73.9934 }
    ]
  },
  {
    id: '2',
    name: 'Grass-fed Beef',
    description: 'Sustainably raised beef',
    category: 'Meat',
    locations: [
      { id: 'loc3', name: 'Butcher Shop', address: '789 Meat St', lat: 40.7580, lng: -73.9840 }
    ]
  },
  {
    id: '3',
    name: 'Avocado',
    description: 'Ripe Hass avocados',
    category: 'Fruits',
    locations: [
      { id: 'loc4', name: 'Grocery Store', address: '101 Fresh Blvd', lat: 40.7600, lng: -73.9800 },
      { id: 'loc5', name: 'Farmers Market', address: '123 Market St', lat: 40.7589, lng: -73.9851 }
    ]
  },
  {
    id: '4',
    name: 'Whole Foods',
    description: 'Whole Foods Market - organic groceries',
    category: 'Grocery Store',
    locations: [
      { id: 'loc6', name: 'Whole Foods Union Square', address: '4 Union Square S, New York, NY', lat: 40.7359, lng: -73.9911 },
      { id: 'loc7', name: 'Whole Foods Tribeca', address: '270 Greenwich St, New York, NY', lat: 40.7205, lng: -74.0134 }
    ]
  },
  {
    id: '5',
    name: 'Quinoa',
    description: 'Organic quinoa grain',
    category: 'Grains',
    locations: [
      { id: 'loc8', name: 'Health Food Store', address: '789 Wellness Ave', lat: 40.7550, lng: -73.9900 }
    ]
  },
  {
    id: '6',
    name: 'Salmon',
    description: 'Fresh Atlantic salmon',
    category: 'Seafood',
    locations: [
      { id: 'loc9', name: 'Fish Market', address: '456 Harbor St', lat: 40.7520, lng: -73.9950 }
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
