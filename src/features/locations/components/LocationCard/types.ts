import { Location } from '@/models/Location';
import { StandardComponentProps } from '@/types/standardProps';

export interface LocationCardProps extends StandardComponentProps {
  location: Location;
  isHighlighted?: boolean;
}

export interface LocationCardImageProps {
  images: string[];
  name: string;
  onCarouselClick: (e: React.MouseEvent) => void;
}

export interface LocationCardHeaderProps {
  location: Location;
}

export interface LocationCardBodyProps {
  location: Location;
  currentHours: string | null;
  popularItems: any[];
  onAddressClick: (e: React.MouseEvent) => void;
  dietaryOptionsElements: React.ReactNode;
  highlightBadges: React.ReactNode;
}

export interface LocationCardAddressProps {
  address: string;
  locationName: string;
  onClick: (e: React.MouseEvent) => void;
}

export interface LocationCardCuisinesProps {
  cuisines?: string[];
}

export interface LocationCardPriceRangeProps {
  price: string;
  distance: string;
}

export interface LocationCardActionsProps {
  location: Location;
  onCallClick: (e: React.MouseEvent) => void;
}
