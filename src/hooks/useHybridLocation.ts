
import { useState, useEffect } from 'react';
import { Location } from '@/models/Location';
import { hybridLocationService } from '@/services/hybridLocationService';

export function useHybridLocation(locationId: string | null) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) {
      setLocation(null);
      return;
    }

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const enrichedLocation = await hybridLocationService.getEnrichedLocation(locationId);
        setLocation(enrichedLocation);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch location');
        console.error('Error fetching hybrid location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  return { location, loading, error };
}

export function useHybridLocationSearch() {
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locations = await hybridLocationService.searchEnrichedLocations(query);
      setResults(locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchByIngredient = async (ingredientName: string) => {
    if (!ingredientName.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locations = await hybridLocationService.getLocationsByIngredient(ingredientName);
      setResults(locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ingredient search failed');
      console.error('Error searching by ingredient:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchLocations,
    searchByIngredient
  };
}
