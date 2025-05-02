
import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';

export type LocationType = 'all' | 'restaurant' | 'grocery';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';

export interface Location {
  id: string;
  name: string;
  type: string;
  rating: number;
  distance: string;
  address: string;
  openNow: boolean;
  price: string;
  dietaryOptions: string[];
  cuisine: string;
  images: string[];
}

// Mock data for development
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

export function useLocations() {
  const [locations] = useState<Location[]>(mockLocations);
  const [activeTab, setActiveTab] = useState<LocationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const { mapFilters } = useAppStore();

  // Filter locations by type, open status, and sort by selected option
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = [...locations];
    
    // Filter by location type
    if (activeTab === "restaurant") {
      filtered = filtered.filter(loc => loc.type.toLowerCase() === "restaurant");
    } else if (activeTab === "grocery") {
      filtered = filtered.filter(loc => loc.type.toLowerCase() === "grocery");
    }
    
    // Filter by open status if selected
    if (isOpenNow) {
      filtered = filtered.filter(loc => loc.openNow);
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
  }, [locations, activeTab, sortOption, isOpenNow]);
  
  const filterByType = (type: LocationType) => {
    setActiveTab(type);
  };

  return {
    locations: filteredAndSortedLocations,
    activeTab,
    filterByType,
    sortOption,
    setSortOption,
    isOpenNow,
    setIsOpenNow
  };
}
