
export const mapPlaceTypeToMarkerType = (placeType: string): 'restaurant' | 'grocery' | 'search-result' => {
  const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food_court'];
  const groceryTypes = ['grocery_store', 'convenience_store', 'specialty_food_store', 'farmers_market'];
  
  if (restaurantTypes.includes(placeType)) return 'restaurant';
  if (groceryTypes.includes(placeType)) return 'grocery';
  return 'search-result';
};
