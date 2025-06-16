
import { useQuery } from '@tanstack/react-query';
import { standardizedDataService } from '@/services/standardizedDataService';
import { AllergenType, DietaryTagType, MasterIngredient } from '@/models/StandardizedData';

/**
 * Hook for accessing standardized allergen types with caching
 */
export function useAllergenTypes() {
  return useQuery<AllergenType[], Error>({
    queryKey: ['allergenTypes'],
    queryFn: () => standardizedDataService.getAllergenTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for accessing standardized dietary tag types with caching
 */
export function useDietaryTagTypes() {
  return useQuery<DietaryTagType[], Error>({
    queryKey: ['dietaryTagTypes'],
    queryFn: () => standardizedDataService.getDietaryTagTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for accessing dietary tag types by category
 */
export function useDietaryTagTypesByCategory(category: string) {
  return useQuery<DietaryTagType[], Error>({
    queryKey: ['dietaryTagTypes', 'category', category],
    queryFn: () => standardizedDataService.getDietaryTagTypesByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for accessing standardized master ingredients with caching
 */
export function useMasterIngredients() {
  return useQuery<MasterIngredient[], Error>({
    queryKey: ['masterIngredients'],
    queryFn: () => standardizedDataService.getMasterIngredients(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook for searching master ingredients
 */
export function useSearchMasterIngredients(query: string, enabled: boolean = true) {
  return useQuery<MasterIngredient[], Error>({
    queryKey: ['masterIngredients', 'search', query],
    queryFn: () => standardizedDataService.searchMasterIngredients(query, 20),
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for accessing master ingredients by category
 */
export function useMasterIngredientsByCategory(category: string) {
  return useQuery<MasterIngredient[], Error>({
    queryKey: ['masterIngredients', 'category', category],
    queryFn: () => standardizedDataService.getMasterIngredientsByCategory(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook for checking API quota before making requests
 */
export function useApiQuotaCheck(serviceName: string) {
  return useQuery({
    queryKey: ['apiQuota', serviceName],
    queryFn: () => standardizedDataService.checkApiQuota(serviceName),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
