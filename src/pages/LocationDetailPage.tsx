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
import { locationService } from "@/services/locationService";
import { Location } from "@/models/Location";

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
  "2": {
    // Greens Restaurant - this should be a restaurant, not grocery
    menu: [
      {
        category: "Appetizers",
        items: [
          {
            id: "a1",
            name: "Seasonal Vegetable Terrine",
            description: "Layers of roasted vegetables with herb oil and microgreens",
            price: "$18.00",
            image: "/placeholder.svg",
            dietaryTags: ["Vegetarian", "Vegan"],
            rating: 4.8,
            thumbsUp: 32,
            thumbsDown: 1
          }
        ]
      },
      {
        category: "Main Courses",
        items: [
          {
            id: "m1",
            name: "Wild Mushroom Risotto",
            description: "Creamy arborio rice with seasonal wild mushrooms and truffle oil",
            price: "$28.00",
            image: "/placeholder.svg",
            dietaryTags: ["Vegetarian", "Gluten-Free"],
            rating: 4.9,
            thumbsUp: 45,
            thumbsDown: 2
          }
        ]
      }
    ],
    nutrition: {
      show: true,
      items: [
        {
          name: "Wild Mushroom Risotto",
          calories: 520,
          protein: 12,
          carbs: 68,
          fat: 18,
          fiber: 4
        }
      ]
    }
  }
};

// Mock similar locations for reviews tab
const similarLocations = [
  {
    id: "3",
    name: "Protein Power Bar",
    type: "Restaurant",
    distance: "0.8 mi",
    image: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Green Leaf Deli",
    type: "Restaurant",
    distance: "1.5 mi",
    image: "/placeholder.svg"
  }
];

const LocationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<ExtendedLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeThumbsUp, setActiveThumbsUp] = useState<Set<string>>(new Set());
  const [activeThumbsDown, setActiveThumbsDown] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const baseLocation = await locationService.getLocationById(id);
        if (baseLocation) {
          // Merge with extended data if available
          const extendedData = extendedLocationData[id] || {};
          const mergedLocation = { ...baseLocation, ...extendedData } as ExtendedLocation;
          setLocation(mergedLocation);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        toast.error("Failed to load location details");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading location details...</p>
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
                {isRestaurant(location) && location.menu && (
                  <Accordion type="single" collapsible className="w-full">
                    {location.menu.map((category) => (
                      <AccordionItem key={category.category} value={category.category}>
                        <AccordionTrigger className="hover:no-underline">
                          <span>{category.category}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {category.items.map((item) => (
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
                                    <h3 className="font-medium text-base">{item.name}</h3>
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
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

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

                {!isRestaurant(location) && !isGrocery(location) && (
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
                  <div className="py-2 px-4 bg-muted/50 rounded-md">
                    <h3 className="font-medium">Nutritional Information</h3>
                    {isRestaurant(location) && location.nutrition && location.nutrition.show && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Calories</TableHead>
                            <TableHead className="text-right">Protein</TableHead>
                            <TableHead className="text-right">Carbs</TableHead>
                            <TableHead className="text-right">Fat</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {location.nutrition.items.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">{item.calories}</TableCell>
                              <TableCell className="text-right">{item.protein}g</TableCell>
                              <TableCell className="text-right">{item.carbs}g</TableCell>
                              <TableCell className="text-right">{item.fat}g</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    {(!isRestaurant(location) || (isRestaurant(location) && (!location.nutrition || !location.nutrition.show))) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Detailed nutritional information is being added soon.
                      </p>
                    )}
                  </div>

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
