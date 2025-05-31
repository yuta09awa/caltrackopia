
import { RestaurantCustomData, MarketCustomData } from '@/models/Location';

/**
 * Type guard to check if customData is of type RestaurantCustomData.
 * @param customData The customData object to check.
 * @returns True if customData is RestaurantCustomData, false otherwise.
 */
export function isRestaurantCustomData(customData: RestaurantCustomData | MarketCustomData | undefined): customData is RestaurantCustomData {
  return customData !== undefined && 'menuItems' in customData && 'specialFeatures' in customData;
}

/**
 * Type guard to check if customData is of type MarketCustomData.
 * @param customData The customData object to check.
 * @returns True if customData is MarketCustomData, false otherwise.
 */
export function isMarketCustomData(customData: RestaurantCustomData | MarketCustomData | undefined): customData is MarketCustomData {
  // Check for properties specific to MarketCustomData that are not in RestaurantCustomData
  return customData !== undefined && (
    'sections' in customData || 
    'vendors' in customData ||
    'events' in customData ||
    'highlights' in customData
  );
}
