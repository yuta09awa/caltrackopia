
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  ArrowLeft,
  Navigation
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useHybridLocation } from "@/hooks/useHybridLocation";
import { Location } from "@/models/Location";
import RestaurantDetails from "@/components/restaurants/RestaurantDetails";

// Define types for our location data - extending base Location interface
interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  dietaryTags: string[];
  rating: number;
  thumbsUp: number;
  thumbsDown: number;
}

interface NutritionItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  dietaryTags: string[];
  rating: number;
  thumbsUp: number;
  thumbsDown: number;
}

interface Section {
  name: string;
  description: string;
  popular: string[];
}

interface RestaurantLocation extends Location {
  menu?: MenuCategory[];
  nutrition?: {
    show: boolean;
    items: NutritionItem[];
  };
}

interface GroceryLocation extends Location {
  sections?: Section[];
  featuredItems?: FeaturedItem[];
}

type ExtendedLocation = RestaurantLocation | GroceryLocation;

// Function to check if location is a restaurant
function isRestaurant(location: ExtendedLocation): location is RestaurantLocation {
  return location.type === "Restaurant";
}

// Function to check if location is a grocery
function isGrocery(location: ExtendedLocation): location is GroceryLocation {
  return location.type === "Grocery";
}

// Mock extended data for locations that need additional details
const extendedLocationData: Record<string, Partial<ExtendedLocation>> = {
  "1": {
    menu: [
      {
        category: "Breakfast",
        items: [
          {
            id: "b1",
            name: "Protein Pancakes",
            description: "Fluffy pancakes made with protein powder, topped with berries and maple syrup",
            price: "$12.99",
            image: "/placeholder.svg",
            dietaryTags: ["High Protein", "Vegetarian"],
            rating: 4.7,
            thumbsUp: 24,
            thumbsDown: 2
          }
        ]
      }
    ],
    nutrition: {
      show: true,
      items: [
        {
          name: "Protein Pancakes",
          calories: 420,
          protein: 24,
          carbs: 45,
          fat: 12,
          fiber: 6
        }
      ]
    }
  },
  "target1": {
    // Target store - grocery location
    sections: [
      {
        name: "Produce",
        description: "Fresh fruits and vegetables sourced from local farms",
        popular: ["Organic bananas", "Avocados", "Baby spinach", "Strawberries"]
      },
      {
        name: "Dairy",
        description: "Fresh dairy products and alternatives",
        popular: ["Organic milk", "Greek yogurt", "Cheese selection", "Plant-based milk"]
      },
      {
        name: "Meat & Seafood",
        description: "Quality meats and fresh seafood",
        popular: ["Chicken breast", "Salmon fillets", "Ground beef", "Shrimp"]
      }
    ],
    featuredItems: [
      {
        id: "f1",
        name: "Organic Blueberries",
        description: "Fresh organic blueberries, perfect for smoothies and snacking",
        price: "$4.99",
        image: "/placeholder.svg",
        dietaryTags: ["Organic", "Antioxidant Rich"],
        rating: 4.8,
        thumbsUp: 15,
        thumbsDown: 1
      },
      {
        id: "f2",
        name: "Grass-Fed Ground Beef",
        description: "Premium grass-fed ground beef, 85% lean",
        price: "$8.99/lb",
        image: "/placeholder.svg",
        dietaryTags: ["Grass-Fed", "High Protein"],
        rating: 4.6,
        thumbsUp: 12,
        thumbsDown: 0
      }
    ]
  }
};

// Mock similar locations for reviews tab
const similarLocations = [
  {
    id: "wf1",
    name: "Whole Foods Market",
    type: "Grocery",
    distance: "0.5 mi",
    image: "/placeholder.svg"
  },
  {
    id: "cvs1",
    name: "CVS Pharmacy",
    type: "Grocery",
    distance: "1.2 mi",
    image: "/placeholder.svg"
  }
];

const LocationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { location: hybridLocation, loading, error } = useHybridLocation(id || null);
  const [location, setLocation] = useState<ExtendedLocation | null>(null);
  const [activeThumbsUp, setActiveThumbsUp] = useState<Set<string>>(new Set());
  const [activeThumbsDown, setActiveThumbsDown] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (hybridLocation && id) {
      // Merge with extended data if available
      const extendedData = extendedLocationData[id] || {};
      const mergedLocation = { ...hybridLocation, ...extendedData } as ExtendedLocation;
      setLocation(mergedLocation);
    }
  }, [hybridLocation, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading location details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-destructive">Error loading location</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Location not found</h1>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }

  // If this is a restaurant with custom data, show the detailed restaurant view
  if (location.type === "Restaurant" && location.customData) {
    return (
      <div className="min-h-screen flex flex-col bg-background pb-16">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="px-4 py-4">
            <Link 
              to="/map" 
              className="inline-flex items-center gap-2 mb-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to map
            </Link>
            <RestaurantDetails location={location} />
          </div>
        </main>
      </div>
    );
  }

  const handleThumbsUp = (itemId: string) => {
    setActiveThumbsUp((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
        setActiveThumbsDown((prevDown) => {
          const newDownSet = new Set(prevDown);
          newDownSet.delete(itemId);
          return newDownSet;
        });
      }
      return newSet;
    });
    toast.success("Thanks for your feedback!");
  };

  const handleThumbsDown = (itemId: string) => {
    setActiveThumbsDown((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
        setActiveThumbsUp((prevUp) => {
          const newUpSet = new Set(prevUp);
          newUpSet.delete(itemId);
          return newUpSet;
        });
      }
      return newSet;
    });
    toast.success("Thanks for your feedback!");
  };

  const handleShowMap = () => {
    toast.info(`Showing ${location.name} on map`);
    // In a real app, this would navigate to map with this location centered
  };

  const handleCall = () => {
    toast.info(`Calling ${location.name}`);
    // In a real app, this would open the phone dialer
  };

  const handleGetDirections = () => {
    toast.info(`Getting directions to ${location.name}`);
    // In a real app, this would open maps app with directions
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Header / Image Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
          <img 
            src={location.images[0]} 
            alt={location.name} 
            className="w-full h-full object-cover"
          />
          <Link 
            to="/map" 
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Location Info */}
        <div className="px-4 py-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{location.name}</h1>
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {location.type}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <span>{location.price}</span>
                <span>•</span>
                <span>{location.cuisine}</span>
                <span>•</span>
                <span>{location.distance}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{location.rating}</span>
                </div>
                <div className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                  {location.openNow ? "Open Now" : "Closed"}
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {location.dietaryOptions.map((option) => (
              <span 
                key={option} 
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {option}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={handleShowMap}
            >
              <MapPin className="w-4 h-4" />
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
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">About</h2>
            <p className="text-sm text-muted-foreground">{location.description}</p>
          </div>

          {/* Content Tabs */}
          <div className="mt-6">
            <Tabs defaultValue="menu">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              {/* Menu Tab */}
              <TabsContent value="menu" className="mt-4">
                {isGrocery(location) && location.featuredItems && (
                  <>
                    <h3 className="text-lg font-medium mb-3">Featured Items</h3>
                    <div className="space-y-4">
                      {location.featuredItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <span className="font-medium">{item.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex gap-1">
                                {item.dietaryTags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleThumbsUp(item.id)}
                                  className={`flex items-center gap-1 ${
                                    activeThumbsUp.has(item.id) 
                                      ? "text-primary" 
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span className="text-xs">{item.thumbsUp + (activeThumbsUp.has(item.id) ? 1 : 0)}</span>
                                </button>
                                <button 
                                  onClick={() => handleThumbsDown(item.id)}
                                  className={`flex items-center gap-1 ${
                                    activeThumbsDown.has(item.id) 
                                      ? "text-destructive" 
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span className="text-xs">{item.thumbsDown + (activeThumbsDown.has(item.id) ? 1 : 0)}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {location.sections && (
                      <>
                        <h3 className="text-lg font-medium mt-6 mb-3">Departments</h3>
                        <Accordion type="single" collapsible className="w-full">
                          {location.sections.map((section) => (
                            <AccordionItem key={section.name} value={section.name}>
                              <AccordionTrigger className="hover:no-underline">
                                <span>{section.name}</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {section.description}
                                </p>
                                <h4 className="text-sm font-medium mt-2">Popular Items</h4>
                                <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                  {section.popular.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </>
                    )}
                  </>
                )}

                {!isGrocery(location) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Menu information coming soon!</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Info Tab */}
              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Address</h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                  
                  {location.phone && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Contact</h3>
                      <p className="text-sm text-muted-foreground">{location.phone}</p>
                      {location.website && (
                        <a 
                          href={location.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {location.website.replace('https://', '')}
                        </a>
                      )}
                    </div>
                  )}
                  
                  {location.hours && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Hours</h3>
                      <div className="text-sm">
                        {location.hours.map((hour) => (
                          <div 
                            key={hour.day} 
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
                  )}
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">More like this</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {similarLocations.map((similar) => (
                        <Link 
                          key={similar.id} 
                          to={`/location/${similar.id}`}
                          className="block"
                        >
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={similar.image} 
                              alt={similar.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="text-sm font-medium mt-1">{similar.name}</h4>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{similar.type}</span>
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

export default LocationDetailPage;
