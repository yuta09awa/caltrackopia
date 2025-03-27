
import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Search, Plus, Minus } from "lucide-react";

// The API key should ideally be in environment variables for production
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 37.7749, // San Francisco coordinates as default
  lng: -122.4194
};

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(14);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      if (currentZoom > 1) {
        map.setZoom(currentZoom - 1);
        setZoom(currentZoom - 1);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
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

      {/* Google Map */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Current location marker */}
          <Marker position={defaultCenter} />
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg overflow-hidden shadow-md">
        <button 
          className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200"
          onClick={handleZoomIn}
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
          onClick={handleZoomOut}
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
