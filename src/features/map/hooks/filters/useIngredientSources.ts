
import { useMemo } from 'react';
import { dynamicFilterCategories, FilterOption } from '@/features/map/config/filterConfig';

/**
 * Custom hook to provide ingredient sourcing filter options.
 * Currently returns static options but can be extended for dynamic loading.
 */
export function useIngredientSources(): { data: FilterOption[]; isLoading: boolean; error: null } {
  const data = useMemo(() => {
    const sourcesCategory = dynamicFilterCategories.find(cat => cat.id === 'sources');
    return sourcesCategory ? sourcesCategory.options : [];
  }, []);

  return {
    data,
    isLoading: false,
    error: null
  };
}
