import React from 'react';
import { MapPin } from 'lucide-react';
import { LocationCardAddressProps } from './types';

const LocationCardAddress: React.FC<LocationCardAddressProps> = React.memo(({ 
  address, 
  locationName, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className="flex items-start gap-1 text-xs text-muted-foreground hover:text-primary transition-colors text-left w-full"
    aria-label={`Get directions to ${locationName}`}
  >
    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
    <span className="truncate leading-tight">{address}</span>
  </button>
));

LocationCardAddress.displayName = 'LocationCardAddress';

export default LocationCardAddress;
