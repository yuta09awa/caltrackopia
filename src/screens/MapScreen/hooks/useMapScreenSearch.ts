
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapScreenDependencies } from './useMapScreenDependencies';

export const useMapScreenSearch = () => {
  const core = useMapScreenDependencies();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  } = useMapSearch();

  return {
    ...core,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  };
};
