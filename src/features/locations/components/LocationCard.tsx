
import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, CalendarDays, LeafyGreen, Phone, MapPin, Clock, Navigation } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Location, HighlightItem } from "@/models/Location";
import { Market } from "@/models/Location";

interface LocationCardProps {
  location: Location;
  isHighlighted?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = React.memo(({ location, isHighlighted = false }) => {
  const detailLink = useMemo(() => {
    if (location.type.toLowerCase() === "grocery" && 
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      return `/markets/${location.id}`;
    } else {
      return `/location/${location.id}`;
    }
  }, [location.type, location.subType, location.id]);

  const hasHighlights = useMemo(() => {
    if (location.customData && 'highlights' in location.customData) {
      return location.customData.highlights && location.customData.highlights.length > 0;
    }
    return false;
  }, [location.customData]);

  const highlightTypes = useMemo(() => {
    if (location.customData && 'highlights' in location.customData && location.customData.highlights) {
      const types = new Set(location.customData.highlights.map(h => h.type));
      return Array.from(types);
    }
    return [];
  }, [location.customData]);

  const highlightBadges = useMemo(() => {
    if (highlightTypes.length === 0) return null;
    
    return (
      <div className="flex gap-1.5 mt-2">
        {highlightTypes.includes("new") && (
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            <CalendarDays className="w-3 h-3 mr-1" />
            New
          </Badge>
        )}
        {highlightTypes.includes("popular") && (
          <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
            <Star className="w-3 h-3 mr-1 fill-yellow-500" />
            Popular
          </Badge>
        )}
        {highlightTypes.includes("seasonal") && (
          <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
            <LeafyGreen className="w-3 h-3 mr-1" />
            Seasonal
          </Badge>
        )}
      </div>
    );
  }, [highlightTypes]);

  const dietaryOptionsElements = useMemo(() => {
    if (!location.dietaryOptions || location.dietaryOptions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {location.dietaryOptions.slice(0, 3).map((option, idx) => (
          <Badge key={idx} variant="outline" className="text-xs">
            {option}
          </Badge>
        ))}
        {location.dietaryOptions.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{location.dietaryOptions.length - 3} more
          </Badge>
        )}
      </div>
    );
  }, [location.dietaryOptions]);

  const popularItems = useMemo(() => {
    if (location.customData && 'featuredItems' in location.customData && location.customData.featuredItems) {
      return location.customData.featuredItems.slice(0, 2);
    }
    return [];
  }, [location.customData]);

  const currentHours = useMemo(() => {
    if (!location.hours || location.hours.length === 0) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = location.hours.find(h => h.day.toLowerCase() === today.toLowerCase());
    
    return todayHours?.hours || null;
  }, [location.hours]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, []);

  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.phone) {
      window.open(`tel:${location.phone}`, '_self');
    }
  }, [location.phone]);

  const handleDirectionsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    }
  }, [location.coordinates]);

  return (
    <div className={`hover:bg-muted/20 transition-colors cursor-pointer relative ${
      isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''
    }`}>
      {/* Hazy overlay for closed locations */}
      {!location.openNow && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-10" />
      )}
      
      <Link 
        key={location.id}
        to={detailLink}
        className="block p-4"
        onClick={handleCardClick}
      >
        <div className="flex gap-4">
          {/* Image Carousel */}
          <div className="w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 relative overflow-hidden flex-shrink-0 rounded-lg">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {location.images.map((image, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="h-full w-full overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${location.name} image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious 
                className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-30" 
                onClick={handleCarouselClick}
              />
              <CarouselNext 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-30" 
                onClick={handleCarouselClick}
              />
            </Carousel>
          </div>
          
          {/* Location Details */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-base sm:text-lg truncate pr-2">{location.name}</h4>
                <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="default" className="text-xs">
                    {location.type}
                  </Badge>
                  {location.subType && (
                    <Badge variant="outline" className="text-xs">
                      {location.subType}
                    </Badge>
                  )}
                  <span className="text-xs">{location.price}</span>
                  <span className="text-xs">{location.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-sm">{location.rating}</span>
              </div>
            </div>

            {/* Address and Hours */}
            <div className="space-y-1 mb-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="truncate">{location.address}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className={`font-medium ${location.openNow ? 'text-green-600' : 'text-red-600'}`}>
                  {location.openNow ? 'Open' : 'Closed'}
                </span>
                {currentHours && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-xs">{currentHours}</span>
                  </>
                )}
              </div>
            </div>

            {/* Popular Items */}
            {popularItems.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Popular:</p>
                <div className="flex flex-wrap gap-1">
                  {popularItems.map((item, idx) => (
                    <span key={idx} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Options */}
            {dietaryOptionsElements}

            {/* Highlight Badges */}
            {highlightBadges}

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              {location.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={handleCallClick}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={handleDirectionsClick}
              >
                <Navigation className="w-3 h-3 mr-1" />
                Directions
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

LocationCard.displayName = 'LocationCard';

export default LocationCard;
