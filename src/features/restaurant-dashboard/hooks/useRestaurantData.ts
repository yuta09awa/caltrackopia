import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/store/useAuth';
import type { Restaurant } from '../types';

export function useRestaurantData() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['restaurant', user?.id],
    queryFn: async (): Promise<Restaurant | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    restaurant: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
