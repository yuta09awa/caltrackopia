/**
 * Favorites Hook
 * React hook for managing favorites with offline support
 */

import { useState, useEffect, useCallback } from 'react';
import { favoritesService, type Favorite } from '../services/favoritesService';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    const newFavorite = await favoritesService.addFavorite(favorite);
    setFavorites(prev => [newFavorite, ...prev]);
    return newFavorite;
  }, []);

  const removeFavorite = useCallback(async (id: string) => {
    await favoritesService.removeFavorite(id);
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  const isFavorite = useCallback((locationId: string) => {
    return favorites.some(fav => fav.locationId === locationId);
  }, [favorites]);

  const getFavoritesByCategory = useCallback((category: Favorite['category']) => {
    return favorites.filter(fav => fav.category === category);
  }, [favorites]);

  const updateFavorite = useCallback(async (id: string, updates: Partial<Favorite>) => {
    await favoritesService.updateFavorite(id, updates);
    setFavorites(prev => 
      prev.map(fav => fav.id === id ? { ...fav, ...updates } : fav)
    );
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByCategory,
    updateFavorite,
    refresh: loadFavorites
  };
}
