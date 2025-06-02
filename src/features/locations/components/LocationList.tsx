
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LocationErrorBoundary } from './LocationErrorBoundary';
import LocationListHeader from './LocationListHeader';
import LocationCard from './LocationCard';
import LocationFilters from './LocationFilters';
import FilterChips from '@/components/search/FilterChips';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useLocations } from '../hooks/useLocations';
import { useLocationSpoof } from '../hooks/useLocationSpoof';

interface LocationListProps {
  selectedLocationId?: string | null;
}

const LocationList: React.FC<LocationListProps> = React.memo(({ selectedLocationId }) => {
  const { 
    locations, 
    activeTab, 
    filterByType, 
    sortOption, 
    setSortOption, 
    isOpenNow, 
    setIsOpenNow,
    loading,
    error
  } = useLocations();
  
  const { activeSpoof, getFilteredLocations } = useLocationSpoof();
  const listContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize display locations calculation
  const displayLocations = useMemo(() => {
    return activeSpoof ? getFilteredLocations() : locations;
  }, [activeSpoof, getFilteredLocations, locations]);

  // Memoize scroll to selected location function
  const scrollToSelectedLocation = useCallback((locationId: string) => {
    if (!listContainerRef.current) return;
    
    const locationElement = document.getElementById(`location-${locationId}`);
    if (locationElement) {
      locationElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Add a temporary highlight effect
      locationElement.classList.add('bg-primary/10', 'border-primary/20');
      const timeoutId = setTimeout(() => {
        locationElement.classList.remove('bg-primary/10', 'border-primary/20');
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Scroll to selected location when selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId) {
      scrollToSelectedLocation(selectedLocationId);
    }
  }, [selectedLocationId, scrollToSelectedLocation]);

  // Memoize loading skeleton count
  const skeletonCount = useMemo(() => 6, []);

  return (
    <LocationErrorBoundary>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-background z-10 border-b">
          <LocationListHeader
            totalCount={displayLocations.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          <LocationFilters
            activeTab={activeTab}
            onTabChange={filterByType}
            isOpenNow={isOpenNow}
            setIsOpenNow={setIsOpenNow}
          />
          <FilterChips />
        </div>
        
        <div 
          ref={listContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading ? (
            <LoadingSkeleton 
              variant="location-card" 
              count={skeletonCount}
              className="space-y-4"
            />
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive mb-2">Error loading locations</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </CardContent>
            </Card>
          ) : displayLocations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No locations found matching your criteria.
                  {activeSpoof && ` Try a different region or filter.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            displayLocations.map((location) => (
              <LocationErrorBoundary key={location.id}>
                <div id={`location-${location.id}`} className="transition-colors duration-300">
                  <LocationCard 
                    location={location} 
                    isHighlighted={selectedLocationId === location.id}
                  />
                </div>
              </LocationErrorBoundary>
            ))
          )}
        </div>
      </div>
    </LocationErrorBoundary>
  );
});

LocationList.displayName = 'LocationList';

export default LocationList;
