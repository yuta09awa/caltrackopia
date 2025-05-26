
import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { mockLocations } from '../data/mockLocations';
import { 
  filterLocationsByType, 
  filterLocationsByOpenStatus, 
  sortLocations 
} from '../utils/locationUtils';
import { validateAndSanitizeLocations } from '../utils/validationUtils';
import { Location, LocationType, SortOption } from '../types';

export function useLocations() {
  // Validate and sanitize locations on initial load
  const [locations] = useState<Location[]>(() => validateAndSanitizeLocations(mockLocations));
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters } = useAppStore();

  // Filter locations by type, open status, and sort by selected option
  const filteredAndSortedLocations = useMemo(() => {
    try {
      // First filter by location type
      const typeFiltered = filterLocationsByType(locations, activeTab);
      
      // Then filter by open status
      const openStatusFiltered = filterLocationsByOpenStatus(typeFiltered, isOpenNow);
      
      // Finally sort the results
      return sortLocations(openStatusFiltered, sortOption);
    } catch (error) {
      console.error('Error filtering locations:', error);
      // Return empty array if filtering fails
      return [];
    }
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
