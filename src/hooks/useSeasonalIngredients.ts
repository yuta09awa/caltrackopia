import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SeasonalIngredient {
  id: string;
  name: string;
  category: string;
  peak_season_months: number[];
}

export function useSeasonalIngredients() {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return useQuery({
    queryKey: ['seasonal-ingredients', currentMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_ingredients')
        .select('id, name, category, peak_season_months')
        .not('peak_season_months', 'is', null);

      if (error) throw error;

      // Filter ingredients where current month is in peak_season_months
      const seasonal = (data || []).filter((ingredient: SeasonalIngredient) => 
        ingredient.peak_season_months && 
        ingredient.peak_season_months.includes(currentMonth)
      );

      return seasonal as SeasonalIngredient[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - seasonal data doesn't change often
  });
}

export function isIngredientInSeason(ingredientName: string, seasonalIngredients?: SeasonalIngredient[]): boolean {
  if (!seasonalIngredients) return false;
  return seasonalIngredients.some(
    (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase()
  );
}
