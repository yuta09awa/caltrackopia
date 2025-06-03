
import { useMapInteractions } from '@/features/map/hooks/useMapInteractions';
import { useMapUI } from '@/features/map/hooks/useMapUI';

export const useMapScreenUI = () => {
  const {
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
  } = useMapInteractions();
  
  const { mapHeight, listRef, handleScroll } = useMapUI();

  return {
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    mapHeight,
    listRef,
    handleScroll
  };
};
