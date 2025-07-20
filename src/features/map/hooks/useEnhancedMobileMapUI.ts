
import { useState, useCallback, useRef, useEffect } from 'react';

export interface EnhancedMobileMapUIState {
  mapHeight: string;
  listRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  panelState: 'collapsed' | 'partial' | 'expanded';
  isExpanded: boolean;
}

export interface EnhancedMobileMapUIActions {
  handleScroll: () => void;
  handlePanelStateChange: (state: 'collapsed' | 'partial' | 'expanded') => void;
  toggleExpanded: () => void;
}

export const useEnhancedMobileMapUI = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [panelState, setPanelState] = useState<'collapsed' | 'partial' | 'expanded'>('partial');
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

  // Dynamic height calculation for mobile with spring states
  useEffect(() => {
    const updateMapHeight = () => {
      if (isMobile) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const headerHeight = 60;
        
        let panelHeight: number;
        switch (panelState) {
          case 'collapsed':
            panelHeight = 140;
            break;
          case 'partial':
            panelHeight = viewportHeight * 0.4;
            break;
          case 'expanded':
            panelHeight = viewportHeight * 0.8;
            break;
        }
        
        const availableHeight = viewportHeight - headerHeight - panelHeight;
        setMapHeight(`${Math.max(200, availableHeight)}px`);
      } else {
        // Desktop behavior
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

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateMapHeight);
      return () => {
        window.visualViewport?.removeEventListener('resize', updateMapHeight);
      };
    }
  }, [isMobile, panelState]);

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

  const handlePanelStateChange = useCallback((state: 'collapsed' | 'partial' | 'expanded') => {
    setPanelState(state);
  }, []);

  const toggleExpanded = useCallback(() => {
    setPanelState(current => current === 'expanded' ? 'partial' : 'expanded');
  }, []);

  return {
    // State
    mapHeight,
    listRef,
    isMobile,
    panelState,
    isExpanded: panelState === 'expanded',
    
    // Actions
    handleScroll,
    handlePanelStateChange,
    toggleExpanded,
  };
};
