
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Phone, Star, Navigation, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Market } from "../types";

interface MarketHeaderProps {
  market: Market;
}

const MarketHeader = ({ market }: MarketHeaderProps) => {
  const navigate = useNavigate();

  const handleShowMap = () => {
    toast.info(`Showing ${market.name} on map`);
    navigate("/map");
  };

  const handleCall = () => {
    toast.info(`Calling ${market.phone}`);
    // In a real app, this would open the phone dialer
  };

  const handleGetDirections = () => {
    toast.info(`Getting directions to ${market.name}`);
    // In a real app, this would open maps app with directions
  };

  const handleWebsiteVisit = () => {
    window.open(market.website, '_blank');
    toast.info(`Opening website for ${market.name}`);
  };

  return (
    <>
      {/* Header / Image Section */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {market.images.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <AspectRatio ratio={16/9} className="h-full">
                  <img 
                    src={image} 
                    alt={`${market.name} image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <Link 
          to="/map" 
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Market Info */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{market.name}</h1>
              <Badge variant="outline" className="capitalize">{market.subType}</Badge>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <span>{market.price}</span>
              <span>•</span>
              <span>{market.distance}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{market.rating}</span>
              </div>
              <div className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                {market.openNow ? "Open Now" : "Closed"}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {market.dietaryOptions.map((option) => (
            <span 
              key={option} 
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {option}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="default" 
            className="flex-1" 
            onClick={handleShowMap}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Show on Map
          </Button>
          <Button 
            variant="outline"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={handleGetDirections}
          >
            <Navigation className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={handleWebsiteVisit}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="text-sm text-muted-foreground">{market.description}</p>
        </div>

        {/* Amenities/Features */}
        {market.features && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Features</h3>
            <div className="flex flex-wrap gap-1.5">
              {market.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MarketHeader;
