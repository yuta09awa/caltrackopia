// Re-export the new unified API hooks
export {
  useApiMutation,
  useApiQuery,
  useAsyncState,
  useApi
} from './useUnifiedApi';

// For backward compatibility, export the mutation as the default
export { useApiMutation as default } from './useUnifiedApi';