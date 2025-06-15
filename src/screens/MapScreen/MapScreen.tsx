
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
      
      <main className="w-full pt-16">
        {/* Full-width map */}
        <div className="w-full">
          <MapScreenContent {...staticContentProps} />
        </div>

        {/* Full-width listing with horizontal padding and max width */}
        <div className="w-full px-2 sm:px-4 max-w-screen-xl mx-auto">
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
