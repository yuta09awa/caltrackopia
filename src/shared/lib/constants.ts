// Application-wide constants
export const APP_NAME = 'CalTrackoPia';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Map Configuration
export const DEFAULT_MAP_CENTER = {
  lat: 40.7128,
  lng: -74.0060
};

export const DEFAULT_MAP_ZOOM = 13;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const INFINITE_SCROLL_THRESHOLD = 0.8;

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  PWA_ENABLED: true,
  ANALYTICS_ENABLED: true,
  DEBUG_MODE: import.meta.env.DEV,
} as const;
