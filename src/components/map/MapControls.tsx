
import React from "react";
import { Plus, Minus, MapPin } from "lucide-react";

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
      <button 
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200"
        onClick={onZoomIn}
      >
        <Plus className="w-5 h-5" />
      </button>
      <button 
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200"
        onClick={onZoomOut}
      >
        <Minus className="w-5 h-5" />
      </button>
      <button 
        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
        onClick={onRecenter}
        disabled={locationLoading}
      >
        <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse text-gray-400' : ''}`} />
      </button>
    </div>
  );
};

export default MapControls;
