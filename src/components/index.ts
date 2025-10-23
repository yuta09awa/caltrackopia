// ============= COMPONENTS CONSOLIDATED EXPORTS =============
// Central export point for all components

// UI Components (shadcn/ui)
export * from './ui';

// Common Components
export * from './common';

// Layout Components
export { default as Navbar } from './layout/Navbar';
export { default as Footer } from './layout/Footer';
export { default as MobileMenu } from './layout/MobileMenu';
export { default as HamburgerButton } from './layout/HamburgerButton';
export { default as NavButton } from './layout/NavButton';
export { default as NavItem } from './layout/NavItem';
export { ConnectionStatus } from './layout/ConnectionStatus';
export { OfflineIndicator } from './layout/OfflineIndicator';
export { PWAInstallPrompt } from './layout/PWAInstallPrompt';

// Home Components
export { default as Hero } from './home/Hero';
export { default as FeatureCard } from './home/FeatureCard';

// Map Components
export { default as MapMarkerInfoCard } from './map/MapMarkerInfoCard';

// Restaurant Components
export { default as RestaurantDetails } from './restaurants/RestaurantDetails';

// Search Components
export { default as GlobalSearch } from './search/GlobalSearch';
export { default as SearchDropdown } from './search/SearchDropdown';
export { default as SearchHistory } from './search/SearchHistory';
export { default as SearchResults } from './search/SearchResults';
export { default as FilterChips } from './search/FilterChips';
export { default as FilterChipsDisplay } from './search/FilterChipsDisplay';
export { default as FilterChipsResults } from './search/FilterChipsResults';

// Error Components
export { GlobalErrorBoundary } from './error/GlobalErrorBoundary';

// Development Components
export { default as LocationSpoofPanel } from './development/LocationSpoofPanel';

// Routing Components
export * from './routing/LazyComponents';
export * from './routing/LazyRoutes';
