/**
 * Nutrition API Module
 * Handles nutrition data and goals
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export interface NutritionGoal {
  id: string;
  name: string;
  description?: string;
  category?: string;
  target_type?: string;
}

export const nutritionApi = {
  /**
   * Get all nutrition goals
   */
  getGoals: async (): Promise<NutritionGoal[]> => {
    const { data, error } = await supabase
      .from('nutrition_goal_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Search ingredients by name
   */
  searchIngredients: async (query: string, limit: number = 20) => {
    const { data, error } = await supabase
      .from('master_ingredients')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get ingredient by ID
   */
  getIngredientById: async (id: string) => {
    const { data, error } = await supabase
      .from('master_ingredients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },
};
