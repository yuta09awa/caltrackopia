
import React from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent } from './components';
import MapScreenList from './components/MapScreenList';
import EnhancedMobileMapScreenList from './components/EnhancedMobileMapScreenList';
import { useSimplifiedMapContext } from './hooks/useSimplifiedMapContext';
import { useEnhancedMobileMapUI } from '@/features/map/hooks/useEnhancedMobileMapUI';

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
    isExpanded,
    handleScroll,
    handlePanelStateChange,
    toggleExpanded
  } = useEnhancedMobileMapUI();

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
          <EnhancedMobileMapScreenList 
            listRef={listRef}
            selectedLocationId={mapState.selectedLocationId}
            onScroll={handleScroll}
            isExpanded={isExpanded}
            onPanelStateChange={handlePanelStateChange}
            onToggleExpanded={toggleExpanded}
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
