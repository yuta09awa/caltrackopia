/**
 * Domain Layer - Public API
 * Central export point for all domain services
 */

// Core domain
export { eventBus } from './core/EventBus';
export type { DomainEvent } from './core/EventBus';
export * from './core/cart';

// Location domain
export { locationDomain, LocationEvents } from './location/LocationDomain';
export type { 
  LocationSelectedEvent, 
  LocationSearchedEvent, 
  UserLocationUpdatedEvent 
} from './location/LocationDomain';

// Health domain
export { healthDomain, HealthEvents } from './health/HealthDomain';
export type { 
  MealLoggedEvent, 
  NutritionCalculatedEvent 
} from './health/HealthDomain';
