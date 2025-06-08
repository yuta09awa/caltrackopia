
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem, FeaturedItem, Promotion } from "@/models/Location";

interface LocationCardPopularHighlightsProps {
  popularItems: (MenuItem | FeaturedItem)[];
  promotions: Promotion[];
}

const LocationCardPopularHighlights: React.FC<LocationCardPopularHighlightsProps> = React.memo(({ popularItems, promotions }) => {
  const itemsToDisplay = [...popularItems, ...promotions];

  if (itemsToDisplay.length === 0) {
    return null; // Don't render if no items/promotions to show
  }

  return (
    <div className="flex-shrink-0 w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 overflow-hidden rounded-lg bg-muted/10 p-2">
      <h5 className="text-xs font-semibold text-muted-foreground mb-1">Highlights</h5>
      {itemsToDisplay.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent className="-ml-2 h-full">
            {itemsToDisplay.map((item, index) => (
              <CarouselItem key={item.id || index} className="pl-2 basis-full h-full">
                <Card className="h-full w-full border-none shadow-none bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center p-0 h-full">
                    {(item.imageUrl || ('image' in item && item.image)) ? (
                      <img
                        src={item.imageUrl || ('image' in item ? item.image : '')}
                        alt={item.name || ('title' in item ? item.title : '')}
                        className="w-full flex-1 object-cover rounded-md mb-1"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full flex-1 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs mb-1">
                        No Image
                      </div>
                    )}
                    <div className="w-full">
                      <p className="text-xs font-medium text-center truncate w-full">
                        {item.name || ('title' in item ? item.title : '')}
                      </p>
                      {'price' in item && item.price && (
                        <p className="text-xs text-muted-foreground text-center">{item.price}</p>
                      )}
                      {'discount' in item && item.discount && (
                        <p className="text-xs text-green-600 font-semibold text-center">{item.discount}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <p className="text-center text-muted-foreground text-sm h-full flex items-center justify-center">
          No highlights.
        </p>
      )}
    </div>
  );
});

LocationCardPopularHighlights.displayName = 'LocationCardPopularHighlights';

export default LocationCardPopularHighlights;
