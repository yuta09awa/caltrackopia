
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
    handleScroll,
  } = useMobileMapUI();

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <MapScreenHeader 
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={handleSelectIngredient}
        onSearchReset={handleSearchReset}
      />
      
      {/* Main container with proper mobile/desktop layout */}
      <main className={`flex flex-1 w-full ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}>
        
        {/* Map container - proper height constraints for mobile vs desktop */}
        <div className={`relative ${
          isMobile ? 'h-[50vh]' : 'flex-1'
        }`}>
          <MapScreenContent
            mapHeight="100%"
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
        </div>
        
        {/* List container - proper height constraints for mobile vs desktop */}
        <div className={`${
          isMobile ? 'h-[50vh]' : 'w-96'
        }`}>
          {isMobile ? (
            <MobileMapScreenList 
              listRef={listRef}
              selectedLocationId={mapState.selectedLocationId}
              onScroll={handleScroll}
            />
          ) : (
            <MapScreenList 
              listRef={listRef}
              selectedLocationId={mapState.selectedLocationId}
              onScroll={handleScroll}
            />
          )}
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
