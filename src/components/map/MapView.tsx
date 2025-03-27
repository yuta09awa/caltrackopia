
import { useState } from "react";
import { Search, MapPin, Plus, Minus } from "lucide-react";

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Google Maps style background */}
      <div className="absolute inset-0 bg-[#e8e8e8]">
        <div className="absolute inset-0 opacity-50">
          {/* Fake roads */}
          <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-white"></div>
          <div className="absolute right-1/3 top-0 bottom-0 w-1 bg-white"></div>
          <div className="absolute top-1/3 left-0 right-0 h-2 bg-white"></div>
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-white"></div>
          
          {/* Fake buildings */}
          <div className="absolute left-[20%] top-[20%] w-10 h-10 bg-[#d4d4d4] rounded-sm"></div>
          <div className="absolute left-[60%] top-[30%] w-14 h-8 bg-[#d4d4d4] rounded-sm"></div>
          <div className="absolute left-[40%] top-[60%] w-12 h-12 bg-[#d4d4d4] rounded-sm"></div>
          <div className="absolute left-[70%] top-[50%] w-8 h-16 bg-[#d4d4d4] rounded-sm"></div>
          <div className="absolute left-[10%] top-[70%] w-16 h-10 bg-[#d4d4d4] rounded-sm"></div>
        </div>
      </div>

      {/* Search bar */}
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-sm px-4 z-10">
        <div className="relative flex items-center w-full bg-white rounded-full shadow-md">
          <div className="flex-shrink-0 pl-4 pr-2 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search locations..."
            className="py-3 pl-0 pr-4 w-full bg-transparent focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Map pin with current location */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative animate-pulse">
          <MapPin className="w-8 h-8 text-primary" strokeWidth={2} />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg overflow-hidden shadow-md">
        <button className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200">
          <Plus className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center">
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
