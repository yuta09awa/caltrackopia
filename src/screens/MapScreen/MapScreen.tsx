import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MapContainer from "@/features/map/components/MapContainer";
import LocationList from "@/features/locations/components/LocationList";
import GlobalSearch from "@/components/search/GlobalSearch";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";
import { Location } from "@/features/locations/types";
import MapInfoCard from "@/features/map/components/MapInfoCard";
import { useLocations } from "@/features/locations/hooks/useLocations";

const MapScreen = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapHeight, setMapHeight] = useState("40vh");
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  
  // Get real location data
  const { locations } = useLocations();
  
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      toast.info(`Selected: ${ingredient.name}`);
    }
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    console.log('Selected location from map:', locationId);
  };

  const handleMarkerClick = (locationId: string, position: { x: number; y: number }) => {
    // Find the actual location data from our locations
    const location = locations.find(loc => loc.id === locationId);
    
    if (location) {
      setSelectedLocation(location);
      setSelectedLocationId(locationId);
      setInfoCardPosition(position);
      setShowInfoCard(true);
    } else {
      console.warn('Location not found for ID:', locationId);
    }
  };

  const handleInfoCardClose = () => {
    setShowInfoCard(false);
    setSelectedLocationId(null);
    setSelectedLocation(null);
  };

  const handleViewDetails = (locationId: string) => {
    // Navigate to location details
    console.log('Navigate to location details:', locationId);
    handleInfoCardClose();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar>
        <div className="flex-1 max-w-2xl mx-4">
          <GlobalSearch 
            onSelectIngredient={handleSelectIngredient}
            className="w-full" 
            compact={true}
          />
        </div>
      </Navbar>
      
      <main className="flex-1 flex flex-col relative w-full">
        {/* Map Container */}
        <div className="relative">
          <MapContainer
            height={mapHeight}
            selectedIngredient={selectedIngredient}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
            onMarkerClick={handleMarkerClick}
          />
          
          {/* Map Info Card */}
          {showInfoCard && selectedLocation && (
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
          <LocationList selectedLocationId={selectedLocationId} />
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
