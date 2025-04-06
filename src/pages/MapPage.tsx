
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import FilterPanel from "@/components/map/FilterPanel";
import IngredientSearch from "@/components/ingredients/IngredientSearch";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { toast } from "sonner";

const MapPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [showIngredientSearch, setShowIngredientSearch] = useState(false);
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
    toast.success(`Selected: ${ingredient.name}`);
    // Here you would typically do something with the selected ingredient
    // For example, add it to a list of filters or display its details
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-16">
        {/* Full-width map container */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <MapView />
          
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
          />
        </div>

        {/* Ingredient Search Section */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Find Locations by Ingredient</h2>
            <button
              onClick={() => setShowIngredientSearch(!showIngredientSearch)}
              className="text-sm text-primary hover:underline"
            >
              {showIngredientSearch ? "Hide Search" : "Search Ingredients"}
            </button>
          </div>
          
          {showIngredientSearch && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <IngredientSearch onSelectIngredient={handleSelectIngredient} />
            </div>
          )}
        </div>
        
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
