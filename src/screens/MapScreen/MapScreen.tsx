
import React from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import { useMapSearch, useMapActions, useMapUI, useMapState } from './hooks/useMapContext';

const MapScreenLayout: React.FC = () => {
  const searchState = useMapSearch();
  const mapActions = useMapActions();
  const uiState = useMapUI();
  const mapState = useMapState();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-12">
      <MapScreenHeader 
        displayedSearchQuery={searchState.displayedSearchQuery}
        onSelectIngredient={searchState.handleSelectIngredient}
        onSearchReset={searchState.handleSearchReset}
      />
      
      <main className="flex-1 flex flex-col relative w-full">
        <MapScreenContent
          mapHeight={uiState.mapHeight}
          selectedIngredient={searchState.selectedIngredient}
          currentSearchQuery={searchState.currentSearchQuery}
          mapState={mapState.mapState}
          showInfoCard={uiState.showInfoCard}
          selectedLocation={uiState.selectedLocation}
          infoCardPosition={uiState.infoCardPosition}
          onLocationSelect={uiState.handleLocationSelect}
          onMarkerClick={uiState.handleMarkerClick}
          onMapLoaded={mapActions.handleMapLoaded}
          onMapIdle={mapActions.handleMapIdle}
          onInfoCardClose={uiState.handleInfoCardClose}
          onViewDetails={uiState.handleViewDetails}
        />
        <MapScreenList 
          listRef={uiState.listRef}
          selectedLocationId={mapState.mapState.selectedLocationId}
          onScroll={uiState.handleScroll}
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
