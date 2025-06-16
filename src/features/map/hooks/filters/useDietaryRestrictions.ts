
import { useQuery } from '@tanstack/react-query';
import { FilterOption } from '@/features/map/config/filterConfig';
import { standardizedDataService } from '@/services/standardizedDataService';

/**
 * Custom hook to fetch all available dietary restrictions from the standardized database.
 * Uses React Query for caching and state management with fallback to static options.
 */
export function useDietaryRestrictions() {
  return useQuery<FilterOption[], Error>({
    queryKey: ['dietaryRestrictions'],
    queryFn: async () => {
      try {
        const dietaryTagTypes = await standardizedDataService.getDietaryTagTypes();
        
        // Transform standardized data to FilterOption format
        return dietaryTagTypes.map((tagType) => ({
          id: tagType.name.toLowerCase().replace(/\s+/g, '-'),
          label: tagType.name
        }));
      } catch (error) {
        console.warn('Failed to fetch dietary restrictions from standardized database, using fallback options');
        
        // Fallback to static options if database fails
        return [
          { id: 'vegan', label: 'Vegan' },
          { id: 'vegetarian', label: 'Vegetarian' },
          { id: 'gluten-free', label: 'Gluten Free' },
          { id: 'dairy-free', label: 'Dairy Free' },
          { id: 'nut-free', label: 'Nut Free' },
          { id: 'kosher', label: 'Kosher' },
          { id: 'halal', label: 'Halal' },
          { id: 'paleo', label: 'Paleo' },
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
