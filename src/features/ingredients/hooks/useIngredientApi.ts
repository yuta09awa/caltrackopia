
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api/apiService';
import { Ingredient } from '@/hooks/useIngredientSearch';

interface UseIngredientApiOptions {
  onSuccess?: (data: Ingredient[]) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface SearchOptions {
  term: string;
  filters?: Record<string, any>;
}

export function useIngredientSearch(
  searchOptions: SearchOptions,
  options: UseIngredientApiOptions = {}
) {
  // Mock implementation that would be replaced with actual API calls
  const mockSearchIngredients = async (term: string): Promise<Ingredient[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data for demo
    const mockResults: Ingredient[] = [
      {
        id: '1',
        name: 'Organic Kale',
        description: 'Fresh locally grown kale',
        category: 'Vegetables',
        locations: [
          { id: 'loc1', name: 'Farmers Market', lat: 37.7749, lng: -122.4194 },
          { id: 'loc2', name: 'Green Grocery', lat: 37.7833, lng: -122.4167 }
        ]
      },
      {
        id: '2',
        name: 'Grass-fed Beef',
        description: 'Sustainably raised beef',
        category: 'Meat',
        locations: [
          { id: 'loc3', name: 'Butcher Shop', lat: 37.7700, lng: -122.4200 }
        ]
      },
      {
        id: '3',
        name: 'Avocado',
        description: 'Ripe Hass avocados',
        category: 'Fruits',
        locations: [
          { id: 'loc4', name: 'Grocery Store', lat: 37.7800, lng: -122.4100 },
          { id: 'loc5', name: 'Farmers Market', lat: 37.7749, lng: -122.4194 }
        ]
      }
    ];
    
    // Filter by search term
    if (!term) return [];
    
    return mockResults.filter(
      item => item.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  return useQuery({
    queryKey: ['ingredients', 'search', searchOptions],
    queryFn: () => mockSearchIngredients(searchOptions.term),
    enabled: !!searchOptions.term && searchOptions.term.length > 2 && (options.enabled !== false),
    onSuccess: options.onSuccess,
    onError: options.onError,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
