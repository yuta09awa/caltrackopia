
import React from "react";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MapHeaderProps {
  selectedIngredient: Ingredient | null;
}

const MapHeader: React.FC<MapHeaderProps> = ({ selectedIngredient }) => {
  if (!selectedIngredient) return null;
  
  const locationCount = selectedIngredient.locations?.length || 0;
  
  return (
    <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-sm px-4 z-10">
      <Card className="bg-white/95 backdrop-blur-sm shadow-md">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{selectedIngredient.name}</h3>
            {locationCount > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                {locationCount} {locationCount === 1 ? 'location' : 'locations'}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {locationCount > 0
              ? `Available at ${locationCount} location${locationCount !== 1 ? 's' : ''}`
              : 'No location data available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapHeader;
