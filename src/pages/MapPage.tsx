
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";
import { Filter } from "lucide-react";

const MapPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                    <select className="w-full p-2 rounded-md border border-gray-200 text-sm">
                      <option>Any Price</option>
                      <option>$</option>
                      <option>$$</option>
                      <option>$$$</option>
                      <option>$$$$</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Dietary Preferences</label>
                    <select className="w-full p-2 rounded-md border border-gray-200 text-sm">
                      <option>All Options</option>
                      <option>High Protein</option>
                      <option>High Fiber</option>
                      <option>Low Fat</option>
                      <option>Keto Friendly</option>
                      <option>Vegan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Cuisine Type</label>
                    <select className="w-full p-2 rounded-md border border-gray-200 text-sm">
                      <option>All Cuisines</option>
                      <option>American</option>
                      <option>Italian</option>
                      <option>Mexican</option>
                      <option>Asian</option>
                      <option>Mediterranean</option>
                    </select>
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
