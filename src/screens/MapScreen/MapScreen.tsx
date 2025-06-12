
import React from 'react';
import MapComponent from '@/features/map/components/MapComponent';
import { MapInfoCard } from '@/screens/MapScreen/components/MapScreenInfoCard';
import MapScreenList from '@/screens/MapScreen/components/MapScreenList';
import MapScreenHeader from '@/screens/MapScreen/components/MapScreenHeader';
import { useMapController } from '@/features/map/hooks/useMapController';
import { useMapUI } from '@/features/map/hooks/useMapUI';
import { Ingredient } from '@/models/NutritionalInfo';

const MapScreen: React.FC = () => {
  const { showInfoCard, selectedPlace, searchQuery, resetSearch } = useMapController();
  const { mapHeight, handleScroll } = useMapUI();

  const handleSelectIngredient = (ingredient: Ingredient) => {
    console.log('Selected ingredient:', ingredient);
    // Handle ingredient selection logic here
  };

  const handleSearchReset = () => {
    resetSearch();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header with search and navigation */}
      <MapScreenHeader
        displayedSearchQuery={searchQuery}
        onSelectIngredient={handleSelectIngredient}
        onSearchReset={handleSearchReset}
      />
      
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Map Section - Dynamic height based on scroll */}
        <div className="relative" style={{ height: mapHeight }}>
          <MapComponent height="100%" />
          {showInfoCard && <MapInfoCard />}
        </div>
        
        {/* Location List Section - Scrollable section that can scroll up over map */}
        <MapScreenList
          selectedLocationId={selectedPlace?.id || null}
          onScroll={handleScroll}
        />
      </main>
    </div>
  );
};

export default MapScreen;
