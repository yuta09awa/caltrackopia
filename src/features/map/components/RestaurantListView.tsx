import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink,
  DollarSign,
  Heart,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  priceLevel: number;
  distance: string;
  address: string;
  isOpen: boolean;
  openUntil?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  specialties: string[];
  features: string[];
}

interface RestaurantListViewProps {
  restaurants: Restaurant[];
  onRestaurantSelect: (restaurantId: string) => void;
  selectedRestaurantId?: string;
  className?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Verde Farm Kitchen',
    cuisine: ['Farm-to-Table', 'American'],
    rating: 4.6,
    priceLevel: 3,
    distance: '0.3 mi',
    address: '123 Green Street, Downtown',
    isOpen: true,
    openUntil: '10:00 PM',
    phone: '(555) 123-4567',
    website: 'verdekitchen.com',
    imageUrl: '/api/placeholder/300/200',
    specialties: ['Organic Salads', 'Grass-Fed Beef', 'Local Vegetables'],
    features: ['Outdoor Seating', 'Vegan Options', 'Gluten-Free']
  },
  {
    id: '2',
    name: 'Harvest Moon Bistro',
    cuisine: ['Mediterranean', 'Organic'],
    rating: 4.8,
    priceLevel: 4,
    distance: '0.7 mi',
    address: '456 Market Avenue, Arts District',
    isOpen: true,
    openUntil: '11:00 PM',
    phone: '(555) 987-6543',
    specialties: ['Wild-Caught Fish', 'Heirloom Tomatoes', 'Fresh Herbs'],
    features: ['Wine Bar', 'Private Dining', 'Local Sourcing']
  },
  {
    id: '3',
    name: 'Green Bowl Co.',
    cuisine: ['Healthy', 'Bowls'],
    rating: 4.4,
    priceLevel: 2,
    distance: '1.2 mi',
    address: '789 Wellness Way, Health District',
    isOpen: false,
    phone: '(555) 456-7890',
    specialties: ['Quinoa Bowls', 'Smoothie Bowls', 'Protein Bowls'],
    features: ['Takeout', 'Delivery', 'Quick Service']
  }
];

const RestaurantListView: React.FC<RestaurantListViewProps> = ({
  restaurants = mockRestaurants,
  onRestaurantSelect,
  selectedRestaurantId,
  className
}) => {
  const getPriceSymbols = (level: number): string => {
    return '$'.repeat(level);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-green-500';
    if (rating >= 3.5) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nearby Restaurants</h3>
        <Badge variant="outline" className="text-xs">
          {restaurants.length} places
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {restaurants.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedRestaurantId === restaurant.id && "ring-2 ring-primary"
            )}
            onClick={() => onRestaurantSelect(restaurant.id)}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Restaurant Image */}
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Utensils className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* Restaurant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm truncate pr-2">{restaurant.name}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Cuisine & Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {restaurant.cuisine.slice(0, 2).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs px-1 py-0">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium">
                      {getPriceSymbols(restaurant.priceLevel)}
                    </span>
                  </div>

                  {/* Rating & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className={cn("h-3 w-3 fill-current", getRatingColor(restaurant.rating))} />
                      <span className="text-xs font-medium">{restaurant.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{restaurant.distance}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className={cn(
                        "text-xs",
                        restaurant.isOpen ? "text-green-600" : "text-red-600"
                      )}>
                        {restaurant.isOpen 
                          ? `Open${restaurant.openUntil ? ` until ${restaurant.openUntil}` : ''}`
                          : 'Closed'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {restaurant.specialties.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">
                        Known for: {restaurant.specialties.slice(0, 2).join(', ')}
                        {restaurant.specialties.length > 2 && ` +${restaurant.specialties.length - 2} more`}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex gap-1 flex-wrap">
                    {restaurant.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs px-1 py-0">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                {restaurant.phone && (
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Directions
                </Button>

                {restaurant.website && (
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Menu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantListView;