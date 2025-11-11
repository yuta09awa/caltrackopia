/**
 * Storage type definitions
 */

export type CacheStoreName = 
  | 'places' 
  | 'searches' 
  | 'ingredients' 
  | 'menu_items' 
  | 'dietary_restrictions';

export interface CacheMetadata {
  timestamp: number;
  ttl: number;
  version?: string;
  tags?: string[];
}
