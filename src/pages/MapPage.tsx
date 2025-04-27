
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/search/GlobalSearch";
import FilterSheet from "@/components/map/FilterSheet";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const MapPage = () => {
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [cuisineOptions] = useState([
    { value: "all", label: "All Cuisines" },
    { value: "american", label: "American" },
    { value: "italian", label: "Italian" },
    { value: "mexican", label: "Mexican" },
    { value: "asian", label: "Asian" },
    { value: "mediterranean", label: "Mediterranean" },
  ]);
  
  const { mapFilters, updateMapFilters } = useAppStore();
  const isMobile = useIsMobile();

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      toast.info(`Selected: ${ingredient.name}`);
    }
  };

  const handleApplyFilters = () => {
    updateMapFilters({
      priceRange: priceFilter,
    });
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
        <div className={cn(
          "relative w-full transition-all duration-300",
          mapExpanded ? "h-[85vh]" : "h-[25vh]"
        )}>
          <MapView selectedIngredient={selectedIngredient} />
          
          {/* Filter Button - Always visible on map */}
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="default" 
                  size="icon"
                  className="absolute top-4 right-4 rounded-full shadow-md z-20"
                >
                  <Filter className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </DrawerTrigger>
              <FilterSheet 
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                cuisineOptions={cuisineOptions}
                onApplyFilters={handleApplyFilters}
              />
            </Drawer>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="default" 
                  size="icon"
                  className="absolute top-4 right-4 rounded-full shadow-md z-20"
                >
                  <Filter className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </SheetTrigger>
              <FilterSheet 
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                cuisineOptions={cuisineOptions}
                onApplyFilters={handleApplyFilters}
              />
            </Sheet>
          )}
        </div>

        {/* Location List with Drag Handle */}
        <div className="flex-1 bg-background rounded-t-xl shadow-lg -mt-4 relative z-10">
          <div 
            className="w-full flex justify-center py-2 cursor-pointer"
            onClick={() => setMapExpanded(!mapExpanded)}
          >
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>
          <LocationList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
