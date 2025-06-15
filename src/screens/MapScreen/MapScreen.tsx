
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

  // Fixed value for a standard scroll experience
  const staticContentProps = { ...contentProps, mapHeight: '60vh' };
  const staticListProps = { ...listProps, onScroll: undefined };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader {...headerProps} />
      
      <main className="w-full">
        {/* Full-width map - flush with navbar */}
        <div className="w-full">
          <MapScreenContent {...staticContentProps} />
        </div>

        {/* Full-width listing - no max width constraints */}
        <div className="w-full">
          <MapScreenList {...staticListProps} />
        </div>
      </main>
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
