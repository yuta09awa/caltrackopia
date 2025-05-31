
import { useQuery } from '@tanstack/react-query';
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

// Mock data for demo purposes
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Organic Kale',
    description: 'Fresh locally grown kale',
    category: 'Vegetables',
    locations: [
      { id: 'loc1', name: 'Farmers Market', lat: 40.7589, lng: -73.9851 },
      { id: 'loc2', name: 'Green Grocery', lat: 40.7505, lng: -73.9934 }
    ]
  },
  {
    id: '2',
    name: 'Grass-fed Beef',
    description: 'Sustainably raised beef',
    category: 'Meat',
    locations: [
      { id: 'loc3', name: 'Butcher Shop', lat: 40.7580, lng: -73.9840 }
    ]
  },
  {
    id: '3',
    name: 'Avocado',
    description: 'Ripe Hass avocados',
    category: 'Fruits',
    locations: [
      { id: 'loc4', name: 'Grocery Store', lat: 40.7600, lng: -73.9800 },
      { id: 'loc5', name: 'Farmers Market', lat: 40.7589, lng: -73.9851 }
    ]
  },
  {
    id: '4',
    name: 'Whole Foods',
    description: 'Whole Foods Market - organic groceries',
    category: 'Grocery Store',
    locations: [
      { id: 'loc6', name: 'Whole Foods Union Square', lat: 40.7359, lng: -73.9911 },
      { id: 'loc7', name: 'Whole Foods Tribeca', lat: 40.7205, lng: -74.0134 }
    ]
  },
  {
    id: '5',
    name: 'Quinoa',
    description: 'Organic quinoa grain',
    category: 'Grains',
    locations: [
      { id: 'loc8', name: 'Health Food Store', lat: 40.7550, lng: -73.9900 }
    ]
  },
  {
    id: '6',
    name: 'Salmon',
    description: 'Fresh Atlantic salmon',
    category: 'Seafood',
    locations: [
      { id: 'loc9', name: 'Fish Market', lat: 40.7520, lng: -73.9950 }
    ]
  }
];

export function useIngredientSearch(
  searchOptions: SearchOptions,
  options: UseIngredientApiOptions = {}
) {
  // Mock implementation that filters local data instead of making API calls
  const mockSearchIngredients = async (term: string): Promise<Ingredient[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter by search term
    if (!term) return [];
    
    return mockIngredients.filter(
      item => item.name.toLowerCase().includes(term.toLowerCase()) ||
              item.description.toLowerCase().includes(term.toLowerCase()) ||
              item.category?.toLowerCase().includes(term.toLowerCase())
    );
  };

  return useQuery({
    queryKey: ['ingredients', 'search', searchOptions],
    queryFn: () => mockSearchIngredients(searchOptions.term),
    enabled: !!searchOptions.term && searchOptions.term.length > 2 && (options.enabled !== false),
    meta: {
      onSuccess: options.onSuccess,
      onError: options.onError
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
