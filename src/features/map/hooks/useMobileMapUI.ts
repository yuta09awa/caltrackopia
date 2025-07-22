import { useState, useCallback, useRef, useEffect } from 'react';

export const useMobileMapUI = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mapHeight, setMapHeight] = useState('100%');
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
      // Use 100% height for desktop to fill the flex container
      setMapHeight('100%');
    }
  }, [isMobile]);

  // The scroll handler is now only for desktop list scrolling
  const handleScroll = useCallback(() => {
    // Keep this for desktop list scroll behavior if needed
  }, []);

  return {
    mapHeight,
    listRef,
    isMobile,
    handleScroll,
  };
};
