
import React, { useRef } from 'react';
import { MapProvider, useMapContext } from './context';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import Container from '@/components/ui/Container';

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

  // Override dynamic map height with a fixed value for a standard scroll experience.
  // The interactive shrinking is disabled in favor of the map scrolling out of view.
  const staticContentProps = { ...contentProps, mapHeight: '60vh' };
  
  // The onScroll handler is not needed on the list component when the whole page scrolls.
  const staticListProps = { ...listProps, onScroll: undefined };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MapScreenHeader {...headerProps} />
      
      <main className="w-full pt-16">
        {/* Map is rendered outside the container to be full-width */}
        <MapScreenContent {...staticContentProps} />

        {/* List remains inside a container for a centered, max-width layout */}
        <Container>
          <MapScreenList {...staticListProps} />
        </Container>
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
