import React, { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { CalendarDays, LeafyGreen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Location, HighlightItem } from '@/models/Location';
import LocationCardRoot from './LocationCardRoot';
import LocationCardImage from './LocationCardImage';
import LocationCardHeader from './LocationCardHeader';
import LocationCardBody from './LocationCardBody';
import LocationCardAddress from './LocationCardAddress';
import LocationCardActions from './LocationCardActions';
import { LocationCardProps } from './types';

// Helper function for opening directions
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

// Data processing hook
const useLocationCardData = (location: Location | null | undefined) => {
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

  const customData = location.customData || {};

  const hasHighlights = useMemo(() => {
    if ('highlights' in customData && Array.isArray(customData.highlights)) {
      return customData.highlights.length > 0;
    }
    return false;
  }, [customData]);

  const highlightTypes = useMemo(() => {
    if ('highlights' in customData && Array.isArray(customData.highlights)) {
      const types = new Set(customData.highlights.map((h: HighlightItem) => h.type));
      return Array.from(types);
    }
    return [];
  }, [customData]);

  const highlightBadges = useMemo(() => {
    if (highlightTypes.length === 0) return null;
    
    return (
      <div className="flex gap-1.5 mt-1.5">
        {highlightTypes.includes("new") && (
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1 py-0">
            <CalendarDays className="w-2.5 h-2.5 mr-0.5" />
            New
          </Badge>
        )}
        {highlightTypes.includes("popular") && (
          <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 px-1 py-0">
            <Star className="w-2.5 h-2.5 mr-0.5 fill-yellow-500" />
            Popular
          </Badge>
        )}
        {highlightTypes.includes("seasonal") && (
          <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 px-1 py-0">
            <LeafyGreen className="w-2.5 h-2.5 mr-0.5" />
            Seasonal
          </Badge>
        )}
      </div>
    );
  }, [highlightTypes]);

  const dietaryOptionsElements = useMemo(() => {
    if (!location.dietaryOptions || location.dietaryOptions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-0.5 mt-1.5">
        {location.dietaryOptions.slice(0, 3).map((option, idx) => (
          <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
            {option}
          </Badge>
        ))}
        {location.dietaryOptions.length > 3 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            +{location.dietaryOptions.length - 3} more
          </Badge>
        )}
      </div>
    );
  }, [location.dietaryOptions]);

  const popularItems = useMemo(() => {
    if ('featuredItems' in customData && Array.isArray(customData.featuredItems)) {
      return customData.featuredItems.filter(item => item.imageUrl || item.image).slice(0, 2);
    }
    return [];
  }, [customData]);

  const promotions = useMemo(() => {
    if ('promotions' in customData && Array.isArray(customData.promotions)) {
      return customData.promotions.filter(promo => promo.imageUrl).slice(0, 1);
    }
    return [];
  }, [customData]);

  const currentHours = useMemo(() => {
    if (!location.hours || location.hours.length === 0) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = location.hours.find(h => h.day.toLowerCase() === today.toLowerCase());
    
    if (todayHours?.hours === "12:00 AM - 12:00 AM") {
      return "24 Hours";
    }
    
    return todayHours?.hours || null;
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

// Event handlers hook
const useLocationCardHandlers = (location: Location | null | undefined) => {
  if (!location) {
    return {
      handleCardClick: () => false,
      handleCarouselClick: () => {},
      handleCallClick: () => {},
      handleAddressClick: () => {}
    };
  }

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

  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.phone) {
      window.open(`tel:${location.phone}`, '_self');
      toast.info(`Calling ${location.name}`);
    }
  }, [location?.phone, location?.name]);

  const handleAddressClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.coordinates) {
      openDirections(location.coordinates.lat, location.coordinates.lng);
      toast.info(`Getting directions to ${location.name}`);
    }
  }, [location?.coordinates, location?.name]);

  return {
    handleCardClick,
    handleCarouselClick,
    handleCallClick,
    handleAddressClick
  };
};

// Navigation hook
const useLocationCardNavigation = (location: Location | null | undefined) => {
  if (!location) {
    return { detailLink: '#' };
  }

  const detailLink = useMemo(() => {
    if (location.type?.toLowerCase() === "grocery" &&
        location.subType && 
        ["farmers market", "food festival", "convenience store"].includes(location.subType.toLowerCase())) {
      return `/markets/${location.id}`;
    } else {
      return `/location/${location.id}`;
    }
  }, [location?.type, location?.subType, location?.id]);

  return { detailLink };
};

// Main compound component
const LocationCard: React.FC<LocationCardProps> = React.memo(({ 
  location, 
  isHighlighted = false,
  ...standardProps 
}) => {
  if (!location) {
    return null;
  }

  const {
    highlightBadges,
    dietaryOptionsElements,
    popularItems,
    currentHours
  } = useLocationCardData(location);

  const {
    handleCardClick,
    handleCarouselClick,
    handleCallClick,
    handleAddressClick
  } = useLocationCardHandlers(location);

  const { detailLink } = useLocationCardNavigation(location);

  return (
    <LocationCardRoot
      location={location}
      isHighlighted={isHighlighted}
      detailLink={detailLink}
      onCardClick={handleCardClick}
      {...standardProps}
    >
      <div className="flex gap-2.5">
        <LocationCardImage
          images={location.images}
          name={location.name}
          onCarouselClick={handleCarouselClick}
        />
        
        <div className="flex-1 min-w-0 flex flex-col">
          <LocationCardHeader location={location} />
          <LocationCardBody
            location={location}
            currentHours={currentHours}
            popularItems={popularItems}
            onAddressClick={handleAddressClick}
            dietaryOptionsElements={dietaryOptionsElements}
            highlightBadges={highlightBadges}
          />
          <LocationCardActions location={location} onCallClick={handleCallClick} />
        </div>
      </div>
    </LocationCardRoot>
  );
});

LocationCard.displayName = 'LocationCard';

// Export compound component with sub-components
export default Object.assign(LocationCard, {
  Root: LocationCardRoot,
  Image: LocationCardImage,
  Header: LocationCardHeader,
  Body: LocationCardBody,
  Address: LocationCardAddress,
  Actions: LocationCardActions
});
