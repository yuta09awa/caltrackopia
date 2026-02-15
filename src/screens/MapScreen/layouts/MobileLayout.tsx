import React from 'react';
import { MapScreenHeader, MapScreenContent, MapScreenList } from '../components';
import { MapScreenLayoutProps } from '../types';

const MobileLayout: React.FC<MapScreenLayoutProps> = ({
  displayedSearchQuery,
  
  mapState,
  infoCardVisible,
  infoCardPosition,
  selectedLocation,
  selectedLocationId,
  displayLocations,
  listRef,
  onSelectIngredient,
  onSearchOnMap,
  onSearchReset,
  onLocationSelect,
  onMarkerClick,
  onMapLoaded,
  onMapIdle,
  onInfoCardClose,
  onViewDetails,
  onScroll,
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <MapScreenHeader
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={onSelectIngredient}
        onSearchOnMap={onSearchOnMap}
        onSearchReset={onSearchReset}
      />

      <main className="flex flex-col flex-1 overflow-hidden">
        <MapScreenContent
          mapHeight="60%"
          selectedIngredient={null}
          currentSearchQuery={displayedSearchQuery}
          mapState={mapState}
          showInfoCard={infoCardVisible}
          selectedLocation={selectedLocation}
          infoCardPosition={infoCardPosition}
          onLocationSelect={onLocationSelect}
          onMarkerClick={onMarkerClick}
          onMapLoaded={onMapLoaded}
          onMapIdle={onMapIdle}
          onInfoCardClose={onInfoCardClose}
          onViewDetails={onViewDetails}
          isMobile={true}
        />
        <MapScreenList
          listRef={listRef}
          locations={displayLocations}
          selectedLocationId={selectedLocationId}
          onLocationSelect={onLocationSelect}
          onScroll={onScroll}
          isMobile={true}
        />
      </main>
    </div>
  );
};

export default MobileLayout;
