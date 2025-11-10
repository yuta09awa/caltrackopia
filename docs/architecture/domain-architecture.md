# Domain Architecture

## Overview

This application uses a **Domain-Driven Design (DDD)** approach with **CQRS (Command Query Responsibility Segregation)** pattern to organize business logic into cohesive, maintainable domains.

## Architecture Principles

### 1. Domain Separation
Each domain has clear boundaries and responsibilities:

```
src/domains/
├── core/           # Core business logic (cart, orders, checkout)
│   ├── EventBus.ts
│   └── cart/
│       ├── commands.ts   # Write operations
│       ├── queries.ts    # Read operations
│       └── events.ts     # Domain events
├── location/       # Location and place management
│   └── LocationDomain.ts
└── health/         # Nutrition and health tracking
    └── HealthDomain.ts
```

### 2. CQRS Pattern

**Commands (Write Operations)**:
- Modify state
- Publish domain events
- Handle business rules and validations
- Example: `AddItemCommand`, `RemoveItemCommand`

**Queries (Read Operations)**:
- Read state without modification
- Compute derived values
- No side effects
- Example: `getItems()`, `getTotal()`, `isEmpty()`

### 3. Event-Driven Communication

Domains communicate through events via the `EventBus`:

```typescript
// Publishing an event
await eventBus.publish({
  type: CartEvents.ITEM_ADDED,
  payload: { item, locationId, locationName },
  timestamp: Date.now(),
});

// Subscribing to events
eventBus.subscribe(CartEvents.ITEM_ADDED, (event) => {
  // Handle event in different domain
});
```

## Domain Boundaries

### Core Domain (Cart)

**Responsibilities**:
- Shopping cart management
- Item operations (add, remove, update)
- Location conflict resolution
- Order preparation

**Events Published**:
- `cart.item.added`
- `cart.item.removed`
- `cart.quantity.updated`
- `cart.cleared`
- `cart.conflict.detected`
- `cart.checkout.started`

**Commands**:
- `AddItemCommand`
- `RemoveItemCommand`
- `UpdateQuantityCommand`
- `ClearCartCommand`
- `ResolveConflictCommand`

**Queries**:
- `getItems()`
- `getTotal()`
- `getItemCount()`
- `getItemsGroupedByLocation()`
- `getSummary()`

### Location Domain

**Responsibilities**:
- Place search and discovery
- Geocoding and reverse geocoding
- User location tracking
- Store inventory integration

**Events Published**:
- `location.selected`
- `location.searched`
- `location.user.updated`

**APIs**:
- `searchPlaces()`
- `getPlaceDetails()`
- `searchByIngredient()`
- `getCurrentLocation()`
- `geocodeAddress()`

### Health Domain

**Responsibilities**:
- Nutrition calculation
- Meal logging
- Health goal tracking
- Dietary restriction management

**Events Published**:
- `health.meal.logged`
- `health.nutrition.calculated`
- `health.goal.updated`

**APIs**:
- `calculateCartNutrition()`
- `logMeal()`
- `trackCalories()`

## Integration with Zustand Store

The Zustand store (`cartSlice.ts`) now uses the CQRS pattern:

```typescript
import { CartCommandHandler, CartQueryHandler } from '@/domains/core/cart';

export const createCartSlice: StateCreator<CartSlice> = (set, get) => {
  // Initialize command and query handlers
  const commandHandler = new CartCommandHandler(get, set);
  const queryHandler = new CartQueryHandler(get);

  return {
    // State
    items: [],
    total: 0,
    // ...

    // Actions delegate to command handlers
    addItem: async (item, locationId, locationName, locationType) => {
      await commandHandler.handleAddItem({
        item,
        locationId,
        locationName,
        locationType,
      });
      get().calculateTotals();
    },

    // Computed values use query handlers
    isEmpty: () => queryHandler.isEmpty(),
    getItemQuantity: (itemId) => queryHandler.getItemQuantity(itemId),
  };
};
```

## Event Flow Example

### Adding Item to Cart

```
User Action
    ↓
Component calls `addItem()`
    ↓
CartCommandHandler.handleAddItem()
    ↓
1. Check for location conflicts
2. Validate business rules
3. Update Zustand state
4. Publish CartItemAddedEvent
    ↓
EventBus distributes event
    ↓
┌────────────────┬────────────────┬────────────────┐
│                │                │                │
Health Domain    Analytics       Local Storage
(track nutrition) (track metrics) (persist cart)
```

## Benefits

### 1. Separation of Concerns
- Business logic is decoupled from UI components
- Each domain has a single responsibility
- Easier to test and maintain

### 2. Scalability
- New features can be added without modifying existing domains
- Domains can be split into microservices later if needed
- Event-driven architecture allows for async processing

### 3. Testability
```typescript
// Test commands in isolation
const handler = new CartCommandHandler(mockGetState, mockSetState);
await handler.handleAddItem(testCommand);
expect(mockSetState).toHaveBeenCalled();

// Test queries without side effects
const query = new CartQueryHandler(() => mockState);
expect(query.getTotal()).toBe(100);
```

### 4. Type Safety
- All commands, queries, and events are strongly typed
- TypeScript ensures correct usage across domains
- Compile-time checks prevent errors

## Migration Path

### Phase 1: ✅ Foundation (Current)
- EventBus implementation
- Cart domain with CQRS
- Basic domain structure

### Phase 2: Service Layer (Next)
- Migrate location hooks to use `locationDomain`
- Migrate cart hooks to use commands/queries
- Update components to use domain APIs

### Phase 3: Advanced Features
- Add health tracking with nutrition APIs
- Implement analytics domain
- Add order management domain

### Phase 4: Optimization
- Add caching layers to domains
- Implement event replay for debugging
- Add domain metrics and monitoring

## Best Practices

### 1. Command Design
```typescript
// ✅ Good: Explicit, single responsibility
interface AddItemCommand {
  item: MenuItem;
  locationId: string;
  locationName: string;
  locationType: 'Restaurant' | 'Grocery';
}

// ❌ Bad: Too generic, unclear intent
interface UpdateCartCommand {
  action: string;
  data: any;
}
```

### 2. Event Design
```typescript
// ✅ Good: Rich payload, clear semantics
interface CartItemAddedEvent {
  type: 'cart.item.added';
  payload: {
    item: CartItem;
    locationId: string;
    locationName: string;
  };
  timestamp: number;
}

// ❌ Bad: Minimal context, hard to use
interface CartEvent {
  type: string;
  data: any;
}
```

### 3. Query Design
```typescript
// ✅ Good: Pure function, no side effects
getItemQuantity(itemId: string): number {
  const item = this.getState().items.find(i => i.id === itemId);
  return item?.quantity || 0;
}

// ❌ Bad: Mutates state, side effects
getItemQuantity(itemId: string): number {
  this.setState({ lastQueriedItem: itemId }); // Side effect!
  return this.state.items.find(i => i.id === itemId)?.quantity || 0;
}
```

## Debugging

### View Event History
```typescript
import { eventBus } from '@/domains';

// Get all events
const allEvents = eventBus.getHistory();

// Get specific event type
const cartEvents = eventBus.getHistory('cart.item.added');

// Log in console for debugging
console.table(allEvents);
```

### Monitor Domain Events
```typescript
// Subscribe to all events for logging
eventBus.subscribe('*', (event) => {
  console.log(`[${event.type}]`, event.payload);
});
```

## Further Reading

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [CQRS Pattern by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
