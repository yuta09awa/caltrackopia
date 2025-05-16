
import { Location, LocationType, SortOption } from "../types";

/**
 * Filters locations by type
 */
export function filterLocationsByType(locations: Location[], type: LocationType): Location[] {
  if (type === 'all') {
    return locations;
  } else if (type === 'restaurant') {
    return locations.filter(loc => loc.type.toLowerCase() === "restaurant");
  } else if (type === 'grocery') {
    return locations.filter(loc => loc.type.toLowerCase() === "grocery");
  } else if (type === 'farmers-market') {
    return locations.filter(loc => 
      loc.type.toLowerCase() === "grocery" && 
      loc.subType?.toLowerCase() === "farmers market"
    );
  } else if (type === 'convenience-store') {
    return locations.filter(loc => 
      loc.type.toLowerCase() === "grocery" && 
      loc.subType?.toLowerCase() === "convenience store"
    );
  } else if (type === 'food-festival') {
    return locations.filter(loc => 
      loc.type.toLowerCase() === "grocery" && 
      loc.subType?.toLowerCase() === "food festival"
    );
  }
  return locations;
}

/**
 * Filters locations by open status
 */
export function filterLocationsByOpenStatus(locations: Location[], isOpenNow: boolean): Location[] {
  if (isOpenNow) {
    return locations.filter(loc => loc.openNow);
  }
  return locations;
}

/**
 * Sorts locations by the selected sort option
 */
export function sortLocations(locations: Location[], sortOption: SortOption): Location[] {
  const locationsToSort = [...locations];
  
  switch (sortOption) {
    case "rating-high":
      return locationsToSort.sort((a, b) => b.rating - a.rating);
    case "rating-low":
      return locationsToSort.sort((a, b) => a.rating - b.rating);
    case "distance-near":
      return locationsToSort.sort((a, b) => {
        const distanceA = parseFloat(a.distance.replace(" mi", ""));
        const distanceB = parseFloat(b.distance.replace(" mi", ""));
        return distanceA - distanceB;
      });
    case "distance-far":
      return locationsToSort.sort((a, b) => {
        const distanceA = parseFloat(a.distance.replace(" mi", ""));
        const distanceB = parseFloat(b.distance.replace(" mi", ""));
        return distanceB - distanceA;
      });
    case "open-first":
      return locationsToSort.sort((a, b) => {
        if (a.openNow && !b.openNow) return -1;
        if (!a.openNow && b.openNow) return 1;
        return 0;
      });
    default:
      // Default: open locations first
      return locationsToSort.sort((a, b) => {
        if (a.openNow && !b.openNow) return -1;
        if (!a.openNow && b.openNow) return 1;
        return 0;
      });
  }
}
