
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LocationErrorBoundary } from './LocationErrorBoundary';
import LocationListHeader from './LocationListHeader';
import LocationCard from './LocationCard';
import LocationFilters from './LocationFilters';
import { useLocations } from '../hooks/useLocations';
import { useLocationSpoof } from '../hooks/useLocationSpoof';

const LocationList: React.FC = () => {
  const { 
    locations, 
    activeTab, 
    filterByType, 
    sortOption, 
    setSortOption, 
    isOpenNow, 
    setIsOpenNow 
  } = useLocations();
  
  const { activeSpoof, getFilteredLocations } = useLocationSpoof();
  
  // Use spoofed locations if spoofing is active, otherwise use filtered locations
  const displayLocations = activeSpoof ? getFilteredLocations() : locations;

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
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayLocations.length === 0 ? (
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
                <LocationCard location={location} />
              </LocationErrorBoundary>
            ))
          )}
        </div>
      </div>
    </LocationErrorBoundary>
  );
};

export default LocationList;
