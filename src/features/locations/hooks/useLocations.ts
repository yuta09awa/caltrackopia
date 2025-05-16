
import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { mockLocations } from '../data/mockLocations';
import { 
  filterLocationsByType, 
  filterLocationsByOpenStatus, 
  sortLocations 
} from '../utils/locationUtils';
import { Location, LocationType, SortOption } from '../types';

export function useLocations() {
  const [locations] = useState<Location[]>(mockLocations);
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters } = useAppStore();

  // Filter locations by type, open status, and sort by selected option
  const filteredAndSortedLocations = useMemo(() => {
    // First filter by location type
    const typeFiltered = filterLocationsByType(locations, activeTab);
    
    // Then filter by open status
    const openStatusFiltered = filterLocationsByOpenStatus(typeFiltered, isOpenNow);
    
    // Finally sort the results
    return sortLocations(openStatusFiltered, sortOption);
  }, [locations, activeTab, sortOption, isOpenNow]);
  
  const filterByType = (type: LocationType) => {
    setActiveTab(type);
  };

  return {
    locations: filteredAndSortedLocations,
    activeTab,
    filterByType,
    sortOption,
    setSortOption,
    isOpenNow,
    setIsOpenNow
  };
}
