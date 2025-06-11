import { useEffect, useCallback, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useMapStore, Place } from '@/store/mapStore';
import { supabase } from '@/integrations/supabase/client';
import { LatLng, MarkerData } from '../types';

const libraries: ("places" | "marker")[] = ['places', 'marker'];

export const useMapController = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Get all state and actions from the store
  const {
    center,
    zoom,
    markers,
    selectedPlace,
    hoveredLocationId,
    apiKey,
    isLoaded: googleMapsLoaded,
    loadError,
    isSearching,
    searchQuery,
    filters,
    searchResults,
    showInfoCard,
    infoCardPosition,
    
    setCenter,
    setZoom,
    setMarkers,
    setSelectedPlace,
    setHoveredLocationId,
    setApiKey,
    setIsLoaded,
    setLoadError,
    setIsSearching,
    setSearchQuery,
    setFilters,
    setSearchResults,
    setShowInfoCard,
    setInfoCardPosition,
    handleMarkerClick,
    handleMapClick,
    resetSearch
  } = useMapStore();

  // Load Google Maps API
  const { isLoaded: scriptLoaded, loadError: scriptError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Load API key from Supabase
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('🔑 Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');
        
        if (error) throw error;
        if (data?.apiKey) {
          console.log('✅ Successfully retrieved API key');
          setApiKey(data.apiKey);
        } else {
          throw new Error('No API key in response');
        }
      } catch (error: any) {
        console.error('❌ Failed to load API key:', error);
        setLoadError(`Failed to load API key: ${error.message}`);
      }
    };

    if (!apiKey) {
      fetchApiKey();
    }
  }, [apiKey, setApiKey, setLoadError]);

  // Update loaded state when Google Maps script loads
  useEffect(() => {
    if (scriptError) {
      console.error('❌ Google Maps Script Error:', scriptError);
      setLoadError(`Google Maps Error: ${scriptError.message}`);
      setIsLoaded(false);
    } else if (scriptLoaded && apiKey) {
      console.log('✅ Google Maps loaded successfully');
      setIsLoaded(true);
      setLoadError(null);
    } else {
      setIsLoaded(false);
    }
  }, [scriptLoaded, scriptError, apiKey, setIsLoaded, setLoadError]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('🗺️ Map loaded successfully');
  }, []);

  // Handle map idle (camera movement finished)
  const onMapIdle = useCallback((newCenter: LatLng, newZoom: number) => {
    console.log('🎯 Map idle - Center:', newCenter, 'Zoom:', newZoom);
    setCenter(newCenter);
    setZoom(newZoom);
  }, [setCenter, setZoom]);

  // Search for places
  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    console.log('🔍 Searching for places:', query);
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const mockResults: Place[] = [
        {
          id: '1',
          name: `${query} Restaurant`,
          address: '123 Main St, San Francisco, CA',
          latitude: center.lat + (Math.random() - 0.5) * 0.01,
          longitude: center.lng + (Math.random() - 0.5) * 0.01,
          category: 'restaurant',
          rating: 4.2,
          user_ratings_total: 150,
          price_level: 2,
          open_now: true
        },
        {
          id: '2',
          name: `${query} Market`,
          address: '456 Oak Ave, San Francisco, CA',
          latitude: center.lat + (Math.random() - 0.5) * 0.01,
          longitude: center.lng + (Math.random() - 0.5) * 0.01,
          category: 'grocery_store',
          rating: 4.0,
          user_ratings_total: 89,
          price_level: 1,
          open_now: false
        }
      ];

      // Convert to markers
      const newMarkers: MarkerData[] = mockResults.map(place => ({
        position: { lat: place.latitude, lng: place.longitude },
        locationId: place.id,
        type: place.category === 'restaurant' ? 'restaurant' : 'grocery'
      }));

      setSearchResults(mockResults);
      setMarkers(newMarkers);
      
    } catch (error: any) {
      console.error('❌ Search failed:', error);
      setLoadError(`Search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  }, [center, setIsSearching, setSearchQuery, setSearchResults, setMarkers, setLoadError, resetSearch]);

  // Apply filters to current results
  const applyFilters = useCallback(() => {
    console.log('🔧 Applying filters:', filters);
    // For now, just keep existing results
  }, [filters]);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 User location found:', newCenter);
          setCenter(newCenter);
          setZoom(14);
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
        }
      );
    }
  }, [setCenter, setZoom]);

  return {
    // State
    center,
    zoom,
    markers,
    selectedPlace,
    hoveredLocationId,
    apiKey,
    isLoaded: googleMapsLoaded,
    loadError,
    isSearching,
    searchQuery,
    filters,
    searchResults,
    showInfoCard,
    infoCardPosition,
    mapRef,
    
    // Actions
    setCenter,
    setZoom,
    setMarkers,
    setSelectedPlace,
    setHoveredLocationId,
    setFilters,
    handleMarkerClick,
    handleMapClick,
    resetSearch,
    onMapLoad,
    onMapIdle,
    searchPlaces,
    applyFilters,
    getUserLocation
  };
};
