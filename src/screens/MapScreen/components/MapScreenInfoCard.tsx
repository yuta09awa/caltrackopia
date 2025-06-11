
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, XCircle, ChevronRight, Utensils, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { useMapController } from '@/features/map/hooks/useMapController';
import { useNavigate } from 'react-router-dom';

export const MapInfoCard: React.FC = () => {
  const { selectedPlace, setSelectedPlace, center } = useMapController();
  const navigate = useNavigate();

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, [setSelectedPlace]);

  const handleViewDetails = useCallback((id: string) => {
    navigate(`/locations/${id}`);
    handleCloseCard();
  }, [navigate, handleCloseCard]);

  const handleGetDirections = useCallback((lat: number, lng: number, name: string) => {
    const origin = center ? `${center.lat},${center.lng}` : '';
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${selectedPlace?.id}&travelmode=driving`;
    window.open(url, '_blank');
  }, [center, selectedPlace?.id]);

  // Calculate distance from current map center to the selected place
  const distance = useMemo(() => {
    if (center && selectedPlace?.latitude && selectedPlace?.longitude) {
      const R = 3959; // Earth's radius in miles
      const dLat = (selectedPlace.latitude - center.lat) * Math.PI / 180;
      const dLng = (selectedPlace.longitude - center.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(center.lat * Math.PI / 180) * Math.cos(selectedPlace.latitude * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance.toFixed(2);
    }
    return null;
  }, [center, selectedPlace]);

  if (!selectedPlace) {
    return null;
  }

  return (
    <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-80 shadow-2xl rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
        onClick={handleCloseCard}
      >
        <XCircle className="h-5 w-5" />
      </Button>

      {selectedPlace.photo_url && (
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img
            src={selectedPlace.photo_url}
            alt={selectedPlace.name}
            className="rounded-t-lg object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://placehold.co/400x225/e0e0e0/505050?text=No+Image`;
            }}
          />
        </AspectRatio>
      )}

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-bold truncate">{selectedPlace.name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{selectedPlace.address}</span>
        </CardDescription>
        {selectedPlace.category && (
          <Badge variant="secondary" className="mt-1 self-start">
            {selectedPlace.category === 'restaurant' ? (
              <Utensils className="h-3 w-3 mr-1" />
            ) : selectedPlace.category === 'grocery_store' ? (
              <ShoppingBag className="h-3 w-3 mr-1" />
            ) : null}
            {selectedPlace.category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-1">
        {selectedPlace.rating && (
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{selectedPlace.rating.toFixed(1)} ({selectedPlace.user_ratings_total} reviews)</span>
          </div>
        )}
        {selectedPlace.price_level && (
          <div>
            Price: {Array(selectedPlace.price_level).fill('$').join('')}
          </div>
        )}
        {selectedPlace.open_now !== undefined && (
          <div>
            Status: <span className={selectedPlace.open_now ? 'text-green-500' : 'text-red-500'}>
              {selectedPlace.open_now ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}
        {distance && (
          <div>Distance: {distance} miles</div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between p-4 pt-2">
        <Button
          variant="outline"
          onClick={() => handleGetDirections(selectedPlace.latitude, selectedPlace.longitude, selectedPlace.name)}
          className="flex-1 mr-2"
        >
          Get Directions
        </Button>
        <Button
          onClick={() => handleViewDetails(selectedPlace.id)}
          className="flex-1"
        >
          View Details <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
