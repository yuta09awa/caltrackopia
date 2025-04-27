
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";
import GlobalSearch from "@/components/search/GlobalSearch";
import MapSidebar from "@/components/map/MapSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import FilterSheet from "@/components/map/FilterSheet";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const cuisineOptions = [
  { value: "all", label: "All Cuisines" },
  { value: "american", label: "American" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "thai", label: "Thai" },
];

const MapPage = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [mapHeight, setMapHeight] = useState("40vh");
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();
  
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      toast.info(`Selected: ${ingredient.name}`);
    }
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

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully");
  };

  const FilterTrigger = isMobile ? DrawerTrigger : SheetTrigger;
  const FilterContainer = isMobile ? Drawer : Sheet;
  
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
        {/* Desktop Sidebar */}
        <MapSidebar 
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          cuisineOptions={cuisineOptions}
          onApplyFilters={handleApplyFilters}
        />

        <div className="flex-1 flex flex-col">
          {/* Mobile Filter Button */}
          <div className="md:hidden p-2">
            <FilterContainer>
              <FilterTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </FilterTrigger>
              <FilterSheet
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                cuisineOptions={cuisineOptions}
                onApplyFilters={handleApplyFilters}
              />
            </FilterContainer>
          </div>

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
            className={cn(
              "flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10 overflow-y-auto",
              isMobile ? "h-[calc(100vh-16rem)]" : "h-[calc(100vh-12rem)]"
            )}
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
