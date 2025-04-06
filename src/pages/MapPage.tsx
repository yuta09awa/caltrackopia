
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import FilterPanel from "@/components/map/FilterPanel";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";

const MapPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    // Could also close the filter panel after applying
    // setIsFilterOpen(false);
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    if (ingredient.locations && ingredient.locations.length > 0) {
      toast.success(`Found ${ingredient.locations.length} locations for ${ingredient.name}`);
    } else {
      toast.info(`Selected: ${ingredient.name}`);
    }
    
    // Close filter panel after selection
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-16">
        {/* Full-width map container */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <MapView selectedIngredient={selectedIngredient} />
          
          {/* Floating Filter Button */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="absolute top-4 right-4 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Filter Panel */}
          <FilterPanel 
            isOpen={isFilterOpen}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            cuisineOptions={cuisineOptions}
            onApplyFilters={handleApplyFilters}
            onSelectIngredient={handleSelectIngredient}
          />
        </div>

        {/* Selected Ingredient Info - moved from separate section to appear always if ingredient is selected */}
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
        
        {/* Listings Section */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <LocationList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
