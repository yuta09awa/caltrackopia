import React from 'react';
import { useMapScreen } from './hooks/useMapScreen';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';

const MapScreen: React.FC = () => {
  const {
    isMobile,
    listRef,
    displayedSearchQuery,
    mapState,
    infoCardVisible,
    infoCardPosition,
    selectedLocationId,
    displayLocations,
    selectedLocation,
    handleSelectIngredient,
    handleSearchOnMap,
    handleSearchReset,
    handleLocationSelect,
    handleViewDetails,
    handleScroll,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    hideCard,
  } = useMapScreen();

  const layoutProps = {
    displayedSearchQuery,
    mapState,
    infoCardVisible,
    infoCardPosition,
    selectedLocation,
    selectedLocationId,
    displayLocations,
    listRef,
    onSelectIngredient: handleSelectIngredient,
    onSearchOnMap: handleSearchOnMap,
    onSearchReset: handleSearchReset,
    onLocationSelect: handleLocationSelect,
    onMarkerClick: handleMarkerClick,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle,
    onInfoCardClose: hideCard,
    onViewDetails: handleViewDetails,
    onScroll: handleScroll,
  };

  return isMobile ? <MobileLayout {...layoutProps} /> : <DesktopLayout {...layoutProps} />;
};

export default MapScreen;
