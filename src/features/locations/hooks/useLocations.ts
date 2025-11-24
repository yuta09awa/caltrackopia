
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useMapFilters } from '@/features/map';
import { EdgeAPIClient } from '@/lib/edge-api-client';
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
  const { mapFilters } = useMapFilters();

  // Fetch all locations from the edge API
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const edgeClient = new EdgeAPIClient();
        console.log('Fetching locations from edge API...');
        
        const result = await edgeClient.searchRestaurants({
          limit: 1000
        });
        
        console.log('Fetched locations:', result.results.length, 'items from edge');
        
        if (result.results.length === 0) {
          console.log('No locations found from edge, falling back to mock data');
          const { mockLocations } = await import('../data/mockLocations');
          setAllLocations(mockLocations);
        } else {
          // Map edge API results to Location type
          const mappedLocations: Location[] = result.results.map(place => ({
            id: place.id,
            place_id: place.place_id,
            name: place.name,
            type: place.primary_type === 'restaurant' ? 'Restaurant' : 'Grocery',
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.formatted_address || '',
            rating: place.rating || 0,
            priceLevel: place.price_level || 2,
            price: ['$', '$$', '$$$', '$$$$'][place.price_level || 1] as "$" | "$$" | "$$$" | "$$$$",
            isOpen: place.is_open_now || false,
            openNow: place.is_open_now || false,
            cuisine: place.cuisine_types?.[0] || 'Various',
            hours: place.opening_hours as any,
            phone: place.phone_number,
            website: place.website,
            distance: place.distance_meters ? `${(place.distance_meters / 1000).toFixed(1)} km` : '0 km',
            dietaryOptions: [],
            images: place.photo_references || [],
            coordinates: { lat: place.latitude, lng: place.longitude }
          }));
          setAllLocations(mappedLocations);
        }
      } catch (err) {
        console.error('Error fetching locations from edge API:', err);
        setError('Failed to load locations');
        // Fallback to mock data if edge fetch fails
        try {
          const { mockLocations } = await import('../data/mockLocations');
          console.log('Falling back to mock locations due to error');
          setAllLocations(mockLocations);
          setError(null);
        } catch (mockErr) {
          console.error('Error loading mock locations:', mockErr);
          setAllLocations([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!disabled) {
      fetchLocations();
    }
  }, [disabled]);

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
