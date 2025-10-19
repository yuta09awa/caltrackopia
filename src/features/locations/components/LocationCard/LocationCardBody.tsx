import React from 'react';
import LocationCardAddress from './LocationCardAddress';
import LocationCardPopularHighlights from '../LocationCardPopularHighlights';
import { LocationCardBodyProps } from './types';
import { Clock } from 'lucide-react';

const LocationCardBody: React.FC<LocationCardBodyProps> = React.memo(({ 
  location, 
  currentHours, 
  popularItems, 
  onAddressClick,
  dietaryOptionsElements,
  highlightBadges
}) => (
  <div className="flex-1 min-w-0">
    <div className="space-y-0.5 mb-2">
      <LocationCardAddress 
        address={location.address} 
        locationName={location.name}
        onClick={onAddressClick}
      />
      
      <div className="flex items-center gap-1 text-xs">
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span
          className={`font-medium text-xs leading-tight ${location.openNow ? 'text-green-600' : 'text-red-600'}`}
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

    {popularItems.length > 0 && (
      <div className="mb-2">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">Popular:</p>
        <div className="flex flex-wrap gap-0.5">
          {popularItems.slice(0, 2).map((item, idx) => (
            <span key={idx} className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full leading-tight">
              {item.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {dietaryOptionsElements}
    {highlightBadges}
  </div>
));

LocationCardBody.displayName = 'LocationCardBody';

export default LocationCardBody;
