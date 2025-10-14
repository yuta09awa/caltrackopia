import { StateCreator } from 'zustand';

/**
 * Base state interface for all slices
 */
export interface BaseSliceState {
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Factory function for creating standardized Zustand slices
 * Provides common patterns and type safety
 */
export function createSliceFactory<
  TState extends BaseSliceState,
  TActions
>(
  initialState: TState,
  actions: (set: any, get: any) => TActions
): StateCreator<TState & TActions, [], [], TState & TActions> {
  return (set, get) => ({
    ...initialState,
    ...actions(set, get),
  });
}

/**
 * Helper to create standardized error handler
 */
export function createErrorHandler(set: any) {
  return (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('Store error:', error);
    set({ error: errorMessage, isLoading: false });
  };
}

/**
 * Helper to create loading state wrapper
 */
export function createLoadingWrapper<T>(
  set: any,
  asyncFn: () => Promise<T>
): Promise<T> {
  set({ isLoading: true, error: null });
  return asyncFn()
    .then((result) => {
      set({ isLoading: false });
      return result;
    })
    .catch((error) => {
      createErrorHandler(set)(error);
      throw error;
    });
}
