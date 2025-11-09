/**
 * Location Provider Factory
 * 
 * Factory pattern for creating location provider instances.
 * Supports provider swapping via environment variable.
 */

import { ILocationProvider, ProviderConfig } from './ILocationProvider';
import { GoogleMapsProvider } from './GoogleMapsProvider';
import { MapboxProvider } from './MapboxProvider';

export type ProviderType = 'google-maps' | 'mapbox';

/**
 * Get the configured provider type from environment
 */
function getConfiguredProvider(): ProviderType {
  const envProvider = import.meta.env.VITE_MAP_PROVIDER as ProviderType;
  
  if (envProvider === 'mapbox') {
    console.log('[LocationProviderFactory] Using Mapbox provider');
    return 'mapbox';
  }
  
  // Default to Google Maps
  console.log('[LocationProviderFactory] Using Google Maps provider (default)');
  return 'google-maps';
}

/**
 * Location Provider Factory
 */
export class LocationProviderFactory {
  private static instance: ILocationProvider | null = null;

  /**
   * Create or get the singleton provider instance
   */
  static getProvider(config?: ProviderConfig): ILocationProvider {
    if (!this.instance) {
      this.instance = this.createProvider(config);
    }
    return this.instance;
  }

  /**
   * Create a new provider instance
   */
  static createProvider(config?: ProviderConfig): ILocationProvider {
    const providerType = getConfiguredProvider();
    
    switch (providerType) {
      case 'mapbox':
        return new MapboxProvider(config);
      
      case 'google-maps':
      default:
        return new GoogleMapsProvider(config);
    }
  }

  /**
   * Reset the singleton instance (useful for testing or provider swapping)
   */
  static reset(): void {
    if (this.instance && this.instance.cleanup) {
      this.instance.cleanup();
    }
    this.instance = null;
  }

  /**
   * Get the current provider type
   */
  static getProviderType(): ProviderType {
    return getConfiguredProvider();
  }
}
