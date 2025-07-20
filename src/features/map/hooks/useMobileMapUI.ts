
import { useState, useCallback, useRef, useEffect } from 'react';

export interface MobileMapUIState {
  mapHeight: string;
  listRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  isBottomSheetExpanded: boolean;
}

export interface MobileMapUIActions {
  handleScroll: () => void;
  toggleBottomSheet: () => void;
  setBottomSheetExpanded: (expanded: boolean) => void;
}

export const useMobileMapUI = () => {
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

  // Dynamic height calculation for mobile
  useEffect(() => {
    const updateMapHeight = () => {
      if (isMobile) {
        // Use dynamic viewport height for mobile
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const headerHeight = 60; // Approximate header height
        const bottomSheetMinHeight = isBottomSheetExpanded ? 200 : 120;
        const availableHeight = viewportHeight - headerHeight - bottomSheetMinHeight;
        setMapHeight(`${Math.max(200, availableHeight)}px`);
      } else {
        // Desktop behavior with scroll-based resizing
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
    };

    updateMapHeight();

    // Listen for visual viewport changes (mobile browser UI)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateMapHeight);
      return () => {
        window.visualViewport?.removeEventListener('resize', updateMapHeight);
      };
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

  const setBottomSheetExpanded = useCallback((expanded: boolean) => {
    setIsBottomSheetExpanded(expanded);
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
    setBottomSheetExpanded,
  };
};
