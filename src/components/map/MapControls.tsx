
import React from "react";
import { Plus, Minus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  locationLoading: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  locationLoading
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
      <Button 
        variant="ghost"
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200 rounded-none"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost"
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200 rounded-none"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost"
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-none"
        onClick={onRecenter}
        disabled={locationLoading}
        aria-label="Center map to your location"
      >
        <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse text-gray-400' : ''}`} />
      </Button>
    </div>
  );
};

export default MapControls;
