
import { useState, useCallback, useRef, useEffect } from 'react';

export interface MapUIState {
  mapHeight: string;
  listRef: React.RefObject<HTMLDivElement>;
}

export interface MapUIActions {
  handleScroll: () => void;
}

export const useMapUI = () => {
  const [mapHeight, setMapHeight] = useState('50vh'); // Start with safer default
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate proper viewport height for mobile
  useEffect(() => {
    const calculateHeight = () => {
      // Use dynamic viewport height calculation
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Set initial mobile-friendly height
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setMapHeight('calc(var(--vh, 1vh) * 50)'); // 50% of actual viewport
      } else {
        setMapHeight('60vh');
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    window.addEventListener('orientationchange', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
      window.removeEventListener('orientationchange', calculateHeight);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (listRef.current && window.innerWidth >= 768) { // Only on desktop
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
