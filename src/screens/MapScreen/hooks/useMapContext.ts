
import { useMapContext } from '../context/MapContext';

// Focused hooks for accessing specific parts of the context
export const useMapState = () => {
  const context = useMapContext();
  return {
    mapState: context.mapState,
    mapRef: context.mapRef,
    userLocation: context.userLocation,
    locations: context.locations,
  };
};

export const useMapActions = () => {
  const context = useMapContext();
  return {
    updateCenter: context.updateCenter,
    updateZoom: context.updateZoom,
    updateMarkers: context.updateMarkers,
    selectLocation: context.selectLocation,
    clearMarkers: context.clearMarkers,
    handleMapLoaded: context.handleMapLoaded,
    handleMapIdle: context.handleMapIdle,
  };
};

export const useMapSearch = () => {
  const context = useMapContext();
  return {
    selectedIngredient: context.selectedIngredient,
    currentSearchQuery: context.currentSearchQuery,
    displayedSearchQuery: context.displayedSearchQuery,
    handleSelectIngredient: context.handleSelectIngredient,
    handleSearchReset: context.handleSearchReset,
  };
};

export const useMapUI = () => {
  const context = useMapContext();
  return {
    mapHeight: context.mapHeight,
    listRef: context.listRef,
    handleScroll: context.handleScroll,
    showInfoCard: context.showInfoCard,
    selectedLocation: context.selectedLocation,
    infoCardPosition: context.infoCardPosition,
    handleLocationSelect: context.handleLocationSelect,
    handleMarkerClick: context.handleMarkerClick,
    handleInfoCardClose: context.handleInfoCardClose,
    handleViewDetails: context.handleViewDetails,
  };
};

export { useMapContext };
