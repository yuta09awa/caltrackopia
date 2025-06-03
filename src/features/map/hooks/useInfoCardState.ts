
import { useState, useCallback } from 'react';

export const useInfoCardState = () => {
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });

  const showCard = useCallback((position: { x: number; y: number }) => {
    setInfoCardPosition(position);
    setShowInfoCard(true);
  }, []);

  const hideCard = useCallback(() => {
    setShowInfoCard(false);
  }, []);

  return {
    showInfoCard,
    infoCardPosition,
    showCard,
    hideCard
  };
};
