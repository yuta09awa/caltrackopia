
import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, CalendarDays, LeafyGreen, Phone, MapPin, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Location, HighlightItem, MenuItem as LocationMenuItem, FeaturedItem as LocationFeaturedItem, Promotion } from "@/models/Location";
import { toast } from "sonner";
import LocationCardPopularHighlights from './LocationCardPopularHighlights';

interface LocationCardProps {
  location: Location;
  isHighlighted?: boolean;
}

// Helper function for opening directions, inlined to resolve import issues.
const openDirections = (lat: number, lng: number) => {
  const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  let url = '';
  if (isApple) {
    url = `maps://maps.apple.com/?daddr=${lat},${lng}`;
  } else if (isAndroid) {
    url = `geo:${lat},${lng}?q=${lat},${lng}`;
  } else {
    // Fallback for desktop or other devices
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  window.open(url, '_blank');
};

// -----------------------------------------------------------------------------
// Custom Hooks for Data, Handlers, and Navigation
// -----------------------------------------------------------------------------

/**
 * Hook to compute memoized data for the LocationCard.
 * It extracts and formats various pieces of information from the location object
 * that are used in different parts of the card, improving readability and reusability.
 * @param {Location} location - The location object to process.
 */
const useLocationCardData = (location: Location | null | undefined) => {
  // Add an early return if location prop itself is null or undefined
  if (!location) {
    return {
      hasHighlights: false,
      highlightTypes: [],
      highlightBadges: null,
      dietaryOptionsElements: null,
      popularItems: [],
      promotions: [],
      currentHours: null
    };
  }

  // Ensure customData is safely accessed. Default to an empty object if undefined/null.
  const customData = location.customData || {};

  // Determine if the location has any highlights to display.
  const hasHighlights = useMemo(() => {
    // Safely check if highlights exists and has length
    if ('highlights' in customData && Array.isArray(customData.highlights)) {
      return customData.highlights.length > 0;
    }
    return false;
  }, [customData]);

  // Extract unique highlight types (e.g., "new", "popular", "seasonal").
  const highlightTypes = useMemo(() => {
    // Safely access highlights; default to empty array if not present.
    if ('highlights' in customData && Array.isArray(customData.highlights)) {
      const types = new Set(customData.highlights.map((h: HighlightItem) => h.type));
      return Array.from(types);
    }
    return [];
  }, [customData]);

  // Generate JSX for highlight badges based on detected types.
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

  // Generate JSX for dietary options badges.
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

  // Extract popular items from custom data, limited to the first two.
  const popularItems = useMemo(() => {
    // Safely access featuredItems; default to empty array if not present.
    if ('featuredItems' in customData && Array.isArray(customData.featuredItems)) {
      // Ensure we only take items with images if we want to display them visually
      return customData.featuredItems.filter(item => item.imageUrl || item.image).slice(0, 2);
    }
    return [];
  }, [customData]);

  // NEW: Extract promotions from customData
  const promotions = useMemo(() => {
    if ('promotions' in customData && Array.isArray(customData.promotions)) {
      return customData.promotions.filter(promo => promo.imageUrl).slice(0, 1); // Maybe just one prominent promotion
    }
    return [];
  }, [customData]);

  // Determine and format the current opening hours for the location, including "24 Hours"
  const currentHours = useMemo(() => {
    console.log(`[LocationCard] Processing hours for ${location.name}:`, location.hours);
    
    if (!location.hours || location.hours.length === 0) {
      console.log(`[LocationCard] No hours data available for ${location.name}`);
      return null;
    }
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    console.log(`[LocationCard] Today is: ${today}`);
    
    const todayHours = location.hours.find(h => h.day.toLowerCase() === today.toLowerCase());
    console.log(`[LocationCard] Found today's hours for ${location.name}:`, todayHours);
    
    // Check for "24 hours" pattern
    if (todayHours?.hours === "12:00 AM - 12:00 AM") {
      console.log(`[LocationCard] ${location.name} is open 24 hours`);
      return "24 Hours";
    }
    
    const result = todayHours?.hours || null;
    console.log(`[LocationCard] Final hours result for ${location.name}:`, result);
    return result;
  }, [location.hours, location.name]);

  return {
    hasHighlights,
    highlightTypes,
    highlightBadges,
    dietaryOptionsElements,
    popularItems,
    promotions,
    currentHours
  };
};

/**
 * Hook to manage click handlers for the LocationCard.
 * Encapsulates event handling logic for various interactive elements.
 * @param {Location} location - The location object relevant to the handlers.
 */
const useLocationCardHandlers = (location: Location | null | undefined) => { // Accept null/undefined location
  // Add an early return if location prop itself is null or undefined
  if (!location) {
    return {
      handleCardClick: () => false, // Return dummy handlers
      handleCarouselClick: () => {},
      handleCallClick: () => {},
      handleAddressClick: () => {}
    };
  }

  // Prevents the main card link from navigating if an internal button or specific link is clicked.
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    const link = target.closest('a');
    
    // Check if the clicked element is a button OR if it's a link whose href is NOT the detail page
    // Access location.id safely
    if (button || (link && location.id && (link.getAttribute('href') !== `/location/${location.id}` && link.getAttribute('href') !== `/markets/${location.id}`))) {
      e.preventDefault();
      e.stopPropagation();
      return false; // Prevent default link behavior
    }
  }, [location?.id]); // Safely access id in dependency array

  // Prevents carousel navigation from bubbling up and triggering card click.
  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handles click on the "Call" button.
  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.phone) {
      window.open(`tel:${location.phone}`, '_self');
      toast.info(`Calling ${location.name}`);
    }
  }, [location?.phone, location?.name]); // Safely access phone and name in dependency array

  // Handles click on the address to open directions.
  const handleAddressClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.coordinates) {
      openDirections(location.coordinates.lat, location.coordinates.lng);
      toast.info(`Getting directions to ${location.name}`);
    }
  }, [location?.coordinates, location?.name]); // Safely access coordinates and name in dependency array

  return {
    handleCardClick,
    handleCarouselClick,
    handleCallClick,
    handleAddressClick
  };
};

/**
 * Hook to determine the navigation path for the LocationCard.
 * Centralizes the logic for generating dynamic detail page links.
 * @param {Location} location - The location object to generate a link for.
 */
const useLocationCardNavigation = (location: Location | null | undefined) => { // Accept null/undefined location
  // Add an early return if location prop itself is null or undefined
  if (!location) {
    return {
      detailLink: '#' // Return a safe fallback link
    };
  }

  const detailLink = useMemo(() => {
    if (location.type?.toLowerCase() === "grocery" && // Safely access type
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      return `/markets/${location.id}`;
    } else {
      return `/location/${location.id}`;
    }
  }, [location?.type, location?.subType, location?.id]); // Safely access properties in dependency array

  return { detailLink };
};

// -----------------------------------------------------------------------------
// Sub-Components for LocationCard UI
// -----------------------------------------------------------------------------

interface LocationCardHeaderProps {
  location: Location;
}

/**
 * Renders the header section of the location card, including title, rating, and basic badges.
 * The title and rating are intentionally grouped without flex-1 or flex-shrink-0
 * to ensure they remain left-aligned together, as per the refactor plan.
 */
const LocationCardHeader: React.FC<LocationCardHeaderProps> = React.memo(({ location }) => (
  <div className="flex flex-col mb-2">
    {/* Title and Rating aligned together on the left */}
    {/* Removed flex-1 from h4 and flex-shrink-0 from rating div to ensure left-alignment */}
    <div className="flex items-center gap-2 mb-1">
      <h4 className="font-semibold text-base sm:text-lg truncate">{location.name}</h4>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-medium text-sm">{location.rating}</span>
      </div>
    </div>
    
    {/* Badges and meta info - Left aligned */}
    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
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
));

LocationCardHeader.displayName = 'LocationCardHeader';

interface LocationCardImageProps {
  images: string[];
  name: string;
  handleCarouselClick: (e: React.MouseEvent) => void;
}

/**
 * Renders the image carousel for the location card.
 */
const LocationCardImage: React.FC<LocationCardImageProps> = React.memo(({ images, name, handleCarouselClick }) => (
  <div className="w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 relative overflow-hidden flex-shrink-0 rounded-lg">
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="h-full w-full overflow-hidden">
              <img 
                src={image} 
                alt={`${name} image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Carousel navigation buttons, click handlers prevent propagation */}
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
));

LocationCardImage.displayName = 'LocationCardImage';

interface LocationCardDetailsProps {
  location: Location;
  currentHours: string | null;
  popularItems: (LocationMenuItem | LocationFeaturedItem)[];
  handleAddressClick: (e: React.MouseEvent) => void;
  dietaryOptionsElements: React.ReactNode;
  highlightBadges: React.ReactNode;
}

/**
 * Renders the detailed information section of the location card,
 * including address (clickable for directions), hours, popular items,
 * dietary options, and highlight badges.
 */
const LocationCardDetails: React.FC<LocationCardDetailsProps> = React.memo(({ 
  location, 
  currentHours, 
  popularItems, 
  handleAddressClick,
  dietaryOptionsElements,
  highlightBadges
}) => (
  <div className="flex-1 min-w-0">
    {/* Address and Hours */}
    <div className="space-y-1 mb-3">
      {/* Address is now the primary clickable element for directions */}
      <button
        onClick={handleAddressClick}
        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
        aria-label={`Get directions to ${location.address}`}
      >
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span className="truncate">{location.address}</span>
      </button>
      
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 flex-shrink-0" />
        <span
          className={`font-medium text-sm ${location.openNow ? 'text-green-600' : 'text-red-600'}`}
          role="status"
          aria-label={
            location.openNow
              ? `Open today ${currentHours ? `from ${currentHours}` : ''}`.trim()
              : 'Closed today'
          }
        >
          {currentHours || (location.openNow ? 'Open' : 'Closed Today')}
        </span>
      </div>
    </div>

    {/* Popular Items - Now only shows text-based items */}
    {popularItems.length > 0 && (
      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">Popular:</p>
        <div className="flex flex-wrap gap-1">
          {popularItems.slice(0, 2).map((item, idx) => (
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
  </div>
));

LocationCardDetails.displayName = 'LocationCardDetails';

interface LocationCardActionsProps {
  location: Location;
  handleCallClick: (e: React.MouseEvent) => void;
}

/**
 * Renders action buttons for the location card.
 * As per feedback, the "Directions" button is removed, and directions
 * are handled by clicking the address.
 */
const LocationCardActions: React.FC<LocationCardActionsProps> = React.memo(({ location, handleCallClick }) => (
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
    {/* The directions button is intentionally removed as the address click now handles it. */}
  </div>
));

LocationCardActions.displayName = 'LocationCardActions';

// -----------------------------------------------------------------------------
// Main LocationCard Component
// -----------------------------------------------------------------------------

/**
 * The main LocationCard component, now refactored into smaller,
 * more manageable sub-components and custom hooks.
 * It combines all the pieces to render a complete location card.
 */
const LocationCard: React.FC<LocationCardProps> = React.memo(({ location, isHighlighted = false }) => {
  // If location itself is null or undefined, render nothing or a loading state
  // This check is crucial and happens before any hooks are called with 'location'
  if (!location) {
    return null; // Or a skeleton loader if preferred
  }

  // Use custom hooks for data, handlers, and navigation logic
  // Pass potentially null/undefined location to the hooks
  const locationData = useLocationCardData(location);
  const locationHandlers = useLocationCardHandlers(location);
  const locationNavigation = useLocationCardNavigation(location);

  // Destructure values from the hooks
  const { highlightBadges, dietaryOptionsElements, popularItems, promotions, currentHours } = locationData;
  const { handleCardClick, handleCarouselClick, handleCallClick, handleAddressClick } = locationHandlers;
  const { detailLink } = locationNavigation;

  return (
    <div className={`hover:bg-muted/20 transition-colors cursor-pointer relative ${
      isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''
    }`}>
      {/* Hazy overlay for closed locations */}
      {!location.openNow && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-10" />
      )}
      
      {/* Main clickable area of the card, navigates to detail page */}
      <Link 
        key={location.id}
        to={detailLink}
        className="block p-4"
        onClick={handleCardClick}
      >
        {/* Changed from flex to grid for a 3-column layout */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4">
          {/* Left Column: Image Carousel Sub-component */}
          <LocationCardImage 
            images={location.images} 
            name={location.name} 
            handleCarouselClick={handleCarouselClick} 
          />
          
          {/* Middle Column: Details Section Sub-component */}
          <div className="flex-1 min-w-0">
            <LocationCardHeader location={location} />
            
            <LocationCardDetails 
              location={location}
              currentHours={currentHours}
              popularItems={popularItems}
              handleAddressClick={handleAddressClick}
              dietaryOptionsElements={dietaryOptionsElements}
              highlightBadges={highlightBadges}
            />

            <LocationCardActions 
              location={location} 
              handleCallClick={handleCallClick}
            />
          </div>

          {/* Right Column: NEW Popular Items/Promotions Sub-component */}
          <LocationCardPopularHighlights
            popularItems={popularItems}
            promotions={promotions}
          />
        </div>
      </Link>
    </div>
  );
});

LocationCard.displayName = 'LocationCard';

export default LocationCard;
