
import React from 'react';
import { Location, RestaurantCustomData, MenuItem } from '@/models/Location';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Star, Truck, Award, Leaf } from 'lucide-react';

interface RestaurantDetailsProps {
  location: Location;
}

// Type guard to check if customData is RestaurantCustomData
function isRestaurantCustomData(customData: any): customData is RestaurantCustomData {
  return customData && 'menuItems' in customData && 'specialFeatures' in customData;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ location }) => {
  const customData = location.customData;

  if (!customData || !isRestaurantCustomData(customData)) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">Restaurant details not available</p>
        </CardContent>
      </Card>
    );
  }

  const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold">{item.name}</h4>
          <span className="font-bold text-primary">{item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {item.dietaryTags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {item.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{item.rating}</span>
          </div>
        )}
        {item.nutritionInfo && (
          <div className="text-xs text-muted-foreground mt-2">
            {item.nutritionInfo.calories} cal • {item.nutritionInfo.protein}g protein
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header with verification badge */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">{location.name}</h2>
        {customData.isVerified && (
          <Badge variant="default" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>

      {/* Special Features */}
      {customData.specialFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Special Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {customData.specialFeatures.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Service Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customData.deliveryOptions.map((option) => (
              <div key={option.type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium capitalize">{option.type}</div>
                  {option.estimatedTime && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.estimatedTime}
                    </div>
                  )}
                  {option.fee && (
                    <div className="text-sm text-muted-foreground">
                      Fee: ${option.fee}
                    </div>
                  )}
                </div>
                <Badge variant={option.isAvailable ? "default" : "secondary"}>
                  {option.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              {customData.menuItems.length > 0 ? (
                customData.menuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-muted-foreground">No menu items available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customData.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">{ingredient.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{ingredient.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {ingredient.isOrganic && <Badge variant="outline">Organic</Badge>}
                      {ingredient.isLocal && <Badge variant="outline">Local</Badge>}
                      <Badge variant="secondary">{ingredient.availability}</Badge>
                    </div>
                    {ingredient.supplier && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Supplier: {ingredient.supplier}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Featured Items</CardTitle>
            </CardHeader>
            <CardContent>
              {customData.featuredItems.length > 0 ? (
                customData.featuredItems.map((item) => (
                  <Card key={item.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      {item.isSpecialOffer && (
                        <Badge variant="destructive" className="mb-2">
                          Special Offer
                        </Badge>
                      )}
                      {item.validUntil && (
                        <div className="text-xs text-muted-foreground">
                          Valid until: {new Date(item.validUntil).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No featured items available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loyalty Program */}
      {customData.loyaltyProgram && (
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{customData.loyaltyProgram.name}</h4>
                <p className="text-sm text-muted-foreground">{customData.loyaltyProgram.description}</p>
              </div>
              <Badge variant={customData.loyaltyProgram.isActive ? "default" : "secondary"}>
                {customData.loyaltyProgram.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RestaurantDetails;
