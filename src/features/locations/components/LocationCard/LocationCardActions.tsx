import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCardActionsProps } from './types';

const LocationCardActions: React.FC<LocationCardActionsProps> = React.memo(({ 
  location, 
  onCallClick 
}) => (
  <div className="flex gap-1 mt-2">
    {location.phone && (
      <Button
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={onCallClick}
      >
        <Phone className="w-3 h-3 mr-0.5" />
        Call
      </Button>
    )}
  </div>
));

LocationCardActions.displayName = 'LocationCardActions';

export default LocationCardActions;
