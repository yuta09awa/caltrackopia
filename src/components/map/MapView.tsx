
import { useState, useEffect } from "react";
import { Search, Filter, MapPin, X } from "lucide-react";

const MapView = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full h-[85vh] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
      {/* Pseudo map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/3 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full" />
          <div className="absolute left-2/3 top-1/4 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute left-1/3 top-2/3 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute left-3/4 top-3/4 w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>

      {/* Search bar */}
      <div className="absolute top-5 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <div className={`relative flex items-center w-full transition-all duration-300 ${isSearchActive ? "bg-white" : "bg-white/90"} rounded-lg shadow-md border border-gray-100`}>
          <div className="flex-shrink-0 pl-3 pr-2 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search for restaurants, groceries..."
            className="py-3 pl-0 pr-4 w-full bg-transparent focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
          />
          {searchQuery && (
            <button 
              className="flex-shrink-0 pr-3"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter button */}
      <button className="absolute top-5 right-5 z-10 glass rounded-full p-3 shadow-sm hover:shadow transition-shadow">
        <Filter className="w-5 h-5" />
      </button>

      {/* Map pin with current location */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse">
        <div className="relative">
          <MapPin className="w-10 h-10 text-primary" strokeWidth={1.5} />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-3 h-3 bg-primary rounded-full" />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-24 right-5 z-10 glass rounded-lg overflow-hidden shadow-sm">
        <button className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200/30">
          +
        </button>
        <button className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center">
          -
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 text-center text-sm text-muted-foreground">
        Map data would be provided by Google Maps or Mapbox
      </div>
    </div>
  );
};

export default MapView;
