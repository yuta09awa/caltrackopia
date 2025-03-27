
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const isMobile = useIsMobile();

  // This would typically fetch from a geolocation API
  // For demo purposes, we're just setting a static location
  useState(() => {
    // Example: get user location then update cuisine options based on location
    // navigator.geolocation.getCurrentPosition((position) => {
    //   fetchCuisinesByLocation(position.coords.latitude, position.coords.longitude)
    //     .then(data => setCuisineOptions(data));
    // });

    // Simulating different cuisine options based on location
    const mockLocationBasedCuisines = [
      { value: "all", label: "All Cuisines" },
      { value: "american", label: "American" },
      { value: "italian", label: "Italian" },
      { value: "mexican", label: "Mexican" },
      { value: "asian", label: "Asian" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "local", label: "Local Specialties" }, // Location-specific cuisine
    ];
    
    setCuisineOptions(mockLocationBasedCuisines);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-16">
        <Container>
          {/* Map Section */}
          <div className="relative w-full h-[40vh] md:h-[50vh] mb-4 mt-2 rounded-xl overflow-hidden shadow-sm">
            <MapView />
            
            {/* Floating Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="absolute top-4 right-4 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Filter Panel (shows when filter is clicked) */}
            {isFilterOpen && (
              <div className="absolute top-16 right-4 z-20 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100 animate-fade-in">
                <h3 className="font-medium mb-3">Filter Options</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Price Range</label>
                    <div className="flex gap-2 mt-1">
                      {['$', '$$', '$$$', '$$$$'].map((price) => (
                        <button
                          key={price}
                          onClick={() => setPriceFilter(price === priceFilter ? null : price)}
                          className={`flex-1 py-1 px-2 rounded-md border ${
                            price === priceFilter
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          } transition-colors text-center`}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Dietary Preferences</label>
                    <Select>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="All Options" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Options</SelectItem>
                        <SelectItem value="high-protein">High Protein</SelectItem>
                        <SelectItem value="high-fiber">High Fiber</SelectItem>
                        <SelectItem value="low-fat">Low Fat</SelectItem>
                        <SelectItem value="keto">Keto Friendly</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Cuisine Type</label>
                    <Select>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="All Cuisines" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineOptions.map((cuisine) => (
                          <SelectItem key={cuisine.value} value={cuisine.value}>
                            {cuisine.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Exclude Ingredients</label>
                    <input 
                      type="text" 
                      placeholder="e.g., peanuts, gluten, MSG" 
                      className="w-full p-2 rounded-md border border-gray-200 text-sm"
                    />
                  </div>
                  <button className="w-full bg-primary text-white p-2 rounded-md text-sm mt-2">
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Listings Section */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <LocationList />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
