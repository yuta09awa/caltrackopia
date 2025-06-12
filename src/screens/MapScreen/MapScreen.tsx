
import React from 'react';
import MapComponent from '@/features/map/components/MapComponent';
import MapScreenInfoCard from '@/screens/MapScreen/components/MapScreenInfoCard';
import MapScreenList from '@/screens/MapScreen/components/MapScreenList';
import MapScreenHeader from '@/screens/MapScreen/components/MapScreenHeader';
import { useMapController } from '@/features/map/hooks/useMapController';
import { useMapUI } from '@/features/map/hooks/useMapUI';
import { Ingredient } from '@/models/NutritionalInfo';

const MapScreen: React.FC = () => {
  const { 
    showInfoCard, 
    selectedPlace, 
    searchQuery, 
    resetSearch,
    isLoaded,
    loadError,
    apiKey
  } = useMapController();
  const { mapHeight, handleScroll } = useMapUI();

  const handleSelectIngredient = (ingredient: Ingredient) => {
    console.log('Selected ingredient:', ingredient);
    // Handle ingredient selection logic here
  };

  const handleSearchReset = () => {
    resetSearch();
  };

  // Show loading or error states if map is not ready
  if (!apiKey && !loadError) {
    return (
      <div className="flex flex-col h-screen w-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col h-screen w-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading map</p>
            <p className="text-muted-foreground text-sm">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

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
          {showInfoCard && <MapScreenInfoCard />}
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
