
import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Calendar,
  Users,
  ArrowLeft,
  Store,
  Navigation,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Location } from "@/features/locations/hooks/useLocations";

// Mock market data (this would come from an API in a real app)
const mockMarkets: Record<string, Market> = {
  "6": {
    id: "6",
    name: "Downtown Farmers Market",
    type: "Grocery",
    subType: "Farmers Market",
    rating: 4.9,
    distance: "0.7 mi",
    address: "300 Market Square, San Francisco, CA",
    phone: "(415) 555-8765",
    website: "https://downtownfarmersmarket.example.com",
    openNow: true,
    hours: [
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "Closed" },
      { day: "Wednesday", hours: "Closed" },
      { day: "Thursday", hours: "Closed" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "8:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "8:00 AM - 2:00 PM" }
    ],
    price: "$$",
    dietaryOptions: ["Organic", "Local", "Seasonal"],
    description: "A vibrant farmers market offering fresh, locally-grown produce, artisanal foods, and handcrafted goods from over 35 local vendors.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    seasonality: "Year-round, weekends only",
    vendorCount: 35,
    schedule: "Saturday & Sunday: 8AM - 2PM",
    vendors: [
      {
        id: "v1",
        name: "Green Valley Farms",
        type: "Produce",
        description: "Organic vegetables and fruits from our family farm.",
        popular: ["Heirloom Tomatoes", "Organic Kale", "Seasonal Berries"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v2",
        name: "Artisan Bread Co.",
        type: "Bakery",
        description: "Freshly baked sourdough, whole grain breads and pastries.",
        popular: ["Sourdough Loaf", "Seeded Rye", "Croissants"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v3",
        name: "Happy Hen Eggs",
        type: "Dairy & Eggs",
        description: "Free-range eggs and artisanal cheeses from our local farm.",
        popular: ["Free-range Eggs", "Feta Cheese", "Goat Cheese"],
        images: ["/placeholder.svg"]
      }
    ],
    events: [
      {
        id: "e1",
        name: "Cooking Demonstration",
        date: "June 5, 2024",
        time: "10:00 AM - 11:30 AM",
        description: "Learn to cook seasonal recipes with Chef Maria."
      },
      {
        id: "e2",
        name: "Kids Gardening Workshop",
        date: "June 12, 2024",
        time: "9:00 AM - 10:30 AM",
        description: "Hands-on gardening activities for children ages 5-12."
      }
    ],
    features: ["Public Restrooms", "Parking Available", "Pet Friendly", "Credit Cards Accepted"]
  },
  "7": {
    id: "7",
    name: "Quick Stop Convenience",
    type: "Grocery",
    subType: "Convenience Store",
    rating: 3.8,
    distance: "0.2 mi",
    address: "505 Corner St, San Francisco, CA",
    phone: "(415) 555-3456",
    website: "https://quickstop.example.com",
    openNow: true,
    hours: [
      { day: "Monday", hours: "24 hours" },
      { day: "Tuesday", hours: "24 hours" },
      { day: "Wednesday", hours: "24 hours" },
      { day: "Thursday", hours: "24 hours" },
      { day: "Friday", hours: "24 hours" },
      { day: "Saturday", hours: "24 hours" },
      { day: "Sunday", hours: "24 hours" }
    ],
    price: "$$",
    dietaryOptions: ["Quick Meals", "Snacks"],
    description: "A convenient neighborhood store offering everyday essentials, quick meals, and snacks 24/7.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    sections: [
      {
        name: "Fresh Food",
        description: "Grab-and-go meals and fresh sandwiches",
        popular: ["Turkey Sandwich", "Greek Yogurt", "Fruit Cups"]
      },
      {
        name: "Snacks & Beverages",
        description: "Wide variety of drinks and snacks",
        popular: ["Energy Drinks", "Protein Bars", "Trail Mix"]
      },
      {
        name: "Essentials",
        description: "Everyday household items",
        popular: ["Paper Towels", "Cleaning Supplies", "First Aid"]
      }
    ],
    features: ["ATM", "Lottery", "Self-Checkout", "Coffee Station"]
  },
  "8": {
    id: "8",
    name: "Annual Food & Wine Festival",
    type: "Grocery",
    subType: "Food Festival",
    rating: 4.8,
    distance: "3.5 mi",
    address: "Riverfront Park, San Francisco, CA",
    phone: "(415) 555-9876",
    website: "https://foodwinefest.example.com",
    openNow: false,
    hours: [
      { day: "Festival Days", hours: "May 15-17: 11:00 AM - 8:00 PM" }
    ],
    price: "$$$",
    dietaryOptions: ["Gourmet", "Artisanal", "Vegan Options"],
    description: "A three-day celebration of culinary excellence featuring local chefs, wineries, breweries, and food artisans.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    seasonality: "Annual, May 15-17",
    vendorCount: 75,
    schedule: "May 15-17: 11AM - 8PM",
    vendors: [
      {
        id: "v4",
        name: "Bella Vineyards",
        type: "Winery",
        description: "Award-winning local wines from our family vineyard.",
        popular: ["Cabernet Sauvignon", "Chardonnay", "Rosé"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v5",
        name: "Pacific Coast Seafood",
        type: "Seafood",
        description: "Fresh, sustainable seafood dishes prepared by Chef James.",
        popular: ["Grilled Octopus", "Oysters", "Fish Tacos"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v6",
        name: "Sweet Dreams Bakery",
        type: "Desserts",
        description: "Artisanal desserts, pastries and chocolates.",
        popular: ["Chocolate Truffles", "Macarons", "Fruit Tarts"],
        images: ["/placeholder.svg"]
      }
    ],
    events: [
      {
        id: "e3",
        name: "Chef Showdown",
        date: "May 15, 2024",
        time: "3:00 PM - 5:00 PM",
        description: "Watch local chefs compete in a live cooking competition."
      },
      {
        id: "e4",
        name: "Wine Tasting Masterclass",
        date: "May 16, 2024",
        time: "2:00 PM - 3:30 PM",
        description: "Learn about wine pairing and tasting techniques from sommeliers."
      },
      {
        id: "e5",
        name: "Farm to Table Talk",
        date: "May 17, 2024",
        time: "1:00 PM - 2:00 PM",
        description: "Panel discussion on sustainable farming and food practices."
      }
    ],
    features: ["Tickets Required", "Live Music", "Cooking Demonstrations", "VIP Areas"]
  }
};

// Define interface for market types
interface Vendor {
  id: string;
  name: string;
  type: string;
  description: string;
  popular: string[];
  images: string[];
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

interface Section {
  name: string;
  description: string;
  popular: string[];
}

interface Market extends Location {
  phone: string;
  website: string;
  description: string;
  hours: { day: string; hours: string }[];
  features?: string[];
  vendors?: Vendor[];
  events?: Event[];
  sections?: Section[];
}

const MarketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Get market data based on ID
  const market = id ? mockMarkets[id] : null;
  
  if (!market) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Market not found</h1>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }

  // Determine what content to show based on market subType
  const renderMarketSpecificContent = () => {
    switch(market.subType?.toLowerCase()) {
      case "farmers market":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">About This Market</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{market.schedule}</p>
                      <p className="text-xs text-muted-foreground mt-1">{market.seasonality}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Vendor Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{market.vendorCount} local vendors</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {market.vendors && (
              <div>
                <h3 className="text-lg font-medium mb-3">Featured Vendors</h3>
                <div className="space-y-3">
                  {market.vendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/4 h-24 sm:h-auto">
                          <img 
                            src={vendor.images[0]} 
                            alt={vendor.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{vendor.name}</h4>
                            <Badge variant="outline">{vendor.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Popular Items</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vendor.popular.map((item, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {market.events && (
              <div>
                <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  {market.events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{event.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}, {event.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case "convenience store":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Store Sections</h3>
              {market.sections && (
                <Accordion type="single" collapsible>
                  {market.sections.map((section) => (
                    <AccordionItem key={section.name} value={section.name}>
                      <AccordionTrigger className="hover:no-underline">
                        {section.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          {section.description}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs font-medium">Popular Items</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {section.popular.map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        );
      
      case "food festival":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Festival Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Festival Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{market.schedule}</p>
                      <p className="text-xs text-muted-foreground mt-1">{market.seasonality}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Participating Vendors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{market.vendorCount} food & drink vendors</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {market.events && (
              <div>
                <h3 className="text-lg font-medium mb-3">Event Schedule</h3>
                <div className="space-y-3">
                  {market.events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{event.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}, {event.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {market.vendors && (
              <div>
                <h3 className="text-lg font-medium mb-3">Featured Participants</h3>
                <div className="space-y-3">
                  {market.vendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/4 h-24 sm:h-auto">
                          <img 
                            src={vendor.images[0]} 
                            alt={vendor.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{vendor.name}</h4>
                            <Badge variant="outline">{vendor.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Signature Items</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vendor.popular.map((item, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        // Generic market view for any other types
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Available Products</h3>
              <div className="grid grid-cols-2 gap-3">
                {market.dietaryOptions.map((option, idx) => (
                  <Card key={idx}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{option}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

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
    <div className="min-h-screen flex flex-col bg-background pb-16">
      <Navbar />
      
      <main className="flex-1 pt-16">
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

          {/* Content Tabs */}
          <div className="mt-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              {/* Details Tab - Dynamic based on market type */}
              <TabsContent value="details" className="mt-4">
                {renderMarketSpecificContent()}
              </TabsContent>
              
              {/* Info Tab */}
              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Address</h3>
                    <p className="text-sm text-muted-foreground">{market.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contact</h3>
                    <p className="text-sm text-muted-foreground">{market.phone}</p>
                    <a 
                      href={market.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {market.website.replace('https://', '')}
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Hours</h3>
                    <div className="text-sm">
                      {market.hours.map((hour, idx) => (
                        <div 
                          key={`${hour.day}-${idx}`}
                          className="flex justify-between py-1 border-b border-gray-100 last:border-0"
                        >
                          <span className={hour.day === "Sunday" ? "font-medium" : ""}>
                            {hour.day}
                          </span>
                          <span className="text-muted-foreground">{hour.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div className="py-2 px-4 bg-muted/50 rounded-md">
                    <h3 className="font-medium">Reviews Coming Soon</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      We're collecting reviews for this location. Check back soon!
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Similar Places</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(mockMarkets)
                        .filter(m => m.id !== market.id && m.subType === market.subType)
                        .slice(0, 2)
                        .map((similar) => (
                          <Link 
                            key={similar.id} 
                            to={`/markets/${similar.id}`}
                            className="block"
                          >
                            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={similar.images[0]} 
                                alt={similar.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="text-sm font-medium mt-1">{similar.name}</h4>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>{similar.subType}</span>
                              <span>•</span>
                              <span>{similar.distance}</span>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketDetailPage;
