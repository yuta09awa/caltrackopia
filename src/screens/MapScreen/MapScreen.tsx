import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import MapContainer from "@/features/map/components/MapContainer";
import LocationList from "@/features/locations/components/LocationList";
import GlobalSearch from "@/components/search/GlobalSearch";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import { Ingredient } from "@/models/NutritionalInfo";
import { toast } from "sonner";
import { Location } from "@/features/locations/types";
import MapInfoCard from "@/features/map/components/MapInfoCard";
import { useLocations } from "@/features/locations/hooks/useLocations";
import { useMapState, LatLng } from "@/features/map/hooks/useMapState";
import { usePlacesApi } from "@/features/map/hooks/usePlacesApi";
import { useUserLocation } from "@/features/map/hooks/useUserLocation";

const MapScreen = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapHeight, setMapHeight] = useState("40vh");
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("");
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { locations } = useLocations();
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    hoverLocation,
    clearMarkers 
  } = useMapState();
  
  const { searchPlacesByText, searchNearbyPlaces, resultCount } = usePlacesApi();
  const { userLocation, getUserLocation } = useUserLocation();

  const handleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setCurrentSearchQuery(ingredient.name);
    setDisplayedSearchQuery(ingredient.name);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      const searchMarkers = ingredient.locations.map(location => ({
        position: { lat: location.lat, lng: location.lng },
        locationId: location.id,
        type: 'search-result'
      }));
      
      updateMarkers(searchMarkers);
      if (searchMarkers.length > 0) {
        updateCenter(searchMarkers[0].position);
      }
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      if (mapRef.current) {
        try {
          const placesResults = await searchPlacesByText(
            mapRef.current, 
            ingredient.name, 
            mapState.center,
            10000
          );
          
          if (placesResults.length > 0) {
            updateMarkers(placesResults);
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
        updateMarkers([]);
        toast.info(`Searching for: ${ingredient.name}`);
      }
    }
  }, [mapState.center, searchPlacesByText, updateCenter, updateMarkers]);

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await searchNearbyPlaces(map, mapState.center);
        updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          toast.info(`Loaded ${nearbyPlaces.length} nearby places.`, { duration: 2000 });
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        toast.error('Failed to load nearby places.');
      }
    } else if (selectedIngredient) {
      handleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, searchNearbyPlaces, updateMarkers, handleSelectIngredient, selectedIngredient]);

  const handleLocationSelect = useCallback((locationId: string) => {
    selectLocation(locationId);
    
    // Show location on map with single toast
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      toast.info(`Showing ${location.name} on map`, { duration: 2000 });
    }
  }, [selectLocation, locations]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    const location = locations.find(loc => loc.id === locationId);
    
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

  const handleInfoCardClose = useCallback(() => {
    setShowInfoCard(false);
    selectLocation(null);
    setSelectedLocation(null);
  }, [selectLocation]);

  const handleViewDetails = useCallback((locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    let detailPath = `/location/${locationId}`;

    if (location?.type.toLowerCase() === "grocery" && 
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      detailPath = `/markets/${locationId}`;
    }
    
    window.location.href = detailPath;
    handleInfoCardClose();
  }, [handleInfoCardClose, locations]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    if (currentScrollY < 100) {
      setMapHeight("40vh");
    } else if (scrollDiff > 0) {
      setMapHeight("0vh");
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  const handleSearchReset = useCallback(() => {
    setSelectedIngredient(null);
    setCurrentSearchQuery("");
    setDisplayedSearchQuery("");
    clearMarkers();
    
    if (mapRef.current) {
      searchNearbyPlaces(mapRef.current, mapState.center)
        .then(nearbyPlaces => {
          updateMarkers(nearbyPlaces);
          if (nearbyPlaces.length > 0) {
            toast.info(`Reloaded ${nearbyPlaces.length} nearby places.`, { duration: 2000 });
          }
        })
        .catch(error => console.error('Failed to reload nearby places after search reset:', error));
    }
  }, [mapState.center, searchNearbyPlaces, updateMarkers, clearMarkers]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
    console.log('Map idle:', { center, zoom });
  }, [updateCenter, updateZoom]);

  useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  const searchProps = useMemo(() => ({
    onSelectIngredient: handleSelectIngredient,
    onSearchReset: handleSearchReset,
    displayValue: displayedSearchQuery,
    className: "w-full",
    compact: true
  }), [handleSelectIngredient, handleSearchReset, displayedSearchQuery]);

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
          <GlobalSearch 
            onSelectIngredient={handleSelectIngredient}
            onSearchReset={handleSearchReset}
            displayValue={displayedSearchQuery}
            className="w-full"
            compact={true}
          />
        </div>
        <div className="hidden sm:block">
          <CacheStatusIndicator />
        </div>
      </Navbar>
      
      <main className="flex-1 flex flex-col relative w-full">
        <div className="relative">
          <MapContainer 
            height={mapHeight}
            selectedIngredient={selectedIngredient}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={mapState.selectedLocationId}
            onMarkerClick={handleMarkerClick}
            mapState={mapState}
            searchQuery={currentSearchQuery}
            onMapLoaded={handleMapLoaded}
            onMapIdle={handleMapIdle}
          />
          
          {showInfoCard && selectedLocation && (selectedLocation.type === "Restaurant" || selectedLocation.type === "Grocery") && (
            <MapInfoCard
              location={selectedLocation}
              position={infoCardPosition}
              onClose={handleInfoCardClose}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        <div 
          ref={listRef}
          className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="w-full flex justify-center py-2">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>
          
          <div className="sm:hidden px-4 pb-2">
            <CacheStatusIndicator />
          </div>
          
          <LocationList selectedLocationId={mapState.selectedLocationId} />
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
