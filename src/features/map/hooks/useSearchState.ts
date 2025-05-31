
import { useState, useCallback } from 'react';

export const useSearchState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);

  const startSearch = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const completeSearch = useCallback((count: number) => {
    setLoading(false);
    setResultCount(count);
  }, []);

  const errorSearch = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
    setResultCount(0);
  }, []);

  const resetSearch = useCallback(() => {
    setLoading(false);
    setError(null);
    setResultCount(0);
  }, []);

  return {
    loading,
    error,
    resultCount,
    startSearch,
    completeSearch,
    errorSearch,
    resetSearch
  };
};
