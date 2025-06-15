
import React, { useRef } from 'react';
import { MapProvider, useMapContext } from './context';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';

const MapScreenLayout: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const {
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset,
    mapState,
    selectedIngredient,
    currentSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    handleLocationSelect,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    handleInfoCardClose,
    handleViewDetails,
    handleScroll,
  } = useMapContext();

  const headerProps = {
    displayedSearchQuery,
    onSelectIngredient: handleSelectIngredient,
    onSearchReset: handleSearchReset,
  };

  const contentProps = {
    mapState,
    selectedIngredient,
    currentSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    onLocationSelect: handleLocationSelect,
    onMarkerClick: handleMarkerClick,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle,
    onInfoCardClose: handleInfoCardClose,
    onViewDetails: handleViewDetails,
  };
  
  const listProps = {
    listRef,
    selectedLocationId: mapState.selectedLocationId,
    onScroll: handleScroll,
  };

  // Full viewport map with overlay list
  const fullScreenContentProps = { ...contentProps, mapHeight: '100vh' };

  return (
    <div className="relative min-h-screen w-full bg-background">
      <MapScreenHeader {...headerProps} />
      
      {/* Full-screen map as background */}
      <div className="relative w-full h-screen">
        <MapScreenContent {...fullScreenContentProps} />
        
        {/* Location list as overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2/5 z-10">
          <MapScreenList {...listProps} />
        </div>
      </div>
    </div>
  );
};

const MapScreen = () => {
  return (
    <MapProvider>
      <MapScreenLayout />
    </MapProvider>
  );
};

export default MapScreen;
