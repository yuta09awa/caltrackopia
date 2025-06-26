
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  loadMore: () => Promise<void> | void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  loadMore,
  threshold = 200
}: UseInfiniteScrollProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    try {
      await loadMore();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, loadMore]);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;
    
    if (!currentLoadingRef || !hasNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`
      }
    );

    observerRef.current.observe(currentLoadingRef);

    return () => {
      if (observerRef.current && currentLoadingRef) {
        observerRef.current.unobserve(currentLoadingRef);
      }
    };
  }, [hasNextPage, handleLoadMore, threshold]);

  return {
    isLoading,
    loadingRef
  };
};
