
export type ConflictMode = 'replace' | 'separate' | 'merge';

export interface ConflictResolution {
  mode: ConflictMode;
  userPreference: boolean;
  timestamp: number;
}

export interface ConflictAction {
  type: 'replace' | 'separate' | 'merge' | 'cancel';
  data?: any;
}

export interface CartMigrationData {
  items: any[];
  activeLocationId: string | null;
  timestamp: number;
  version: string;
}
