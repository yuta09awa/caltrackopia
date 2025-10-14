/**
 * Centralized API Client
 * Re-exports the enhanced ApiService singleton
 */

import { apiService } from '@/services/api/apiService';

export const apiClient = apiService;

export type { ApiService } from '@/services/api/apiService';
