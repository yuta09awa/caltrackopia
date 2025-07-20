
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Location } from "@/models/Location";
import { toast } from "sonner";

interface MobileLocationCardProps {
  location: Location;
  isHighlighted?: boolean;
}

const openDirections = (lat: number, lng: number) => {
  const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  let url = '';
  if (isApple) {
    url = `maps://maps.apple.com/?daddr=${lat},${lng}`;
  } else if (isAndroid) {
    url = `geo:${lat},${lng}?q=${lat},${lng}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  window.open(url, '_blank');
};

const MobileLocationCard: React.FC<MobileLocationCardProps> = ({ location, isHighlighted = false }) => {
  if (!location) return null;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    const link = target.closest('a');
    
    if (button || (link && location.id && (link.getAttribute('href') !== `/location/${location.id}` && link.getAttribute('href') !== `/markets/${location.id}`))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, [location?.id]);

  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.phone) {
      window.open(`tel:${location.phone}`, '_self');
      toast.info(`Calling ${location.name}`);
    }
  }, [location?.phone, location?.name]);

  const handleDirectionsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.coordinates) {
      openDirections(location.coordinates.lat, location.coordinates.lng);
      toast.info(`Getting directions to ${location.name}`);
    }
  }, [location?.coordinates, location?.name]);

  const detailLink = location.type?.toLowerCase() === "grocery" && 
    location.subType && 
    ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())
    ? `/markets/${location.id}`
    : `/location/${location.id}`;

  const currentHours = React.useMemo(() => {
    if (!location.hours || location.hours.length === 0) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = location.hours.find(h => h.day.toLowerCase() === today.toLowerCase());
    
    if (todayHours?.hours === "12:00 AM - 12:00 AM") {
      return "24 Hours";
    }
    
    return todayHours?.hours || null;
  }, [location.hours]);

  return (
    <div className={`hover:bg-muted/20 transition-colors cursor-pointer relative ${
      isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''
    }`}>
      {!location.openNow && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-10" />
      )}
      
      <Link 
        to={detailLink}
        className="block p-4"
        onClick={handleCardClick}
      >
        {/* Mobile-optimized layout: Single column with image on top */}
        <div className="space-y-3">
          {/* Image - Single image, no carousel on mobile */}
          {location.images && location.images.length > 0 && (
            <div className="w-full h-32 relative overflow-hidden rounded-lg">
              <img 
                src={location.images[0]} 
                alt={location.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Header - Name and Rating */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-lg leading-tight flex-1">{location.name}</h4>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-sm">{location.rating}</span>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex items-center flex-wrap gap-2">
              <Badge variant="default" className="text-xs">
                {location.type}
              </Badge>
              {location.subType && (
                <Badge variant="outline" className="text-xs">
                  {location.subType}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{location.price}</span>
              <span className="text-xs text-muted-foreground">{location.distance}</span>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{location.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className={`font-medium ${location.openNow ? 'text-green-600' : 'text-red-600'}`}>
                {currentHours || (location.openNow ? 'Open' : 'Closed Today')}
              </span>
            </div>
          </div>

          {/* Action Buttons - Larger touch targets for mobile */}
          <div className="flex gap-3 pt-2">
            {location.phone && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 text-sm flex-1 min-h-[44px]"
                onClick={handleCallClick}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 text-sm flex-1 min-h-[44px]"
              onClick={handleDirectionsClick}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileLocationCard;
