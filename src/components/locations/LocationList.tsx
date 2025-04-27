
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowUpDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IngredientSearch from '@/components/ingredients/IngredientSearch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

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
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const { mapFilters, updateMapFilters } = useAppStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
      {/* Filter Header */}
      <div className="p-4 space-y-4 border-b border-border">
        <div className="space-y-4">
          {/* Type Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={filterByType} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="restaurant" className="flex-1">Restaurants</TabsTrigger>
              <TabsTrigger value="grocery" className="flex-1">Groceries</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Toggles */}
          <div className="flex items-center justify-between gap-2">
            {/* Price Range Dropdown */}
            <Select
              value={priceFilter || "all"}
              onValueChange={(value) => setPriceFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="$">$</SelectItem>
                <SelectItem value="$$">$$</SelectItem>
                <SelectItem value="$$$">$$$</SelectItem>
                <SelectItem value="$$$$">$$$$</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>Sort</span>
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
                  onClick={() => setSortOption("distance-near")}
                  className={sortOption === "distance-near" ? "bg-muted" : ""}
                >
                  Closest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Advanced Filters Collapsible */}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Ingredient Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Include Ingredients</label>
                <IngredientSearch compact={true} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exclude Ingredients</label>
                <IngredientSearch compact={true} />
              </div>

              {/* Nutrition Focus */}
              <Select
                value={mapFilters.nutrition[0] || "all"}
                onValueChange={(value) => updateMapFilters({ nutrition: value === "all" ? [] : [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nutrition Focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="high-protein">High Protein</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                  <SelectItem value="keto">Keto Friendly</SelectItem>
                  <SelectItem value="low-fat">Low Fat</SelectItem>
                </SelectContent>
              </Select>

              {/* Sources */}
              <Select
                value={mapFilters.sources[0] || "all"}
                onValueChange={(value) => updateMapFilters({ sources: value === "all" ? [] : [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ingredient Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="sustainable">Sustainable</SelectItem>
                </SelectContent>
              </Select>

              {/* Cuisine Type */}
              <Select
                value={mapFilters.cuisine}
                onValueChange={(value) => updateMapFilters({ cuisine: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cuisine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          {/* Active Filters Display */}
          {(priceFilter || mapFilters.nutrition.length > 0 || mapFilters.sources.length > 0 || mapFilters.cuisine !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {priceFilter && (
                <Badge variant="secondary" className="text-xs">
                  Price: {priceFilter}
                </Badge>
              )}
              {mapFilters.nutrition.map((n) => (
                <Badge key={n} variant="secondary" className="text-xs">
                  {n}
                </Badge>
              ))}
              {mapFilters.sources.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {mapFilters.cuisine !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {mapFilters.cuisine}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Location List */}
      <div className="max-h-[500px] overflow-auto">
        {filteredAndSortedLocations.map((location) => (
          <Link 
            key={location.id}
            to={`/location/${location.id}`} 
            className="block border-b border-border hover:bg-muted/20 transition-colors cursor-pointer relative py-1.5"
          >
            {/* Hazy overlay for closed locations - reduced opacity */}
            {!location.openNow && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-10">
                {/* Removed the "Closed" label */}
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
