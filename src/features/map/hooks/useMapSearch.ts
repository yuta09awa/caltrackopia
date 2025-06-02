
import { useState, useCallback } from 'react';

export interface MapSearchState {
  selectedIngredient: string | null;
  currentSearchQuery: string;
  displayedSearchQuery: string;
}

export interface MapSearchActions {
  handleSelectIngredient: (ingredient: string) => void;
  handleSearchReset: () => void;
  setCurrentSearchQuery: (query: string) => void;
  setDisplayedSearchQuery: (query: string) => void;
}

export const useMapSearch = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('');

  const handleSelectIngredient = useCallback((ingredient: string) => {
    console.log('Selected ingredient:', ingredient);
    setSelectedIngredient(ingredient);
    setCurrentSearchQuery(ingredient);
    setDisplayedSearchQuery(ingredient);
  }, []);

  const handleSearchReset = useCallback(() => {
    console.log('Resetting search');
    setSelectedIngredient(null);
    setCurrentSearchQuery('');
    setDisplayedSearchQuery('');
  }, []);

  return {
    // State
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    
    // Actions
    handleSelectIngredient,
    handleSearchReset,
    setCurrentSearchQuery,
    setDisplayedSearchQuery,
  };
};
