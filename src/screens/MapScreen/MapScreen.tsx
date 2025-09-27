
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import { useConsolidatedMap } from '@/features/map/hooks/useConsolidatedMap';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/models/Location';

const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const listRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState('calc(100vh - 120px)');
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState('');

  // 1. Consolidated hook for map logic
  const {
    mapState,
    infoCardVisible,
    infoCardPosition,
    selectedLocationId,
    markers, // This gives us basic MarkerData[]
    performSearch,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    hideCard,
    clearAll,
    selectLocation,
  } = useConsolidatedMap({
    enableSearch: true,
    enableUserLocation: true,
    enableInfoCard: true,
  });

  // 2. Fetch rich location data
  const { locations } = useLocations(); // This gives us rich Location[]

  // 3. Determine what locations to display
  const displayLocations: Location[] = useMemo(() => {
    // If no search is active (no markers), show default locations
    if (markers.length === 0) {
      return locations;
    }
    
    // If search is active, show enriched markers that match our location data
    return markers.map(marker => {
      const fullLocation = locations.find(loc => loc.id === marker.id);
      return fullLocation;
    }).filter((location): location is Location => location !== undefined);
  }, [markers, locations]);

  const selectedLocation: Location | null = useMemo(() => {
    return displayLocations.find(location => location.id === selectedLocationId) || null;
  }, [displayLocations, selectedLocationId]);

  const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
    const query = ingredient.name;
    setDisplayedSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  const handleSearchReset = useCallback(() => {
    setDisplayedSearchQuery('');
    clearAll();
  }, [clearAll]);

  const handleLocationSelect = useCallback((locationId: string | null) => {
    selectLocation(locationId);
  }, [selectLocation]);

  const handleViewDetails = useCallback((locationId: string) => {
    if (locationId) {
        navigate(`/location/${locationId}`);
    }
  }, [navigate]);

  const handleScroll = useCallback(() => {
    // Placeholder for scroll handling logic
  }, []);

  if (isMobile) {
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
            selectedIngredient={null}
            currentSearchQuery={displayedSearchQuery}
            mapState={mapState}
            showInfoCard={infoCardVisible}
            selectedLocation={selectedLocation}
            infoCardPosition={infoCardPosition}
            onLocationSelect={handleLocationSelect}
            onMarkerClick={handleMarkerClick}
            onMapLoaded={handleMapLoaded}
            onMapIdle={handleMapIdle}
            onInfoCardClose={hideCard}
            onViewDetails={handleViewDetails}
            isMobile={true}
          />
          <MapScreenList
            listRef={listRef}
            locations={displayLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
            onScroll={handleScroll}
            isMobile={true}
          />
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <MapScreenHeader
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={handleSelectIngredient}
        onSearchReset={handleSearchReset}
      />

      <main className="flex-1 flex h-[calc(100vh-56px)] w-full overflow-hidden pt-14">
        <div className="flex-1 relative h-full">
          <MapScreenContent
            mapHeight="100%"
            selectedIngredient={null}
            currentSearchQuery={displayedSearchQuery}
            mapState={mapState}
            showInfoCard={infoCardVisible}
            selectedLocation={selectedLocation}
            infoCardPosition={infoCardPosition}
            onLocationSelect={handleLocationSelect}
            onMarkerClick={handleMarkerClick}
            onMapLoaded={handleMapLoaded}
            onMapIdle={handleMapIdle}
            onInfoCardClose={hideCard}
            onViewDetails={handleViewDetails}
            isMobile={false}
          />
        </div>
        
        <div className="w-[400px] border-l border-border bg-card overflow-hidden flex-shrink-0">
          <MapScreenList
            listRef={listRef}
            locations={displayLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
            onScroll={handleScroll}
            isMobile={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
