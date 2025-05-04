
import React, { useEffect } from "react";
import MapView from "./MapView";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { useAppStore } from "@/store/appStore";

interface MapContainerProps {
  height: string;
  selectedIngredient: Ingredient | null;
}

const MapContainer: React.FC<MapContainerProps> = ({ height, selectedIngredient }) => {
  const { mapFilters } = useAppStore();
  
  // Log active filters whenever they change (useful for debugging)
  useEffect(() => {
    const activeFilters = Object.entries(mapFilters)
      .filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (value === null) return false;
        return value !== 'all';
      })
      .map(([key]) => key);
      
    if (activeFilters.length > 0) {
      console.log('Active map filters:', activeFilters);
    }
  }, [mapFilters]);

  return (
    <div 
      className="relative w-full transition-all duration-300 ease-out"
      style={{ height }}
    >
      <MapView selectedIngredient={selectedIngredient} />
    </div>
  );
};

export default MapContainer;
