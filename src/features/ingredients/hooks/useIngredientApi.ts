
import { useQuery } from '@tanstack/react-query';
import { Ingredient } from '@/models/NutritionalInfo';
import { databaseService } from '@/services/databaseService';
import { hybridLocationService } from '@/services/hybridLocationService';

interface UseIngredientApiOptions {
  onSuccess?: (data: Ingredient[]) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface SearchOptions {
  term: string;
  filters?: {
    category?: string;
    dietaryRestrictions?: string[];
    allergenFree?: string[];
    isOrganic?: boolean;
    isLocal?: boolean;
    isSeasonal?: boolean;
  };
  location?: {
    lat: number;
    lng: number;
    radius?: number;
  };
}

export function useIngredientSearch(
  searchOptions: SearchOptions,
  options: UseIngredientApiOptions = {}
) {
  const searchIngredients = async (): Promise<Ingredient[]> => {
    if (!searchOptions.term || searchOptions.term.length < 2) {
      return [];
    }

    try {
      // Search ingredients in database
      const dbIngredients = await databaseService.searchIngredients(
        searchOptions.term, 
        20
      );

      // Transform database ingredients to frontend model
      const ingredients: Ingredient[] = await Promise.all(
        dbIngredients.map(async (dbIngredient) => {
          const ingredient: Ingredient = {
            id: dbIngredient.id,
            name: dbIngredient.name,
            commonNames: dbIngredient.common_names || [],
            category: dbIngredient.category,
            description: `${dbIngredient.name} - ${dbIngredient.category}`,
            nutritionPer100g: {
              calories: dbIngredient.calories_per_100g,
              protein: dbIngredient.protein_per_100g,
              carbs: dbIngredient.carbs_per_100g,
              fat: dbIngredient.fat_per_100g,
              fiber: dbIngredient.fiber_per_100g,
              sugar: dbIngredient.sugar_per_100g,
              sodium: dbIngredient.sodium_per_100g,
              vitamins: dbIngredient.vitamins,
              minerals: dbIngredient.minerals
            },
            isOrganic: dbIngredient.is_organic,
            isLocal: dbIngredient.is_local,
            isSeasonal: dbIngredient.is_seasonal,
            peakSeasonStart: dbIngredient.peak_season_start,
            peakSeasonEnd: dbIngredient.peak_season_end,
            allergens: dbIngredient.allergens || [],
            dietaryRestrictions: dbIngredient.dietary_restrictions || [],
            locations: []
          };

          // Add location data if location search is requested
          if (searchOptions.location) {
            try {
              const locations = await hybridLocationService.getLocationsByIngredient(
                dbIngredient.name
              );
              ingredient.locations = locations.map(loc => ({
                id: loc.id,
                name: loc.name,
                address: loc.address,
                lat: loc.coordinates.lat,
                lng: loc.coordinates.lng,
                distance: 0.5, // Would calculate actual distance
                price: loc.price
              }));
            } catch (error) {
              console.warn('Failed to fetch locations for ingredient:', error);
            }
          }

          return ingredient;
        })
      );

      // Apply filters
      let filteredIngredients = ingredients;

      if (searchOptions.filters?.category) {
        filteredIngredients = filteredIngredients.filter(
          ing => ing.category.toLowerCase() === searchOptions.filters!.category!.toLowerCase()
        );
      }

      if (searchOptions.filters?.dietaryRestrictions?.length) {
        filteredIngredients = filteredIngredients.filter(ing =>
          searchOptions.filters!.dietaryRestrictions!.every(restriction =>
            ing.dietaryRestrictions.includes(restriction)
          )
        );
      }

      if (searchOptions.filters?.allergenFree?.length) {
        filteredIngredients = filteredIngredients.filter(ing =>
          !searchOptions.filters!.allergenFree!.some(allergen =>
            ing.allergens.includes(allergen)
          )
        );
      }

      if (searchOptions.filters?.isOrganic) {
        filteredIngredients = filteredIngredients.filter(ing => ing.isOrganic);
      }

      if (searchOptions.filters?.isLocal) {
        filteredIngredients = filteredIngredients.filter(ing => ing.isLocal);
      }

      if (searchOptions.filters?.isSeasonal) {
        filteredIngredients = filteredIngredients.filter(ing => ing.isSeasonal);
      }

      return filteredIngredients;

    } catch (error) {
      console.error('Error searching ingredients:', error);
      
      // Fallback to mock data for development
      return getMockIngredients(searchOptions.term);
    }
  };

  return useQuery({
    queryKey: ['ingredients', 'search', searchOptions],
    queryFn: searchIngredients,
    enabled: !!searchOptions.term && searchOptions.term.length > 2 && (options.enabled !== false),
    meta: {
      onSuccess: options.onSuccess,
      onError: options.onError
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fallback mock data for development
function getMockIngredients(searchTerm: string): Ingredient[] {
  const mockIngredients: Ingredient[] = [
    {
      id: '1',
      name: 'Organic Kale',
      commonNames: ['Kale', 'Curly Kale'],
      category: 'Vegetables',
      description: 'Fresh locally grown kale',
      nutritionPer100g: {
        calories: 35,
        protein: 2.9,
        carbs: 4.4,
        fat: 0.7,
        fiber: 4.1,
        sodium: 53,
        vitamins: { vitamin_c: 93, vitamin_k: 390 },
        minerals: { calcium: 254, iron: 1.6 }
      },
      isOrganic: true,
      isLocal: true,
      isSeasonal: true,
      peakSeasonStart: 10,
      peakSeasonEnd: 3,
      allergens: [],
      dietaryRestrictions: ['vegan', 'vegetarian', 'gluten_free'],
      locations: [
        {
          id: 'loc1',
          name: 'Farmers Market',
          address: 'Union Square, NYC',
          lat: 40.7589,
          lng: -73.9851,
          distance: 0.5,
          price: '$'
        }
      ]
    },
    {
      id: '2',
      name: 'Quinoa',
      commonNames: ['Quinoa Grain'],
      category: 'Grains',
      description: 'Organic quinoa grain',
      nutritionPer100g: {
        calories: 368,
        protein: 14.1,
        carbs: 64.2,
        fat: 6.1,
        fiber: 7.0,
        sodium: 5,
        vitamins: { folate: 184 },
        minerals: { magnesium: 197, phosphorus: 457 }
      },
      isOrganic: true,
      isLocal: false,
      isSeasonal: false,
      allergens: [],
      dietaryRestrictions: ['vegan', 'vegetarian', 'gluten_free'],
      locations: [
        {
          id: 'loc8',
          name: 'Health Food Store',
          address: 'Broadway, NYC',
          lat: 40.7550,
          lng: -73.9900,
          distance: 0.8,
          price: '$$'
        }
      ]
    }
  ];

  return mockIngredients.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
