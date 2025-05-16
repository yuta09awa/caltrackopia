
import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { mockLocations } from '../data/mockLocations';
import { 
  filterLocationsByType, 
  filterLocationsByOpenStatus, 
  sortLocations 
} from '../utils/locationUtils';

export type LocationType = 'all' | 'restaurant' | 'grocery' | 'farmers-market' | 'convenience-store' | 'food-festival';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';

export interface Location {
  id: string;
  name: string;
  type: string;
  subType?: string; // Added for more specific categorization
  rating: number;
  distance: string;
  address: string;
  openNow: boolean;
  price: string;
  dietaryOptions: string[];
  cuisine: string;
  images: string[];
  seasonality?: string; // For seasonal markets/festivals
  vendorCount?: number; // For markets with multiple vendors
  schedule?: string; // For periodic markets/festivals
}

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
