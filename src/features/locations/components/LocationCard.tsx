import React from "react";
import { Link } from "react-router-dom";
import { Star, CalendarDays, LeafyGreen } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Location, HighlightItem } from "@/models/Location";
import { Market } from "@/models/Location";

interface LocationCardProps {
  location: Location;
  isHighlighted?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isHighlighted = false }) => {
  // Determine the correct route based on location type and subType
  const getDetailLink = () => {
    // Only route to markets page for specific grocery subtypes that have market-specific features
    if (location.type.toLowerCase() === "grocery" && 
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      return `/markets/${location.id}`;
    } else {
      // All restaurants and other location types go to location detail page
      return `/location/${location.id}`;
    }
  };

  // Check if this location has highlights (for markets)
  const hasHighlights = () => {
    if (location.customData && 'highlights' in location.customData) {
      return location.customData.highlights && location.customData.highlights.length > 0;
    }
    return false;
  };

  // Get highlight types present in this market
  const getHighlightTypes = () => {
    if (location.customData && 'highlights' in location.customData && location.customData.highlights) {
      const types = new Set(location.customData.highlights.map(h => h.type));
      return Array.from(types);
    }
    return [];
  };

  // Show badge for each highlight type
  const renderHighlightBadges = () => {
    const types = getHighlightTypes();
    
    return (
      <div className="flex gap-1.5 mt-1">
        {types.includes("new") && (
          <div className="flex items-center gap-0.5 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px]">
            <CalendarDays className="w-2.5 h-2.5" />
            <span>New</span>
          </div>
        )}
        {types.includes("popular") && (
          <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full text-[10px]">
            <Star className="w-2.5 h-2.5 fill-yellow-500" />
            <span>Popular</span>
          </div>
        )}
        {types.includes("seasonal") && (
          <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
            <LeafyGreen className="w-2.5 h-2.5" />
            <span>Seasonal</span>
          </div>
        )}
      </div>
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on carousel controls or buttons
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  return (
    <div 
      className={`block border-b border-border hover:bg-muted/20 transition-colors cursor-pointer relative py-1.5 ${
        isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''
      }`}
    >
      {/* Hazy overlay for closed locations - reduced opacity */}
      {!location.openNow && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-10" />
      )}
      
      <Link 
        key={location.id}
        to={getDetailLink()}
        className="flex"
        onClick={handleCardClick}
      >
        {/* Image Carousel with floating controls - maximized with less spacing */}
        <div className="w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 relative overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {location.images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="h-full w-full overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${location.name} image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Floating overlay navigation buttons with higher z-index and event prevention */}
            <CarouselPrevious 
              className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-30" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
            <CarouselNext 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-30" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </Carousel>
        </div>
        
        {/* Location Details */}
        <div className="flex-1 min-w-0 p-3 pl-3 sm:p-4 sm:pl-4">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h4 className="font-medium text-sm sm:text-base truncate pr-2">{location.name}</h4>
              <div className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap">
                  {location.type}
                </span>
                {location.subType && (
                  <>
                    <span>•</span>
                    <span className="text-xs">{location.subType}</span>
                  </>
                )}
                <span>•</span>
                <span>{location.price}</span>
                <span>•</span>
                <span>{location.distance}</span>
              </div>
              
              {/* Show highlight badges if any */}
              {hasHighlights() && renderHighlightBadges()}
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 ml-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-xs sm:text-sm">{location.rating}</span>
            </div>
          </div>
          
          {/* Show dietary options */}
          <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-1">
            {location.dietaryOptions && location.dietaryOptions.map((option, idx) => (
              <span key={idx} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                {option}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LocationCard;
