import React from 'react';
import { MapScreenHeader, MapScreenContent, MapScreenList } from '../components';
import { MapScreenLayoutProps } from '../types';

const MobileLayout: React.FC<MapScreenLayoutProps> = ({
  displayedSearchQuery,
  navHeight,
  mapState,
  infoCardVisible,
  infoCardPosition,
  selectedLocation,
  selectedLocationId,
  displayLocations,
  listRef,
  onSelectIngredient,
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
        onSearchReset={onSearchReset}
      />

      <main 
        className="flex flex-col overflow-hidden"
        style={{ 
          position: 'fixed',
          top: `${navHeight}px`,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
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
