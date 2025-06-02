
import { DatabaseService } from './databaseService';
import { MockDataService } from './mockDataService';

// Environment-based service switching
const isDevelopment = import.meta.env.DEV;
const forceMockData = import.meta.env.VITE_FORCE_MOCK_DATA === 'true';

export type IDataService = DatabaseService | MockDataService;

// Service factory that returns appropriate service based on environment
export function createDataService(): IDataService {
  if (forceMockData || (isDevelopment && !import.meta.env.VITE_USE_REAL_DATA)) {
    console.log('Using MockDataService for data operations');
    return new MockDataService();
  }
  
  console.log('Using DatabaseService for data operations');
  return new DatabaseService();
}

// Singleton instance
export const dataService = createDataService();
