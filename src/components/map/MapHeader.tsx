
import React from "react";
import { Ingredient } from "@/hooks/useIngredientSearch";

interface MapHeaderProps {
  selectedIngredient: Ingredient | null;
}

const MapHeader: React.FC<MapHeaderProps> = ({ selectedIngredient }) => {
  if (!selectedIngredient) return null;
  
  return (
    <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-sm px-4 z-10">
      <div className="bg-white rounded-md shadow-md p-3">
        <h3 className="font-medium">{selectedIngredient.name}</h3>
        <p className="text-xs text-muted-foreground">
          {selectedIngredient.locations ? 
            `Available at ${selectedIngredient.locations.length} location${selectedIngredient.locations.length !== 1 ? 's' : ''}` : 
            'No location data available'}
        </p>
      </div>
    </div>
  );
};

export default MapHeader;
