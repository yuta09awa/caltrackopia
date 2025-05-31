
import { useState, useCallback } from 'react';
import { nutritionService, IngredientNutrition } from '@/services/nutritionService';
import { Location } from '@/models/Location';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  description?: string;
  locations?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>;
  nutrition?: IngredientNutrition;
}

export function useIngredientSearch() {
  const [results, setResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchIngredients = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Search ingredients using the nutrition service
      const ingredientResults = await nutritionService.searchIngredients(query, 20);
      
      // Transform to the expected format
      const transformedResults: Ingredient[] = ingredientResults.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        description: `${ingredient.nutritionalInfo.calories} cal per 100g • ${ingredient.category}`,
        nutrition: ingredient,
        locations: [] // Locations would need to be fetched separately if needed
      }));

      setResults(transformedResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search ingredients';
      setError(errorMessage);
      console.error('Ingredient search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchIngredientsByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);

    try {
      const ingredientResults = await nutritionService.getIngredientsByCategory(category);
      
      const transformedResults: Ingredient[] = ingredientResults.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        description: `${ingredient.nutritionalInfo.calories} cal per 100g • ${ingredient.category}`,
        nutrition: ingredient,
        locations: []
      }));

      setResults(transformedResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search ingredients by category';
      setError(errorMessage);
      console.error('Ingredient category search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchIngredientsByNutrition = useCallback(async (criteria: {
    maxCalories?: number;
    minProtein?: number;
    dietaryFlags?: string[];
    allergenFree?: string[];
  }) => {
    setLoading(true);
    setError(null);

    try {
      const ingredientResults = await nutritionService.searchByNutrition(criteria);
      
      const transformedResults: Ingredient[] = ingredientResults.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        description: `${ingredient.nutritionalInfo.calories} cal per 100g • ${ingredient.category}`,
        nutrition: ingredient,
        locations: []
      }));

      setResults(transformedResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search ingredients by nutrition';
      setError(errorMessage);
      console.error('Ingredient nutrition search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getIngredientById = useCallback(async (id: string): Promise<Ingredient | null> => {
    try {
      const ingredient = await nutritionService.getIngredientNutrition(id);
      if (!ingredient) return null;

      return {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        description: `${ingredient.nutritionalInfo.calories} cal per 100g • ${ingredient.category}`,
        nutrition: ingredient,
        locations: []
      };
    } catch (err) {
      console.error('Error fetching ingredient by ID:', err);
      return null;
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchIngredients,
    searchIngredientsByCategory,
    searchIngredientsByNutrition,
    getIngredientById,
    clearResults
  };
}
