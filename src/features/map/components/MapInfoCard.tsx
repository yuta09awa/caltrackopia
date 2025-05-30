
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Clock, X } from 'lucide-react';
import { Location } from '@/features/locations/types';

interface MapInfoCardProps {
  location: Location;
  onClose: () => void;
  onViewDetails: (locationId: string) => void;
  position: { x: number; y: number };
}

const MapInfoCard: React.FC<MapInfoCardProps> = ({ 
  location, 
  onClose, 
  onViewDetails,
  position 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      const cardRect = card.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let { x, y } = position;
      
      // Adjust horizontal position if card would exceed right edge
      if (x + cardRect.width / 2 > viewportWidth - 20) {
        x = viewportWidth - cardRect.width / 2 - 20;
      }
      
      // Adjust horizontal position if card would exceed left edge
      if (x - cardRect.width / 2 < 20) {
        x = cardRect.width / 2 + 20;
      }
      
      // Adjust vertical position if card would exceed top edge
      if (y - cardRect.height - 20 < 20) {
        // Position below the marker instead of above
        y = y + 40;
      }
      
      // Adjust vertical position if card would exceed bottom edge
      if (y > viewportHeight - 20) {
        y = viewportHeight - 20;
      }
      
      setAdjustedPosition({ x, y });
    }
  }, [position]);

  return (
    <div 
      ref={cardRef}
      className="absolute z-50 w-80 pointer-events-auto"
      style={{ 
        left: `${adjustedPosition.x}px`, 
        top: `${adjustedPosition.y}px`,
        transform: adjustedPosition.y === position.y + 40 
          ? 'translate(-50%, 0)' // Below marker
          : 'translate(-50%, -100%)' // Above marker
      }}
    >
      <Card className="shadow-lg border-2 border-primary/20 bg-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{location.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  {location.type}
                </span>
                <span>•</span>
                <span>{location.distance}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{location.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm">{location.price}</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{location.openNow ? 'Open' : 'Closed'}</span>
            </div>
          </div>

          {location.images && location.images.length > 0 && (
            <div className="mb-3">
              <img 
                src={location.images[0]} 
                alt={location.name}
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`tel:${location.phone}`, '_self')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails(location.id)}
            >
              <MapPin className="w-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapInfoCard;
