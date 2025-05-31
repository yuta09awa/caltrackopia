
import { useQuery } from '@tanstack/react-query';
import { databaseService } from '@/services/databaseService';
import { FilterOption } from '@/features/map/config/filterConfig';

/**
 * Custom hook to fetch all available dietary restrictions from the database.
 * Uses React Query for caching and state management.
 */
export function useDietaryRestrictions() {
  return useQuery<FilterOption[], Error>({
    queryKey: ['dietaryRestrictions'],
    queryFn: async () => {
      try {
        const restrictions = await databaseService.getAllDietaryRestrictions();
        
        // Transform database results to FilterOption format
        return restrictions.map(restriction => ({
          id: restriction.name.toLowerCase().replace(/\s+/g, '-'),
          label: restriction.name
        }));
      } catch (error) {
        console.warn('Failed to fetch dietary restrictions from database, using fallback options');
        
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
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
