
import { useState, useMemo } from "react";
import { Star, ArrowUpDown } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Update mock data to include images
const mockLocations = [
  {
    id: "1",
    name: "Healthy Greens Cafe",
    type: "Restaurant",
    rating: 4.8,
    distance: "0.3 mi",
    address: "123 Nutrition St",
    openNow: true,
    price: "$",
    dietaryOptions: ["High Protein", "Low Fat"],
    cuisine: "American",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
  {
    id: "2",
    name: "Fresh Market Grocery",
    type: "Grocery",
    rating: 4.6,
    distance: "0.5 mi",
    address: "456 Organic Ave",
    openNow: true,
    price: "$$",
    dietaryOptions: ["High Fiber", "Vegan"],
    cuisine: "Various",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
  {
    id: "3",
    name: "Protein Power Bar",
    type: "Restaurant",
    rating: 4.4,
    distance: "0.8 mi",
    address: "789 Fitness Blvd",
    openNow: false,
    price: "$$",
    dietaryOptions: ["High Protein", "Keto Friendly"],
    cuisine: "American",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
  {
    id: "4",
    name: "Nature's Pantry",
    type: "Grocery",
    rating: 4.7,
    distance: "1.2 mi",
    address: "101 Wholesome Way",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Vegan"],
    cuisine: "Various",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
  {
    id: "5",
    name: "Green Leaf Deli",
    type: "Restaurant",
    rating: 4.3,
    distance: "1.5 mi",
    address: "202 Salad Rd",
    openNow: true,
    price: "$",
    dietaryOptions: ["Low Fat", "High Fiber"],
    cuisine: "Mediterranean",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
];

const LocationList = () => {
  const [locations, setLocations] = useState(mockLocations);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("default");
  
  // Filter locations by type and sort by selected option
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = [...locations];
    
    if (activeTab === "restaurant") {
      filtered = filtered.filter(loc => loc.type.toLowerCase() === "restaurant");
    } else if (activeTab === "grocery") {
      filtered = filtered.filter(loc => loc.type.toLowerCase() === "grocery");
    }
    
    // Apply sorting based on selected option
    switch (sortOption) {
      case "rating-high":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "rating-low":
        return filtered.sort((a, b) => a.rating - b.rating);
      case "distance-near":
        return filtered.sort((a, b) => {
          const distanceA = parseFloat(a.distance.replace(" mi", ""));
          const distanceB = parseFloat(b.distance.replace(" mi", ""));
          return distanceA - distanceB;
        });
      case "distance-far":
        return filtered.sort((a, b) => {
          const distanceA = parseFloat(a.distance.replace(" mi", ""));
          const distanceB = parseFloat(b.distance.replace(" mi", ""));
          return distanceB - distanceA;
        });
      case "open-first":
        return filtered.sort((a, b) => {
          if (a.openNow && !b.openNow) return -1;
          if (!a.openNow && b.openNow) return 1;
          return 0;
        });
      default:
        // Default: open locations first
        return filtered.sort((a, b) => {
          if (a.openNow && !b.openNow) return -1;
          if (!a.openNow && b.openNow) return 1;
          return 0;
        });
    }
  }, [locations, activeTab, sortOption]);
  
  const filterByType = (type: string) => {
    setActiveTab(type);
  };

  return (
    <div className="w-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex flex-1">
          <button 
            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => filterByType('all')}
          >
            All
          </button>
          <button 
            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'restaurant' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => filterByType('restaurant')}
          >
            Restaurants
          </button>
          <button 
            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'grocery' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => filterByType('grocery')}
          >
            Groceries
          </button>
        </div>
        
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setSortOption("default")}
              className={sortOption === "default" ? "bg-muted" : ""}
            >
              Default (Open first)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOption("rating-high")}
              className={sortOption === "rating-high" ? "bg-muted" : ""}
            >
              Highest Rated
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOption("rating-low")}
              className={sortOption === "rating-low" ? "bg-muted" : ""}
            >
              Lowest Rated
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOption("distance-near")}
              className={sortOption === "distance-near" ? "bg-muted" : ""}
            >
              Closest First
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOption("distance-far")}
              className={sortOption === "distance-far" ? "bg-muted" : ""}
            >
              Farthest First
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOption("open-first")}
              className={sortOption === "open-first" ? "bg-muted" : ""}
            >
              Open Now
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="max-h-[500px] overflow-auto">
        {filteredAndSortedLocations.map((location) => (
          <div 
            key={location.id}
            className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer relative"
          >
            {/* Hazy overlay for closed locations */}
            {!location.openNow && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="bg-black/60 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Closed
                </div>
              </div>
            )}
            
            <div className="flex">
              {/* Image Carousel with floating controls - maximized with less spacing */}
              <div className="w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 relative overflow-hidden">
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {location.images.map((image, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="h-full w-full overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${location.name} image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Floating overlay navigation buttons */}
                  <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-10" />
                  <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-white/80 hover:bg-white shadow-sm z-10" />
                </Carousel>
              </div>
              
              {/* Location Details */}
              <div className="flex-1 min-w-0 p-3 pl-3 sm:p-4 sm:pl-4">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm sm:text-base truncate pr-2">{location.name}</h4>
                    <div className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap">
                        {location.type}
                      </span>
                      <span>•</span>
                      <span>{location.price}</span>
                      <span>•</span>
                      <span>{location.distance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 ml-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-xs sm:text-sm">{location.rating}</span>
                  </div>
                </div>
                
                {/* Show dietary options */}
                <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-1">
                  {location.dietaryOptions && location.dietaryOptions.map((option, idx) => (
                    <span key={idx} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {option}
                    </span>
                  ))}
                </div>
                
                <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
