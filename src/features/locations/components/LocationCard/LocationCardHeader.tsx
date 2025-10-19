import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LocationCardHeaderProps } from './types';

const LocationCardHeader: React.FC<LocationCardHeaderProps> = React.memo(({ location }) => (
  <div className="flex flex-col mb-1">
    <div className="flex items-center gap-1 mb-1">
      <h4 className="font-medium text-sm leading-tight truncate">{location.name}</h4>
      <div className="flex items-center gap-0.5">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="font-medium text-xs">{location.rating}</span>
      </div>
    </div>
    
    <div className="flex items-center flex-wrap gap-1 text-xs text-muted-foreground">
      <Badge variant="default" className="text-xs px-1.5 py-0">
        {location.type}
      </Badge>
      {location.subType && (
        <Badge variant="outline" className="text-xs px-1.5 py-0">
          {location.subType}
        </Badge>
      )}
      <span className="text-xs">{location.price}</span>
      <span className="text-xs">{location.distance}</span>
    </div>
  </div>
));

LocationCardHeader.displayName = 'LocationCardHeader';

export default LocationCardHeader;
