import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LocationCardImageProps } from './types';

const LocationCardImage: React.FC<LocationCardImageProps> = React.memo(({ 
  images, 
  name, 
  onCarouselClick 
}) => (
  <div className="w-24 h-20 relative overflow-hidden flex-shrink-0 rounded-lg">
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="h-full w-full overflow-hidden">
              <img 
                src={image} 
                alt={`${name} image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious 
        className="absolute left-0.5 top-1/2 -translate-y-1/2 h-4 w-4 bg-white/80 hover:bg-white shadow-sm z-30" 
        onClick={onCarouselClick}
      />
      <CarouselNext 
        className="absolute right-0.5 top-1/2 -translate-y-1/2 h-4 w-4 bg-white/80 hover:bg-white shadow-sm z-30" 
        onClick={onCarouselClick}
      />
    </Carousel>
  </div>
));

LocationCardImage.displayName = 'LocationCardImage';

export default LocationCardImage;
