
import { useMemo } from 'react';
import { staticFilterOptions, FilterOption } from '@/features/map/config/filterConfig';

/**
 * Custom hook to provide nutrition focus filter options.
 * Currently returns static options but structured for future database integration.
 */
export function useNutritionGoals(): { data: FilterOption[]; isLoading: boolean; error: null } {
  const data = useMemo(() => {
    return staticFilterOptions.nutritionFocus;
  }, []);

  return {
    data,
    isLoading: false,
    error: null
  };
}
