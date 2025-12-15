import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MenuItem, MenuItemFormData, MenuStats } from '../types';

export function useRestaurantMenu(restaurantId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['restaurant-menu', restaurantId];

  // Fetch all menu items
  const menuQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<MenuItem[]> => {
      if (!restaurantId) return [];

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId,
  });

  // Calculate stats
  const stats: MenuStats = {
    totalItems: menuQuery.data?.length || 0,
    availableItems: menuQuery.data?.filter(item => item.is_available).length || 0,
    verifiedItems: menuQuery.data?.filter(item => (item.confidence_score ?? 0) >= 0.85).length || 0,
    averageConfidence: menuQuery.data?.length
      ? menuQuery.data.reduce((sum, item) => sum + (item.confidence_score ?? 0), 0) / menuQuery.data.length
      : 0,
  };

  // Create menu item
  const createMutation = useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      const { data: newItem, error } = await supabase
        .from('menu_items')
        .insert({
          ...data,
          restaurant_id: restaurantId,
          allergens: data.allergens || [],
          dietary_tags: data.dietary_tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Menu item created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create item: ${error.message}`);
    },
  });

  // Update menu item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MenuItemFormData> }) => {
      const { data: updated, error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Menu item updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update item: ${error.message}`);
    },
  });

  // Delete menu item
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Menu item deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete item: ${error.message}`);
    },
  });

  // Toggle availability (optimistic update)
  const toggleAvailability = useMutation({
    mutationFn: async ({ id, is_available }: { id: string; is_available: boolean }) => {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available })
        .eq('id', id);

      if (error) throw error;
    },
    onMutate: async ({ id, is_available }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<MenuItem[]>(queryKey);
      
      queryClient.setQueryData<MenuItem[]>(queryKey, old =>
        old?.map(item => item.id === id ? { ...item, is_available } : item)
      );
      
      return { previous };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error('Failed to update availability');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    menuItems: menuQuery.data || [],
    stats,
    isLoading: menuQuery.isLoading,
    error: menuQuery.error,
    refetch: menuQuery.refetch,
    createMenuItem: createMutation.mutateAsync,
    updateMenuItem: (id: string, data: Partial<MenuItemFormData>) => 
      updateMutation.mutateAsync({ id, data }),
    deleteMenuItem: deleteMutation.mutateAsync,
    toggleAvailability: (id: string, is_available: boolean) =>
      toggleAvailability.mutate({ id, is_available }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
