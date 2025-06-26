
import React from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import { useSimplifiedMapContext } from './hooks/useSimplifiedMapContext';

const MapScreenLayout: React.FC = () => {
  const {
    // State
    mapState,
    selectedIngredient,
    selectedLocation,
    mapHeight,
    showInfoCard,
    infoCardPosition,
    displayedSearchQuery,
    listRef,
    
    // Actions
    handleSelectIngredient,
    handleSearchReset,
    handleLocationSelect,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    handleInfoCardClose,
    handleViewDetails,
    handleScroll
  } = useSimplifiedMapContext();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader 
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={handleSelectIngredient}
        onSearchReset={handleSearchReset}
      />
      
      <main className="flex-1 flex flex-col relative w-full" style={{ marginTop: '30px' }}>
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
        <MapScreenList 
          listRef={listRef}
          selectedLocationId={mapState.selectedLocationId}
          onScroll={handleScroll}
        />
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
