
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppStore } from '@/app/store';
import { locationService } from '@/services/locationService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { 
  filterLocationsByType, 
  filterLocationsByOpenStatus, 
  sortLocations 
} from '../utils/locationUtils';
import { validateAndSanitizeLocations } from '../utils/validationUtils';
import { Location, LocationType, SortOption } from '../types';

const LOCATIONS_PER_PAGE = 20;

export function useLocations(options?: { disabled?: boolean }) {
  const { disabled = false } = options || {};
  // Initialize locations as an empty array, then fetch from database
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [displayedLocations, setDisplayedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters } = useAppStore();

  // Fetch all locations from the database on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching locations from database...');
        const fetchedLocations = await locationService.getLocations();
        console.log('Fetched locations:', fetchedLocations.length, 'items');
        
        if (fetchedLocations.length === 0) {
          console.log('No locations found in database, falling back to mock data');
          // If database returns empty array, use mock data
          const { mockLocations } = await import('../data/mockLocations');
          setAllLocations(mockLocations);
        } else {
          setAllLocations(fetchedLocations);
        }
      } catch (err) {
        console.error('Error fetching locations in useLocations:', err);
        setError('Failed to load locations from database');
        // Fallback to mock data if database fetch fails
        try {
          const { mockLocations } = await import('../data/mockLocations');
          console.log('Falling back to mock locations due to error');
          setAllLocations(mockLocations);
          // Clear error since we have fallback data
          setError(null);
        } catch (mockErr) {
          console.error('Error loading mock locations:', mockErr);
          setAllLocations([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter and sort locations based on current filters
  const filteredAndSortedLocations = useMemo(() => {
    try {
      // Validate and sanitize locations before filtering
      const validatedLocations = validateAndSanitizeLocations(allLocations);
      
      // First filter by location type
      const typeFiltered = filterLocationsByType(validatedLocations, activeTab);
      
      // Then filter by open status
      const openStatusFiltered = filterLocationsByOpenStatus(typeFiltered, isOpenNow);
      
      // Finally sort the results
      return sortLocations(openStatusFiltered, sortOption);
    } catch (error) {
      console.error('Error filtering locations:', error);
      // Return empty array if filtering fails
      return [];
    }
  }, [allLocations, activeTab, sortOption, isOpenNow]);

  // Update displayed locations and pagination when filters change
  useEffect(() => {
    const totalItems = filteredAndSortedLocations.length;
    const itemsToShow = page * LOCATIONS_PER_PAGE;
    
    setDisplayedLocations(filteredAndSortedLocations.slice(0, itemsToShow));
    setHasNextPage(itemsToShow < totalItems);
  }, [filteredAndSortedLocations, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, sortOption, isOpenNow]);

  const loadMore = useCallback(async () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const { isLoading: isLoadingMore, loadingRef } = useInfiniteScroll({
    hasNextPage,
    loadMore,
    threshold: 200
  });

  const filterByType = (type: LocationType) => {
    setActiveTab(type);
  };

  return {
    locations: displayedLocations,
    activeTab,
    filterByType,
    sortOption,
    setSortOption,
    isOpenNow,
    setIsOpenNow,
    loading,
    error,
    // Infinite scroll props
    hasNextPage,
    isLoadingMore,
    loadingRef,
    totalCount: filteredAndSortedLocations.length
  };
}
