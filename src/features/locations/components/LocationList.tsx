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
  
  const displayLocations = useMemo(() => {
    return activeSpoof ? getFilteredLocations() : locations;
  }, [activeSpoof, getFilteredLocations, locations]);

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

  const skeletonCount = useMemo(() => 6, []);

  return (
    <LocationErrorBoundary>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-background z-10 border-b">
          <div className="px-2">
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
        </div>
        
        <div 
          ref={listContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {loading ? (
            <div className="py-3">
              <LoadingSkeleton 
                variant="location-card" 
                count={skeletonCount}
                className="space-y-3"
              />
            </div>
          ) : error ? (
            <div className="py-3">
              <div className="px-2">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-destructive mb-2">Error loading locations</p>
                    <p className="text-muted-foreground text-sm">{error}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : displayLocations.length === 0 ? (
            <div className="py-3">
              <div className="px-2">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No locations found matching your criteria.
                      {activeSpoof && ` Try a different region or filter.`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {displayLocations.map((location) => (
                <LocationErrorBoundary key={location.id}>
                  <div id={`location-${location.id}`} className="transition-colors duration-300">
                    <LocationCard 
                      location={location} 
                      isHighlighted={selectedLocationId === location.id}
                    />
                  </div>
                </LocationErrorBoundary>
              ))}
            </div>
          )}
        </div>
      </div>
    </LocationErrorBoundary>
  );
});

LocationList.displayName = 'LocationList';

export default LocationList;
