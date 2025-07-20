
import { useState, useCallback, useRef } from 'react';

export interface MapUIState {
  mapHeight: string;
  listRef: React.RefObject<HTMLDivElement>;
}

export interface MapUIActions {
  handleScroll: () => void;
}

export const useMapUI = () => {
  const [mapHeight, setMapHeight] = useState('60vh');
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const scrollTop = listRef.current.scrollTop;
      const maxScroll = 200;
      const minHeight = 40;
      const maxHeight = 60;
      
      const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
      const newHeight = maxHeight - (scrollPercentage * (maxHeight - minHeight));
      
      setMapHeight(`${newHeight}vh`);
    }
  }, []);

  return {
    // State
    mapHeight,
    listRef,
    
    // Actions
    handleScroll,
  };
};
