
import { useState, useCallback } from 'react';
import { EnhancedIngredient, enhancedNutritionService } from '@/services/enhancedNutritionService';

export function useEnhancedIngredientSearch() {
  const [results, setResults] = useState<EnhancedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchIngredients = useCallback(async (query: string, includeExternal: boolean = true) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await enhancedNutritionService.searchIngredientsWithNutrition(query, includeExternal);
      setResults(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search ingredients';
      setError(errorMessage);
      console.error('Enhanced ingredient search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getIngredientDetails = useCallback(async (ingredientId: string, forceRefresh: boolean = false): Promise<EnhancedIngredient | null> => {
    try {
      return await enhancedNutritionService.getIngredientNutrition(ingredientId, forceRefresh);
    } catch (err) {
      console.error('Error fetching ingredient details:', err);
      return null;
    }
  }, []);

  const syncNutritionData = useCallback(async (ingredientName: string): Promise<void> => {
    try {
      await enhancedNutritionService.syncNutritionData(ingredientName);
    } catch (err) {
      console.error('Error syncing nutrition data:', err);
      throw err;
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
    getIngredientDetails,
    syncNutritionData,
    clearResults
  };
}
