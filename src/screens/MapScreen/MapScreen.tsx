
import React, { useState } from 'react';
import { MapProvider } from './context/MapProvider';
import { MapScreenHeader, MapScreenContent, MapScreenList } from './components';
import { useSimplifiedMapContext } from './hooks/useSimplifiedMapContext';
import MapScreenToolbar from './components/MapScreenToolbar';
import MapScreenSidebar from './components/MapScreenSidebar';
import { LocationType } from '@/features/locations/types';

const MapScreenLayout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [showGroceryList, setShowGroceryList] = useState(false);

  const {
    // State
    mapState,
    selectedIngredient,
    selectedLocation,
    mapHeight,
    showInfoCard,
    infoCardPosition,
    displayedSearchQuery,
    listRef,
    
    // Actions
    handleSelectIngredient,
    handleSearchReset,
    handleLocationSelect,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    handleInfoCardClose,
    handleViewDetails,
    handleScroll
  } = useSimplifiedMapContext();

  const onApplyFilters = () => {
    // Apply filters logic
    console.log('Applying filters:', { priceFilter, activeTab });
  };

  return (
    <div className="relative w-full h-screen bg-background flex overflow-hidden">
      {/* Enhanced Sidebar */}
      {sidebarVisible && (
        <MapScreenSidebar
          activeView={currentView}
          onViewChange={setCurrentView}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          onApplyFilters={onApplyFilters}
          showGroceryList={showGroceryList}
          onToggleGroceryList={() => setShowGroceryList(!showGroceryList)}
          className="hidden lg:flex"
        />
      )}

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Enhanced Floating Toolbar */}
        <MapScreenToolbar
          onMenuToggle={() => setSidebarVisible(!sidebarVisible)}
          onSearchIngredient={handleSelectIngredient}
          onSearchReset={handleSearchReset}
          searchValue={displayedSearchQuery}
          activeFiltersCount={priceFilter ? 1 : 0}
          onFilterToggle={() => setShowGroceryList(!showGroceryList)}
        />

        {/* Map Content with enhanced styling */}
        <div className="w-full h-full">
          <MapScreenContent
            mapHeight="100vh"
            selectedIngredient={selectedIngredient}
            currentSearchQuery={displayedSearchQuery}
            mapState={mapState}
            showInfoCard={showInfoCard}
            selectedLocation={selectedLocation}
            infoCardPosition={infoCardPosition}
            onLocationSelect={handleLocationSelect}
            onMarkerClick={handleMarkerClick}
            onMapLoaded={handleMapLoaded}
            onMapIdle={handleMapIdle}
            onInfoCardClose={handleInfoCardClose}
            onViewDetails={handleViewDetails}
          />
        </div>

        {/* Enhanced List View (hidden on mobile when map is shown) */}
        {currentView === 'list' && (
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border max-h-96 overflow-y-auto lg:hidden">
            <MapScreenList 
              listRef={listRef}
              selectedLocationId={mapState.selectedLocationId}
              onScroll={handleScroll}
            />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarVisible && (
          <div className="lg:hidden absolute inset-0 z-30">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarVisible(false)} />
            <MapScreenSidebar
              activeView={currentView}
              onViewChange={setCurrentView}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              onApplyFilters={onApplyFilters}
              showGroceryList={showGroceryList}
              onToggleGroceryList={() => setShowGroceryList(!showGroceryList)}
              className="absolute left-0 top-0 h-full shadow-xl"
            />
          </div>
        )}
      </div>
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
