
import { useState, useEffect, useCallback } from "react";
import { Ingredient } from "@/hooks/useIngredientSearch";

export interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  isSelected?: boolean;
}

export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MarkerData[];
}

const defaultCenter = {
  lat: 37.7749, // San Francisco coordinates
  lng: -122.4194
};

const defaultZoom = 14;

export function useMapState(
  map: google.maps.Map | null,
  selectedIngredient: Ingredient | null | undefined,
  userLocation: { lat: number; lng: number } | null
) {
  const [mapState, setMapState] = useState<MapState>({
    center: defaultCenter,
    zoom: defaultZoom,
    markers: []
  });

  const fitBoundsToMarkers = useCallback((map: google.maps.Map, markers: MarkerData[]) => {
    if (markers.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.position);
    });
    
    map.fitBounds(bounds);
    
    // Set minimum zoom level for better UX when there's only one marker
    if (markers.length === 1 && map.getZoom() && map.getZoom() > defaultZoom) {
      map.setZoom(defaultZoom);
    }
  }, []);

  // Update map when selectedIngredient or userLocation change
  useEffect(() => {
    if (!map) return;
    
    if (selectedIngredient?.locations?.length) {
      // Create markers from ingredient locations
      const newMarkers = selectedIngredient.locations.map(location => ({
        id: location.id,
        position: { lat: location.lat, lng: location.lng },
        title: location.name
      }));
      
      setMapState(prev => ({
        ...prev,
        markers: newMarkers
      }));
      
      // Auto-fit bounds to show all markers
      fitBoundsToMarkers(map, newMarkers);
    } else if (userLocation) {
      // If no ingredient selected but user location available, center on user
      setMapState(prev => ({
        center: userLocation,
        zoom: defaultZoom,
        markers: []
      }));
      
      map.setCenter(userLocation);
      map.setZoom(defaultZoom);
    } else {
      // Fallback to default center
      setMapState(prev => ({
        center: defaultCenter,
        zoom: defaultZoom,
        markers: []
      }));
      
      map.setCenter(defaultCenter);
      map.setZoom(defaultZoom);
    }
  }, [selectedIngredient, userLocation, map, fitBoundsToMarkers]);

  const updateZoom = useCallback((newZoom: number) => {
    setMapState(prev => ({ ...prev, zoom: newZoom }));
    if (map) {
      map.setZoom(newZoom);
    }
  }, [map]);

  const zoomIn = useCallback(() => {
    updateZoom(mapState.zoom + 1);
  }, [mapState.zoom, updateZoom]);

  const zoomOut = useCallback(() => {
    if (mapState.zoom > 1) {
      updateZoom(mapState.zoom - 1);
    }
  }, [mapState.zoom, updateZoom]);

  const centerToUserLocation = useCallback((userLoc: { lat: number; lng: number }) => {
    if (map) {
      setMapState(prev => ({ ...prev, center: userLoc }));
      map.setCenter(userLoc);
      updateZoom(defaultZoom);
    }
  }, [map, updateZoom]);

  return {
    mapState,
    zoomIn,
    zoomOut,
    centerToUserLocation
  };
}
