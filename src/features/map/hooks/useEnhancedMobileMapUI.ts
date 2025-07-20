
import { useState, useCallback, useRef, useEffect } from 'react';

export interface EnhancedMobileMapUIState {
  mapHeight: string;
  listRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  isBottomSheetExpanded: boolean;
}

export interface EnhancedMobileMapUIActions {
  handleScroll: () => void;
  toggleBottomSheet: () => void;
}

export const useEnhancedMobileMapUI = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [mapHeight, setMapHeight] = useState('60vh');
  const listRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Simplified height calculation with predictable viewport units
  useEffect(() => {
    if (isMobile) {
      // When expanded, map takes smaller portion (30vh)
      // When collapsed, map takes most of screen (85vh)
      setMapHeight(isBottomSheetExpanded ? '30vh' : '85vh');
    } else {
      // Desktop behavior with scroll-based height adjustment
      if (listRef.current) {
        const scrollTop = listRef.current.scrollTop;
        const maxScroll = 200;
        const minHeight = 40;
        const maxHeight = 60;
        
        const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
        const newHeight = maxHeight - (scrollPercentage * (maxHeight - minHeight));
        
        setMapHeight(`${newHeight}vh`);
      } else {
        setMapHeight('60vh');
      }
    }
  }, [isMobile, isBottomSheetExpanded]);

  const handleScroll = useCallback(() => {
    if (!isMobile && listRef.current) {
      const scrollTop = listRef.current.scrollTop;
      const maxScroll = 200;
      const minHeight = 40;
      const maxHeight = 60;
      
      const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
      const newHeight = maxHeight - (scrollPercentage * (maxHeight - minHeight));
      
      setMapHeight(`${newHeight}vh`);
    }
  }, [isMobile]);

  const toggleBottomSheet = useCallback(() => {
    setIsBottomSheetExpanded(prev => !prev);
  }, []);

  return {
    // State
    mapHeight,
    listRef,
    isMobile,
    isBottomSheetExpanded,
    
    // Actions
    handleScroll,
    toggleBottomSheet,
  };
};
