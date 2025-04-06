
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import FilterPanel from "@/components/map/FilterPanel";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useIsMobile } from "@/hooks/use-mobile";

const MapPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
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
