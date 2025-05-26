
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Settings } from 'lucide-react';
import { useLocationSpoof } from '@/features/locations/hooks/useLocationSpoof';

const LocationSpoofPanel: React.FC = () => {
  const { 
    activeSpoof, 
    availableSpoofs, 
    enableSpoof, 
    disableSpoof, 
    spoofRegionName,
    getFilteredLocations 
  } = useLocationSpoof();

  const filteredCount = getFilteredLocations().length;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          Location Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Test Region
          </label>
          <Select 
            value={activeSpoof || ''} 
            onValueChange={(value) => value ? enableSpoof(value as any) : disableSpoof()}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select region to test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No spoofing (use real location)</SelectItem>
              {availableSpoofs.map((spoofKey) => (
                <SelectItem key={spoofKey} value={spoofKey}>
                  {spoofKey.charAt(0).toUpperCase() + spoofKey.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeSpoof && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium">{spoofRegionName}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredCount} locations available
            </Badge>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {activeSpoof 
            ? "Using mock location data for testing" 
            : "Using real device location"
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSpoofPanel;
