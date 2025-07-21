
import { useState, useCallback, useRef, useEffect } from 'react';

export const useMobileMapUI = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mapHeight, setMapHeight] = useState('60vh');
  const listRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set map height based on device
  useEffect(() => {
    if (isMobile) {
      // Set a fixed 50% viewport height for the map on mobile
      setMapHeight('50vh');
    } else {
      // Keep original desktop behavior
      setMapHeight('60vh');
    }
  }, [isMobile]);

  // The scroll handler is now only for desktop
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

  return {
    mapHeight,
    listRef,
    isMobile,
    handleScroll,
  };
};
