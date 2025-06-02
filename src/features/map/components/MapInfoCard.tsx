
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Clock, X } from 'lucide-react';
import { Location } from '@/features/locations/types';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface MapInfoCardProps {
  location: Location;
  onClose: () => void;
  onViewDetails: (locationId: string) => void;
  position: { x: number; y: number };
}

const MapInfoCard: React.FC<MapInfoCardProps> = React.memo(({ 
  location, 
  onClose, 
  onViewDetails,
  position 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [imageLoading, setImageLoading] = useState(true);

  // Memoize viewport dimensions to avoid recalculation
  const viewportDimensions = useMemo(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }), []);

  // Memoized position calculation
  const calculatePosition = useCallback((cardRect: DOMRect | null) => {
    if (!cardRect) return position;
    
    let { x, y } = position;
    const { width: viewportWidth, height: viewportHeight } = viewportDimensions;
    
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
    
    return { x, y };
  }, [position, viewportDimensions]);

  useEffect(() => {
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const newPosition = calculatePosition(cardRect);
      setAdjustedPosition(newPosition);
    }
  }, [calculatePosition]);

  // Memoized transform calculation
  const transform = useMemo(() => {
    return adjustedPosition.y === position.y + 40 
      ? 'translate(-50%, 0)' // Below marker
      : 'translate(-50%, -100%)'; // Above marker
  }, [adjustedPosition.y, position.y]);

  // Memoized button handlers
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleViewDetails = useCallback(() => {
    onViewDetails(location.id);
  }, [onViewDetails, location.id]);

  const handleCallClick = useCallback(() => {
    if (location.phone) {
      window.open(`tel:${location.phone}`, '_self');
    }
  }, [location.phone]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <div 
      ref={cardRef}
      className="absolute z-50 w-80 pointer-events-auto"
      style={{ 
        left: `${adjustedPosition.x}px`, 
        top: `${adjustedPosition.y}px`,
        transform
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
              onClick={handleClose}
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
            <div className="mb-3 relative">
              {imageLoading && (
                <LoadingSkeleton 
                  variant="info-card" 
                  className="absolute inset-0 z-10"
                />
              )}
              <img 
                src={location.images[0]} 
                alt={location.name}
                className={`w-full h-32 object-cover rounded-md transition-opacity duration-200 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleCallClick}
              disabled={!location.phone}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={handleViewDetails}
            >
              <MapPin className="w-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

MapInfoCard.displayName = 'MapInfoCard';

export default MapInfoCard;
