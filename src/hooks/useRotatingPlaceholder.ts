import { useState, useEffect, useRef } from 'react';

const PLACEHOLDERS = [
  "Find high-protein meals near me...",
  "Vegan restaurants with good reviews...",
  "What's in season right now?",
  "Halal options nearby...",
  "Gluten-free pizza places...",
  "Organic produce near me...",
  "Vegetarian-friendly spots...",
  "Low-sodium dishes available...",
];

const ROTATION_INTERVAL = 3500; // 3.5 seconds

export function useRotatingPlaceholder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, ROTATION_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return {
    placeholder: PLACEHOLDERS[currentIndex],
    pause,
    resume,
  };
}
