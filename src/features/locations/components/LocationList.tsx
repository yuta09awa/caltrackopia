
import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LocationErrorBoundary } from './LocationErrorBoundary';
import LocationListHeader from './LocationListHeader';
import LocationCard from './LocationCard';
import LocationFilters from './LocationFilters';
import FilterChips from '@/components/search/FilterChips';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import VirtualizedLocationList from './VirtualizedLocationList';
import { useLocations } from '../hooks/useLocations';
import { useLocationSpoof } from '../hooks/useLocationSpoof';
import { Location } from '@/entities/location';

interface LocationListProps {
  selectedLocationId?: string | null;
  locations?: Location[];
  onLocationSelect?: (locationId: string | null) => void;
}

const VIRTUALIZATION_THRESHOLD = 50; // Use virtualization for lists with 50+ items

const LocationList: React.FC<LocationListProps> = React.memo(({ selectedLocationId, locations: locationsFromProps, onLocationSelect }) => {
  // Conditionally fetch data only if not provided via props
  const {
    locations: locationsFromHook,
    activeTab,
    filterByType,
    sortOption,
    setSortOption,
    isOpenNow,
    setIsOpenNow,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    loadingRef,
    totalCount
  } = useLocations({
    disabled: !!locationsFromProps,
  });

  const locations = locationsFromProps || locationsFromHook;
  
  const { activeSpoof, getFilteredLocations } = useLocationSpoof();
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  
  const displayLocations = useMemo(() => {
    return activeSpoof ? getFilteredLocations() : locations;
  }, [activeSpoof, getFilteredLocations, locations]);

  const shouldUseVirtualization = useMemo(() => {
    return displayLocations.length >= VIRTUALIZATION_THRESHOLD;
  }, [displayLocations.length]);

  const scrollToSelectedLocation = useCallback((locationId: string) => {
    if (!listContainerRef.current) return;
    
    const locationElement = document.getElementById(`location-${locationId}`);
    if (locationElement) {
      locationElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      locationElement.classList.add('bg-primary/10', 'border-primary/20');
      const timeoutId = setTimeout(() => {
        locationElement.classList.remove('bg-primary/10', 'border-primary/20');
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    if (selectedLocationId) {
      scrollToSelectedLocation(selectedLocationId);
    }
  }, [selectedLocationId, scrollToSelectedLocation]);

  // Update container height based on available space
  useEffect(() => {
    const updateHeight = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 100; // 100px buffer
        setContainerHeight(Math.max(400, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleCardClick = (locationId: string) => {
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  };

  const skeletonCount = useMemo(() => 6, []);

  const renderLocationsList = () => {
    if (loading && !locationsFromProps) {
      return (
        <div className="px-3 py-3">
          <LoadingSkeleton 
            variant="location-card" 
            count={skeletonCount}
            className="space-y-3"
          />
        </div>
      );
    }

    if (error && !locationsFromProps) {
      return (
        <div className="px-3 py-3">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-2">Error loading locations</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (displayLocations.length === 0) {
      return (
        <div className="px-3 py-3">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No locations found matching your criteria.
                {activeSpoof && ` Try a different region or filter.`}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="divide-y divide-border">
        {displayLocations.map((location) => (
          <LocationErrorBoundary key={location.id}>
            <div id={`location-${location.id}`} className="transition-colors duration-300" onClick={() => handleCardClick(location.id)}>
              <LocationCard location={location} isHighlighted={selectedLocationId === location.id} />
            </div>
          </LocationErrorBoundary>
        ))}
        {hasNextPage && !locationsFromProps && (
          <div ref={loadingRef} className="px-3 py-6 text-center">
            {isLoadingMore ? <LoadingSkeleton variant="location-card" count={2} /> : <p className="text-muted-foreground text-sm">Scroll to load more...</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <LocationErrorBoundary>
      <div className="flex flex-col h-full">
        {!locationsFromProps && (
          <div className="sticky top-0 bg-background z-10 border-b px-3">
            <LocationListHeader totalCount={totalCount || displayLocations.length} sortOption={sortOption} setSortOption={setSortOption} />
            <LocationFilters activeTab={activeTab} onTabChange={filterByType} isOpenNow={isOpenNow} setIsOpenNow={setIsOpenNow} />
            <FilterChips />
          </div>
        )}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto">
          {renderLocationsList()}
        </div>
      </div>
    </LocationErrorBoundary>
  );
});

LocationList.displayName = 'LocationList';

export default LocationList;
