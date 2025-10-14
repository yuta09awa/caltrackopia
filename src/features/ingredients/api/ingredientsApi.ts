/**
 * Ingredients API Module
 * Handles ingredient data and allergen information
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const ingredientsApi = {
  /**
   * Search ingredients
   */
  search: async (query: string, limit: number = 20) => {
    const { data, error } = await supabase
      .from('master_ingredients')
      .select('*')
      .or(`name.ilike.%${query}%,common_names.cs.{${query}}`)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get ingredient by ID
   */
  getById: async (id: string) => {
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

  /**
   * Get ingredients by category
   */
  getByCategory: async (category: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('master_ingredients')
      .select('*')
      .eq('category', category)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get all allergen types
   */
  getAllergens: async () => {
    const { data, error } = await supabase
      .from('allergen_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Get dietary restriction types
   */
  getDietaryRestrictions: async () => {
    const { data, error } = await supabase
      .from('dietary_restriction_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },
};
