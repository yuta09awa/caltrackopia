import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import MapSidebar from "@/components/map/MapSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MapPage = () => {
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [cuisineOptions, setCuisineOptions] = useState([
    { value: "all", label: "All Cuisines" },
    { value: "american", label: "American" },
    { value: "italian", label: "Italian" },
    { value: "mexican", label: "Mexican" },
    { value: "asian", label: "Asian" },
    { value: "mediterranean", label: "Mediterranean" },
  ]);
  
  const { mapFilters, updateMapFilters } = useAppStore();
  const isMobile = useIsMobile();

  // Load cuisine options based on location
  useEffect(() => {
    // This would typically fetch from a geolocation API
    // For demo purposes, we're just setting a static location
    const mockLocationBasedCuisines = [
      { value: "all", label: "All Cuisines" },
      { value: "american", label: "American" },
      { value: "italian", label: "Italian" },
      { value: "mexican", label: "Mexican" },
      { value: "asian", label: "Asian" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "local", label: "Local Specialties" },
    ];
    
    setCuisineOptions(mockLocationBasedCuisines);
  }, []);

  const handleApplyFilters = () => {
    updateMapFilters({
      priceRange: priceFilter,
    });
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      toast.info(`Selected: ${ingredient.name}`);
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <div className="flex-1 pt-16 pb-16 relative flex">
          <MapSidebar
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            cuisineOptions={cuisineOptions}
            onApplyFilters={handleApplyFilters}
            onSelectIngredient={handleSelectIngredient}
          />
          
          <main className="flex-1 flex flex-col">
            <div className="relative w-full h-[40vh] md:h-[50vh]">
              <MapView selectedIngredient={selectedIngredient} />
              
              <div className="absolute top-4 right-4 z-20 md:hidden">
                <SidebarTrigger asChild>
                  <Button variant="default" size="icon" className="rounded-full shadow-md">
                    <Filter className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </SidebarTrigger>
              </div>
            </div>

            {selectedIngredient && (
              <div className="max-w-4xl mx-auto px-4 pt-6 mb-6 p-4 bg-primary/10 rounded-lg animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">{selectedIngredient.name}</h3>
                  <button 
                    onClick={() => setSelectedIngredient(null)} 
                    className="text-sm text-primary hover:underline"
                  >
                    Clear Selection
                  </button>
                </div>
                {selectedIngredient.description && (
                  <p className="text-sm text-muted-foreground mb-2">{selectedIngredient.description}</p>
                )}
                {selectedIngredient.nutrition && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                    {selectedIngredient.nutrition.calories !== undefined && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="font-medium">Calories</div>
                        <div>{selectedIngredient.nutrition.calories}</div>
                      </div>
                    )}
                    {selectedIngredient.nutrition.protein !== undefined && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="font-medium">Protein</div>
                        <div>{selectedIngredient.nutrition.protein}g</div>
                      </div>
                    )}
                    {selectedIngredient.nutrition.carbs !== undefined && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="font-medium">Carbs</div>
                        <div>{selectedIngredient.nutrition.carbs}g</div>
                      </div>
                    )}
                    {selectedIngredient.nutrition.fat !== undefined && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="font-medium">Fat</div>
                        <div>{selectedIngredient.nutrition.fat}g</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <LocationList />
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default MapPage;
