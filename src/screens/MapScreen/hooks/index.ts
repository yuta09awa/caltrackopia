// ============= MAPSCREEN CONSOLIDATED HOOKS =============

// PRIMARY INTERFACE - Use this for MapScreen functionality
export { 
  useMapContext, 
  useMapState, 
  useMapActions, 
  useMapSearch, 
  useMapUI 
} from './useMapContext';

// SIMPLIFIED CONTEXT HOOK - For lighter MapScreen usage
export { useSimplifiedMapContext } from './useSimplifiedMapContext';

// === LEGACY HOOKS - Use useMapContext instead ===
// These will be removed in future versions
export { useMapScreenState } from './useMapScreenState';
export { useMapScreenCallbacks } from './useMapScreenCallbacks';
export { useMapScreenProps } from './useMapScreenProps';
export { useMapInitialization } from './useMapInitialization';
export { useMapScreenCore } from './useMapScreenCore';
export { useMapScreenSearch } from './useMapScreenSearch';
export { useMapScreenUI } from './useMapScreenUI';
export { useMapScreenHandlers } from './useMapScreenHandlers';
export { useMapScreenDependencies } from './useMapScreenDependencies';