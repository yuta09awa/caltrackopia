
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Location {
  id: string;
  name: string;
  address: string;
  distance?: number;
  price?: string;
  lat: number;
  lng: number;
}

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/location/${location.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{location.address}</span>
              </div>
              {location.distance !== undefined && (
                <div className="text-sm text-muted-foreground mt-1">
                  {location.distance} miles away
                </div>
              )}
            </div>
            {location.price && (
              <div className="text-sm font-medium">
                {location.price}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
