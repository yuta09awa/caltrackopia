
import React from 'react';
import { useMapScreenState, useMapScreenCallbacks, useMapScreenProps } from './hooks';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';

const MapScreen = () => {
  const state = useMapScreenState();
  
  const callbacks = useMapScreenCallbacks({
    mapRef: state.mapRef,
    mapState: state.mapState,
    selectedIngredient: state.selectedIngredient,
    currentSearchQuery: state.currentSearchQuery,
    handleSelectIngredient: state.handleSelectIngredient,
    handleSearchReset: state.handleSearchReset,
    updateCenter: state.updateCenter,
    updateZoom: state.updateZoom,
    userLocation: state.userLocation,
    dependencies: state.dependencies,
    handleLocationSelect: state.handleLocationSelect,
    handleMarkerClick: state.handleMarkerClick,
    handleInfoCardClose: state.handleInfoCardClose,
    handleViewDetails: state.handleViewDetails
  });

  const props = useMapScreenProps(
    {
      displayedSearchQuery: state.displayedSearchQuery,
      mapHeight: state.mapHeight,
      selectedIngredient: state.selectedIngredient,
      currentSearchQuery: state.currentSearchQuery,
      mapState: state.mapState,
      showInfoCard: state.showInfoCard,
      selectedLocation: state.selectedLocation,
      infoCardPosition: state.infoCardPosition,
      listRef: state.listRef,
      handleScroll: state.handleScroll
    },
    callbacks
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader {...props.headerProps} />
      
      <main className="flex-1 flex flex-col relative w-full">
        <MapScreenContent {...props.contentProps} />
        <MapScreenList {...props.listProps} />
      </main>
    </div>
  );
};

export default MapScreen;
