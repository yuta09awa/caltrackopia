import React from 'react';
import { MapScreenHeader, MapScreenContent, MapScreenList } from '../components';
import { CacheMetricsPanel } from '@/features/map/components';
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
  onSearchReset,
  onLocationSelect,
  onMarkerClick,
  onMapLoaded,
  onMapIdle,
  onInfoCardClose,
  onViewDetails,
  onScroll,
}) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <MapScreenHeader
        displayedSearchQuery={displayedSearchQuery}
        onSelectIngredient={onSelectIngredient}
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

      {/* Cache Metrics Panel - Dev Mode Only */}
      {isDev && (
        <div className="fixed bottom-4 left-4 z-50 w-80">
          <CacheMetricsPanel />
        </div>
      )}
    </div>
  );
};

export default DesktopLayout;
