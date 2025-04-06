
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
}

export const useIngredientSearch = () => {
  const [results, setResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchIngredients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an actual API endpoint
      // For demo purposes, we'll simulate an API call and return mock data
      const data = await httpClient.get<Ingredient[]>(`/api/ingredients?query=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err: any) {
      console.error('Ingredient search failed:', err);
      setError(err.message || 'An error occurred while searching ingredients');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    searchIngredients,
  };
};
