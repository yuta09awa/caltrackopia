
import { useMapContext } from '../context/MapContext';

export const useSimplifiedMapContext = () => {
  const context = useMapContext();
  
  return {
    // Core state
    mapState: context.mapState,
    selectedIngredient: context.selectedIngredient,
    selectedLocation: context.selectedLocation,
    
    // UI state
    mapHeight: context.mapHeight,
    showInfoCard: context.showInfoCard,
    infoCardPosition: context.infoCardPosition,
    displayedSearchQuery: context.displayedSearchQuery,
    
    // Actions
    handleSelectIngredient: context.handleSelectIngredient,
    handleSearchReset: context.handleSearchReset,
    handleLocationSelect: context.handleLocationSelect,
    handleMarkerClick: context.handleMarkerClick,
    handleMapLoaded: context.handleMapLoaded,
    handleMapIdle: context.handleMapIdle,
    handleInfoCardClose: context.handleInfoCardClose,
    handleViewDetails: context.handleViewDetails,
    handleScroll: context.handleScroll,
    
    // Refs
    listRef: context.listRef
  };
};
