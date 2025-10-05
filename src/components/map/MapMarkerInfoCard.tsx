
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Navigation } from 'lucide-react';
import { Location } from '@/models/Location';

interface MapMarkerInfoCardProps {
  location: Location;
  onViewDetails: () => void;
  onClose: () => void;
}

const MapMarkerInfoCard: React.FC<MapMarkerInfoCardProps> = ({
  location,
  onViewDetails,
  onClose
}) => {
  return (
    <Card className="absolute z-20 bg-white shadow-lg border min-w-[280px] max-w-[320px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium truncate pr-2">
            {location.name}
          </CardTitle>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {location.type}
            </span>
            <span>•</span>
            <span>{location.price}</span>
            <span>•</span>
            <span>{location.distance}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{location.rating}</span>
          </div>
          
          {location.dietaryOptions && location.dietaryOptions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {location.dietaryOptions.slice(0, 3).map((option, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {option}
                </span>
              ))}
              {location.dietaryOptions.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{location.dietaryOptions.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <Button 
            onClick={onViewDetails}
            size="sm" 
            className="w-full mt-3"
          >
            <Navigation className="w-3 h-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapMarkerInfoCard;
