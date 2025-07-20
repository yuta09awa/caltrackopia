
import React from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent } from './components';
import MapScreenList from './components/MapScreenList';
import MobileMapScreenList from './components/MobileMapScreenList';
import { useSimplifiedMapContext } from './hooks/useSimplifiedMapContext';
import { useMobileMapUI } from '@/features/map/hooks/useMobileMapUI';

const MapScreenLayout: React.FC = () => {
  const {
    // State
    mapState,
    selectedIngredient,
    selectedLocation,
    displayedSearchQuery,
    
    // Actions
    handleSelectIngredient,
    handleSearchReset,
    handleLocationSelect,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    handleInfoCardClose,
    handleViewDetails,
    showInfoCard,
    infoCardPosition
  } = useSimplifiedMapContext();

  const {
    mapHeight,
    listRef,
    isMobile,
    isBottomSheetExpanded,
    handleScroll,
    toggleBottomSheet,
    setBottomSheetExpanded
  } = useMobileMapUI();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader 
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={handleSelectIngredient}
        onSearchReset={handleSearchReset}
      />
      
      <main className={`flex-1 flex flex-col relative w-full ${
        isMobile ? '' : 'mt-[30px]'
      }`}>
        <MapScreenContent
          mapHeight={mapHeight}
          selectedIngredient={selectedIngredient}
          currentSearchQuery={displayedSearchQuery}
          mapState={mapState}
          showInfoCard={showInfoCard}
          selectedLocation={selectedLocation}
          infoCardPosition={infoCardPosition}
          onLocationSelect={handleLocationSelect}
          onMarkerClick={handleMarkerClick}
          onMapLoaded={handleMapLoaded}
          onMapIdle={handleMapIdle}
          onInfoCardClose={handleInfoCardClose}
          onViewDetails={handleViewDetails}
        />
        
        {isMobile ? (
          <MobileMapScreenList 
            listRef={listRef}
            selectedLocationId={mapState.selectedLocationId}
            onScroll={handleScroll}
            isExpanded={isBottomSheetExpanded}
            onToggleExpanded={toggleBottomSheet}
          />
        ) : (
          <MapScreenList 
            listRef={listRef}
            selectedLocationId={mapState.selectedLocationId}
            onScroll={handleScroll}
          />
        )}
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
