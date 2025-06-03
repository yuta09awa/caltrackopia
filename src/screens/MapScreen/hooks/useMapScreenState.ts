
import { useMapScreenSearch } from './useMapScreenSearch';
import { useMapScreenUI } from './useMapScreenUI';

export const useMapScreenState = () => {
  const searchState = useMapScreenSearch();
  const uiState = useMapScreenUI();

  return {
    ...searchState,
    ...uiState
  };
};
