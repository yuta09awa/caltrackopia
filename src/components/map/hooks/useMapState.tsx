
import { useState, useEffect } from "react";
import { Ingredient } from "@/hooks/useIngredientSearch";

type Marker = {
  id: string;
  position: { lat: number; lng: number };
  title: string;
};

export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Marker[];
}

const defaultCenter = {
  lat: 37.7749, // San Francisco coordinates
  lng: -122.4194
};

export function useMapState(
  map: google.maps.Map | null,
  selectedIngredient: Ingredient | null | undefined,
  userLocation: { lat: number; lng: number } | null
) {
  const [mapState, setMapState] = useState<MapState>({
    center: defaultCenter,
    zoom: 14,
    markers: []
  });

  useEffect(() => {
    updateMapForSelectedIngredient();
  }, [selectedIngredient, map, userLocation]);

  const updateMapForSelectedIngredient = () => {
    if (selectedIngredient?.locations?.length > 0) {
      const newMarkers = selectedIngredient.locations.map(location => ({
        id: location.id,
        position: { lat: location.lat, lng: location.lng },
        title: location.name
      }));
      
      // Center the map on the first location
      if (newMarkers.length > 0) {
        setMapState({
          center: newMarkers[0].position,
          zoom: mapState.zoom,
          markers: newMarkers
        });
        
        // Center the map
        if (map) {
          map.setCenter(newMarkers[0].position);
          
          // Adjust zoom level if there are multiple markers
          if (newMarkers.length > 1) {
            fitBoundsToMarkers(map, newMarkers);
          }
        }
      }
    } else {
      // If no ingredient is selected, show user location if available
      if (userLocation) {
        setMapState({
          center: userLocation,
          zoom: 14,
          markers: []
        });
        
        // Center the map on user location
        if (map) {
          map.setCenter(userLocation);
          map.setZoom(14);
        }
      } else {
        // Fall back to default center if no user location
        setMapState({
          center: defaultCenter,
          zoom: 14,
          markers: []
        });
        
        // Center the map on default location
        if (map) {
          map.setCenter(defaultCenter);
          map.setZoom(14);
        }
      }
    }
  };

  const fitBoundsToMarkers = (map: google.maps.Map, markers: Marker[]) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
  };

  const updateZoom = (newZoom: number) => {
    setMapState(prev => ({ ...prev, zoom: newZoom }));
    if (map) {
      map.setZoom(newZoom);
    }
  };

  const zoomIn = () => {
    updateZoom(mapState.zoom + 1);
  };

  const zoomOut = () => {
    if (mapState.zoom > 1) {
      updateZoom(mapState.zoom - 1);
    }
  };

  const centerToUserLocation = (userLoc: { lat: number; lng: number } | null) => {
    if (userLoc && map) {
      setMapState(prev => ({ ...prev, center: userLoc }));
      map.setCenter(userLoc);
      updateZoom(14);
    }
  };

  return {
    mapState,
    zoomIn,
    zoomOut,
    centerToUserLocation
  };
}
