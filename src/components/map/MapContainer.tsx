
import React from "react";
import MapView from "./MapView";
import { Ingredient } from "@/hooks/useIngredientSearch";

interface MapContainerProps {
  height: string;
  selectedIngredient: Ingredient | null;
}

const MapContainer: React.FC<MapContainerProps> = ({ height, selectedIngredient }) => {
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
