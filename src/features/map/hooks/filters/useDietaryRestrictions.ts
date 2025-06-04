
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterOption } from '@/features/map/config/filterConfig';

interface DietaryRestrictionType {
  id: string;
  name: string;
  description: string;
}

/**
 * Custom hook to fetch all available dietary restrictions from the database.
 * Uses React Query for caching and state management with fallback to static options.
 */
export function useDietaryRestrictions() {
  return useQuery<FilterOption[], Error>({
    queryKey: ['dietaryRestrictions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('dietary_restriction_types')
          .select('id, name, description')
          .order('name');
        
        if (error) {
          console.warn('Database query failed, using fallback options:', error);
          throw error;
        }

        // Transform database results to FilterOption format
        return data.map((restriction: DietaryRestrictionType) => ({
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
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
