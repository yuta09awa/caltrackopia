
import React, { useRef } from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import { useMapStore } from '@/features/map/hooks/useMapStore';

const MapScreenLayout: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const {
    mapState,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition
  } = useMapStore();

  const handleScroll = () => {
    // Simple scroll handler - can be enhanced later
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader 
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={() => {}} // Will be handled by context
        onSearchReset={() => {}} // Will be handled by context
      />
      
      <main className="flex-1 flex flex-col relative w-full" style={{ marginTop: '30px' }}>
        <MapScreenContent
          mapHeight="60vh"
          selectedIngredient={selectedIngredient}
          currentSearchQuery={currentSearchQuery}
          mapState={mapState}
          showInfoCard={showInfoCard}
          selectedLocation={selectedLocation}
          infoCardPosition={infoCardPosition}
          onLocationSelect={() => {}} // Will be handled by context
          onMarkerClick={() => {}} // Will be handled by context
          onMapLoaded={() => {}} // Will be handled by context
          onMapIdle={() => {}} // Will be handled by context
          onInfoCardClose={() => {}} // Will be handled by context
          onViewDetails={() => {}} // Will be handled by context
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
