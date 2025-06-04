
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterOption } from '@/features/map/config/filterConfig';

interface NutritionGoalType {
  id: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Custom hook to fetch nutrition goals from the database.
 * Uses React Query for caching and state management with fallback to static options.
 */
export function useNutritionGoals(): { data: FilterOption[]; isLoading: boolean; error: Error | null } {
  const { data, isLoading, error } = useQuery<FilterOption[], Error>({
    queryKey: ['nutritionGoals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('nutrition_goal_types')
          .select('id, name, description, category')
          .order('category, name');
        
        if (error) {
          console.warn('Database query failed, using fallback options:', error);
          throw error;
        }

        // Transform database results to FilterOption format
        return data.map((goal: NutritionGoalType) => ({
          id: goal.name.toLowerCase().replace(/\s+/g, '-'),
          label: goal.name
        }));
      } catch (error) {
        console.warn('Failed to fetch nutrition goals from database, using fallback options');
        
        // Fallback to static options if database fails
        return [
          { id: 'weight-loss', label: 'Weight Loss' },
          { id: 'muscle-building', label: 'Muscle Building' },
          { id: 'heart-health', label: 'Heart Health' },
          { id: 'high-protein', label: 'High Protein' },
          { id: 'low-carb', label: 'Low Carb' },
          { id: 'endurance-training', label: 'Endurance Training' },
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
}
