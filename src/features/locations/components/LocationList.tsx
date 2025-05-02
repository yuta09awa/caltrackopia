
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import LocationListHeader from "./LocationListHeader";
import LocationCard from "./LocationCard";
import { useLocations } from "../hooks/useLocations";

const LocationList = () => {
  const {
    locations,
    activeTab,
    filterByType,
    sortOption,
    setSortOption,
    isOpenNow,
    setIsOpenNow
  } = useLocations();

  return (
    <div className="w-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <LocationListHeader 
        activeTab={activeTab}
        filterByType={filterByType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        isOpenNow={isOpenNow}
        setIsOpenNow={setIsOpenNow}
      />
      
      <div className="max-h-[500px] overflow-auto">
        {locations.map((location) => (
          <LocationCard 
            key={location.id}
            location={location}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationList;
