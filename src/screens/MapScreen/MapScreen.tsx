import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import MapContainer from "@/features/map/components/MapContainer";
import LocationList from "@/features/locations/components/LocationList";
import GlobalSearch from "@/components/search/GlobalSearch";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";
import { Location } from "@/features/locations/types";
import MapInfoCard from "@/features/map/components/MapInfoCard";
import { useLocations } from "@/features/locations/hooks/useLocations";
import { useMapState, LatLng } from "@/features/map/hooks/useMapState";
import { usePlacesApi } from "@/features/map/hooks/usePlacesApi";
import { useUserLocation } from "@/features/map/hooks/useUserLocation";

/**
 * MapScreen Component
 *
 * This component serves as the main screen for displaying the map and location list.
 * It integrates various features such as global search, map rendering, location filtering,
 * and displays location details via an info card. It also handles map interactions
 * like zooming and panning, and manages the dynamic height of the map based on scroll.
 * 
 * Performance optimizations include:
 * - Debounced map state updates (300ms delay)
 * - Memoized callbacks and computed values
 * - Consolidated marker state management
 * - Efficient Places API usage with proper field selection
 * - Cached Places API integration for cost reduction and performance
 */
const MapScreen = () => {
  // State for managing selected ingredient from search
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  // State to control the visibility of the map info card
  const [showInfoCard, setShowInfoCard] = useState(false);
  // State to store the position of the map info card
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
  // State for the currently selected location's full data
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  // State to control the height of the map container, allowing it to collapse on scroll
  const [mapHeight, setMapHeight] = useState("40vh");
  // State for the current search query, used internally for API calls
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("");
  // State for the displayed search query in the GlobalSearch input
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState<string>("");
  // Ref to the scrollable location list container
  const listRef = useRef<HTMLDivElement>(null);
  // Ref to track the last scroll position for map height adjustment
  const lastScrollY = useRef(0);
  // Ref to store the Google Maps instance once it's loaded
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Custom hook to fetch and manage location data
  const { locations } = useLocations();
  
  // Custom hook to manage map state (center, zoom, markers, selection)
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    hoverLocation,
    clearMarkers 
  } = useMapState();
  
  // Custom hook for interacting with Google Places API (now with caching)
  const { searchPlacesByText, searchNearbyPlaces, cacheHitRate } = usePlacesApi();

  // Custom hook to get the user's current geographical location
  const { userLocation, getUserLocation } = useUserLocation();

  /**
   * Handles the selection of an ingredient from the search results.
   * This triggers a search on the map for locations related to the ingredient.
   * @param {Ingredient} ingredient - The selected ingredient.
   */
  const handleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setCurrentSearchQuery(ingredient.name);
    setDisplayedSearchQuery(ingredient.name);
    
    // If it's an ingredient with known locations (from our mock data), use those
    if (ingredient.locations && ingredient.locations.length > 0) {
      const searchMarkers = ingredient.locations.map(location => ({
        position: { lat: location.lat, lng: location.lng },
        locationId: location.id,
        type: 'search-result'
      }));
      
      updateMarkers(searchMarkers);
      // Update map center to the first search result if available
      if (searchMarkers.length > 0) {
        updateCenter(searchMarkers[0].position);
      }
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      // If no ingredient locations found in our mock data, search using Places API
      if (mapRef.current) {
        try {
          const placesResults = await searchPlacesByText(
            mapRef.current, 
            ingredient.name, 
            mapState.center,
            10000 // 10km radius
          );
          
          if (placesResults.length > 0) {
            updateMarkers(placesResults);
            // Update map center to the first Places API result
            updateCenter(placesResults[0].position);
            toast.success(`Found ${placesResults.length} places for ${ingredient.name}`);
          } else {
            updateMarkers([]);
            toast.info(`No locations found for ${ingredient.name}`);
          }
        } catch (error) {
          console.error('Places search failed:', error);
          updateMarkers([]);
          toast.error(`Search failed for ${ingredient.name}`);
        }
      } else {
        // If map not loaded yet, just store the query, search will run on map load
        updateMarkers([]);
        toast.info(`Searching for: ${ingredient.name}`);
      }
    }
  }, [mapState.center, searchPlacesByText, updateCenter, updateMarkers]);

  /**
   * Handles the event when the Google Map is fully loaded.
   * Stores the map instance and triggers initial nearby places search if no search query is active.
   * @param {google.maps.Map} map - The Google Maps instance.
   */
  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    
    // If no active search query, load nearby places
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await searchNearbyPlaces(map, mapState.center);
        updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          toast.info(`Loaded ${nearbyPlaces.length} nearby places.`);
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        toast.error('Failed to load nearby places.');
      }
    } else if (selectedIngredient) {
      // If there's an active search query, re-run the search on map load
      handleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, searchNearbyPlaces, updateMarkers, handleSelectIngredient, selectedIngredient]);

  /**
   * Handles a location being selected (e.g., from the list).
   * Updates the selected location ID in state.
   * @param {string} locationId - The ID of the selected location.
   */
  const handleLocationSelect = useCallback((locationId: string) => {
    selectLocation(locationId);
  }, [selectLocation]);

  /**
   * Handles a marker click event on the map.
   * Displays an info card for the clicked location.
   * @param {string} locationId - The ID of the clicked location.
   * @param {{x: number, y: number}} position - The screen coordinates where the marker was clicked.
   */
  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    const location = locations.find(loc => loc.id === locationId);
    
    // Only show popup for restaurant locations (food locations) or grocery stores
    if (location && (location.type === "Restaurant" || location.type === "Grocery")) {
      setSelectedLocation(location);
      selectLocation(locationId);
      setInfoCardPosition(position);
      setShowInfoCard(true);
    } else if (location) {
      console.log('Location found but not a restaurant or grocery, skipping popup:', location.type);
    } else {
      console.warn('Location not found for ID:', locationId);
    }
  }, [locations, selectLocation]);

  /**
   * Closes the map info card and clears the selected location.
   */
  const handleInfoCardClose = useCallback(() => {
    setShowInfoCard(false);
    selectLocation(null);
    setSelectedLocation(null);
  }, [selectLocation]);

  /**
   * Navigates to the detailed view of a location.
   * @param {string} locationId - The ID of the location to view details for.
   */
  const handleViewDetails = useCallback((locationId: string) => {
    // Determine the correct route based on location type and subType
    const location = locations.find(loc => loc.id === locationId);
    let detailPath = `/location/${locationId}`; // Default to generic location page

    if (location?.type.toLowerCase() === "grocery" && 
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      detailPath = `/markets/${locationId}`; // Route to markets page for specific grocery subtypes
    }
    
    window.location.href = detailPath; // Using direct assignment for navigation
    handleInfoCardClose();
  }, [handleInfoCardClose, locations]);

  /**
   * Handles scrolling of the location list.
   * Collapses the map when scrolling down, expands it when scrolling up near the top.
   * @param {React.UIEvent<HTMLDivElement>} e - The scroll event.
   */
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Calculate new map height
    if (currentScrollY < 100) {
      // When scrolling near the top, expand map back to default height
      setMapHeight("40vh");
    } else if (scrollDiff > 0) {
      // Scrolling down - collapse map
      setMapHeight("0vh");
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  /**
   * Resets the global search state, clearing selected ingredients and markers.
   */
  const handleSearchReset = useCallback(() => {
    setSelectedIngredient(null);
    setCurrentSearchQuery("");
    setDisplayedSearchQuery("");
    clearMarkers();
    
    // Re-load nearby places after search reset
    if (mapRef.current) {
      searchNearbyPlaces(mapRef.current, mapState.center)
        .then(nearbyPlaces => {
          updateMarkers(nearbyPlaces);
          if (nearbyPlaces.length > 0) {
            toast.info(`Reloaded ${nearbyPlaces.length} nearby places.`);
          }
        })
        .catch(error => console.error('Failed to reload nearby places after search reset:', error));
    }
  }, [mapState.center, searchNearbyPlaces, updateMarkers, clearMarkers]);

  /**
   * Callback for when the map finishes an interaction (drag, zoom).
   * Updates the global map state (center and zoom) in the Zustand store.
   * This is debounced to prevent excessive updates during map interactions.
   * @param {LatLng} center - The new center coordinates.
   * @param {number} zoom - The new zoom level.
   */
  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
    
    // Optionally reload nearby places when map moves significantly
    // This could be enabled for dynamic content loading
    console.log('Map idle:', { center, zoom });
  }, [updateCenter, updateZoom]);

  // Effect to update map center to user location when available
  useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  // Memoize the search component props to prevent unnecessary re-renders
  const searchProps = useMemo(() => ({
    onSelectIngredient: handleSelectIngredient,
    onSearchReset: handleSearchReset,
    displayValue: displayedSearchQuery,
    className: "w-full",
    compact: true
  }), [handleSelectIngredient, handleSearchReset, displayedSearchQuery]);

  // Memoize the map container props
  const mapContainerProps = useMemo(() => ({
    height: mapHeight,
    selectedIngredient,
    onLocationSelect: handleLocationSelect,
    selectedLocationId: mapState.selectedLocationId,
    onMarkerClick: handleMarkerClick,
    mapState,
    searchQuery: currentSearchQuery,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle
  }), [
    mapHeight,
    selectedIngredient,
    handleLocationSelect,
    mapState,
    handleMarkerClick,
    currentSearchQuery,
    handleMapLoaded,
    handleMapIdle
  ]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar>
        <div className="flex-1 max-w-2xl mx-4">
          <GlobalSearch {...searchProps} />
        </div>
        <div className="hidden sm:block">
          <CacheStatusIndicator />
        </div>
      </Navbar>
      
      <main className="flex-1 flex flex-col relative w-full">
        {/* Map Container */}
        <div className="relative">
          <MapContainer {...mapContainerProps} />
          
          {/* Map Info Card - only show for restaurant/grocery locations */}
          {showInfoCard && selectedLocation && (selectedLocation.type === "Restaurant" || selectedLocation.type === "Grocery") && (
            <MapInfoCard
              location={selectedLocation}
              position={infoCardPosition}
              onClose={handleInfoCardClose}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        {/* Scrollable Location List */}
        <div 
          ref={listRef}
          className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="w-full flex justify-center py-2">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>
          
          {/* Cache status for mobile */}
          <div className="sm:hidden px-4 pb-2">
            <CacheStatusIndicator />
          </div>
          
          {/* 
            PERFORMANCE NOTE: For a global food access app with potentially hundreds of thousands 
            or millions of locations, it is CRITICAL to implement list virtualization 
            (e.g., react-window, react-virtualized) for the LocationList component. 
            This will render only the visible items in the viewport, significantly improving 
            performance and memory usage, especially on mobile devices.
          */}
          <LocationList selectedLocationId={mapState.selectedLocationId} />
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
