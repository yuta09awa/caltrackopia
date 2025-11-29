import { create } from 'zustand';
import { AppStore } from './index';

/**
 * Create a mock store for testing
 */
export function createMockStore(initialState?: Partial<AppStore>) {
  return create<AppStore>()(() => ({
    // Auth slice defaults
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setUser: () => {},
    setIsAuthenticated: () => {},
    setAuthLoading: () => {},
    setAuthError: () => {},
    getUserType: () => null,
    isRestaurantOwner: () => false,
    isCustomer: () => false,

    // Cart slice defaults
    items: [],
    groupedByLocation: {},
    activeLocationId: null,
    conflictMode: 'separate',
    total: 0,
    itemCount: 0,
    pendingConflict: null,
    undoStack: [],
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    clearLocation: () => {},
    calculateTotals: () => {},
    resolveConflict: () => {},
    setConflictMode: () => {},
    clearError: () => {},
    addToUndoStack: () => {},
    clearUndoStack: () => {},

    // Map filters slice defaults
    mapFilters: {
      priceRange: null,
      cuisine: 'all',
      groceryCategory: 'all',
      sources: [],
      dietary: [],
      nutrition: [],
      excludeIngredients: [],
      includeIngredients: [],
    },
    updateMapFilters: () => {},

    // User preferences slice defaults
    userPreferences: {
      theme: 'light',
      language: 'en',
      locale: 'en',
      currency: 'USD',
      measurementUnit: 'metric',
      region: null,
      notifications: true,
      location: {
        latitude: null,
        longitude: null,
      },
    },
    setUserPreferences: () => {},
    setUserLocation: () => {},

    // Override with initial state
    ...initialState,
  }));
}

/**
 * Helper to create a snapshot of current store state
 */
export function createStoreSnapshot(store: ReturnType<typeof createMockStore>) {
  return JSON.parse(JSON.stringify(store.getState()));
}

/**
 * Helper to compare two store states
 */
export function compareStoreStates(
  state1: Partial<AppStore>,
  state2: Partial<AppStore>,
  ignoreKeys: (keyof AppStore)[] = []
): boolean {
  const keys1 = Object.keys(state1).filter(k => !ignoreKeys.includes(k as keyof AppStore));
  const keys2 = Object.keys(state2).filter(k => !ignoreKeys.includes(k as keyof AppStore));

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => {
    const value1 = state1[key as keyof AppStore];
    const value2 = state2[key as keyof AppStore];
    return JSON.stringify(value1) === JSON.stringify(value2);
  });
}

/**
 * Helper to wait for store state changes
 */
export async function waitForStoreUpdate(
  store: ReturnType<typeof createMockStore>,
  predicate: (state: AppStore) => boolean,
  timeout = 1000
): Promise<void> {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const unsubscribe = store.subscribe((state) => {
      if (predicate(state)) {
        unsubscribe();
        resolve();
      } else if (Date.now() - startTime > timeout) {
        unsubscribe();
        reject(new Error('Timeout waiting for store update'));
      }
    });
  });
}
