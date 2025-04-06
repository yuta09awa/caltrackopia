
import { useState, useCallback } from 'react';
import { httpClient } from '@/utils/http_client/http_client_factory';

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

export const useIngredientSearch = () => {
  const [results, setResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const searchIngredients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an actual API endpoint
      // For demo purposes, we'll simulate an API call and return mock data
      const data = await httpClient.get<Ingredient[]>(`/api/ingredients?query=${encodeURIComponent(query)}`);
      
      // For each ingredient, we would typically get location data from the API
      // Here we're simulating that the API already includes location data
      setResults(data);
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

