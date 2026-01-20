import React from 'react';
import { MapScreenHeader, MapScreenContent, MapScreenList } from '../components';
import { MapScreenLayoutProps } from '../types';

const DesktopLayout: React.FC<MapScreenLayoutProps> = ({
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

      <main 
        className="flex overflow-hidden"
        style={{ 
          position: 'fixed',
          top: `${navHeight}px`,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <div className="flex-1 relative h-full">
          <MapScreenContent
            mapHeight="100%"
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
            isMobile={false}
          />
        </div>
        
        <div className="w-[400px] border-l border-border bg-card overflow-hidden flex-shrink-0">
          <MapScreenList
            listRef={listRef}
            locations={displayLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={onLocationSelect}
            onScroll={onScroll}
            isMobile={false}
          />
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;
