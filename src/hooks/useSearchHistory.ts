import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'ingredient_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  id: string;
  name: string;
  category?: string;
  timestamp: number;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSearchHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, [searchHistory]);

  const addToHistory = useCallback((item: Omit<SearchHistoryItem, 'timestamp'>) => {
    setSearchHistory(prev => {
      // Remove existing item if it exists
      const filtered = prev.filter(h => h.id !== item.id);
      
      // Add new item at the beginning
      const newHistory = [{
        ...item,
        timestamp: Date.now()
      }, ...filtered];
      
      // Keep only the most recent items
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setSearchHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};
