
import { useRef, useCallback } from 'react';

export interface LocationListScrollState {
  listRef: React.RefObject<HTMLDivElement>;
}

export interface LocationListScrollActions {
  handleScroll: () => void;
}

export const useLocationListScroll = (onScroll?: () => void) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (onScroll) {
      onScroll();
    }
  }, [onScroll]);

  return {
    listRef,
    handleScroll,
  };
};
