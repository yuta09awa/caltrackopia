
import { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { locationService } from '@/services/locationService';
import { 
  filterLocationsByType, 
  filterLocationsByOpenStatus, 
  sortLocations 
} from '../utils/locationUtils';
import { validateAndSanitizeLocations } from '../utils/validationUtils';
import { Location, LocationType, SortOption } from '../types';

export function useLocations() {
  // Initialize locations as an empty array, then fetch from database
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters } = useAppStore();

  // Fetch locations from the database on component mount
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
          setLocations(mockLocations);
        } else {
          setLocations(fetchedLocations);
        }
      } catch (err) {
        console.error('Error fetching locations in useLocations:', err);
        setError('Failed to load locations from database');
        // Fallback to mock data if database fetch fails
        try {
          const { mockLocations } = await import('../data/mockLocations');
          console.log('Falling back to mock locations due to error');
          setLocations(mockLocations);
          // Clear error since we have fallback data
          setError(null);
        } catch (mockErr) {
          console.error('Error loading mock locations:', mockErr);
          setLocations([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations by type, open status, and sort by selected option
  const filteredAndSortedLocations = useMemo(() => {
    try {
      // Validate and sanitize locations before filtering
      const validatedLocations = validateAndSanitizeLocations(locations);
      
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
    setIsOpenNow,
    loading,
    error
  };
}
