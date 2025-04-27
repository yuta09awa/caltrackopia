
import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import GlobalSearch from "@/components/search/GlobalSearch";

const MapPage = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [mapHeight, setMapHeight] = useState("40vh");
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();
  
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    if (currentScrollY < 100) {
      setMapHeight("40vh");
    } else if (scrollDiff > 0) {
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
      
      <main className="flex-1 flex relative w-full">
        <div className="flex-1 flex flex-col">
          {/* Map Container */}
          <div 
            className="relative w-full transition-all duration-300 ease-out"
            style={{ height: mapHeight }}
          >
            <MapView selectedIngredient={selectedIngredient} />
          </div>

          {/* Scrollable Location List */}
          <div 
            ref={listRef}
            className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10 overflow-y-auto h-[calc(100vh-12rem)]"
            onScroll={handleScroll}
          >
            <div className="w-full flex justify-center py-2">
              <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            </div>
            <LocationList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
