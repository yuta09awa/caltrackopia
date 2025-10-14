/**
 * Store middleware and development utilities
 * 
 * Note: For Redux DevTools integration, we use the built-in `devtools` 
 * middleware from 'zustand/middleware' which is already configured in the store.
 */

/**
 * Log state changes in development mode
 * Usage: Call this manually when you want to log state changes
 */
export function logStateChange(actionName: string, oldState: any, newState: any) {
  if (import.meta.env.DEV) {
    console.group(`🔄 State Update: ${actionName}`);
    console.log('Previous:', oldState);
    console.log('Next:', newState);
    console.log('Changed:', getChangedKeys(oldState, newState));
    console.groupEnd();
  }
}

/**
 * Helper to detect which keys changed between two states
 */
function getChangedKeys(oldState: any, newState: any): string[] {
  const allKeys = new Set([
    ...Object.keys(oldState || {}),
    ...Object.keys(newState || {})
  ]);
  
  const changedKeys: string[] = [];
  
  allKeys.forEach(key => {
    if (oldState[key] !== newState[key]) {
      changedKeys.push(key);
    }
  });
  
  return changedKeys;
}

/**
 * Performance monitoring utility
 * Usage: Wrap async actions with this to measure performance
 */
export async function monitorPerformance<T>(
  actionName: string,
  action: () => Promise<T>
): Promise<T> {
  if (import.meta.env.DEV) {
    const start = performance.now();
    try {
      const result = await action();
      const duration = performance.now() - start;
      
      if (duration > 100) {
        console.warn(`⚠️ Slow action "${actionName}": ${duration.toFixed(2)}ms`);
      } else {
        console.log(`✅ Action "${actionName}": ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ Action "${actionName}" failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  } else {
    return action();
  }
}

/**
 * Check if Redux DevTools extension is available
 */
export function hasReduxDevTools(): boolean {
  return typeof window !== 'undefined' && !!(window as any).__REDUX_DEVTOOLS_EXTENSION__;
}

/**
 * Log store initialization info
 */
export function logStoreInit(storeName: string) {
  if (import.meta.env.DEV) {
    console.log(`🏪 Store "${storeName}" initialized`);
    console.log(`📊 Redux DevTools: ${hasReduxDevTools() ? '✅ Available' : '❌ Not available'}`);
  }
}
