
import { ReactNode } from 'react';

export interface AppRoute {
  path?: string;
  element?: ReactNode;
  title?: string;
  navLabel?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  index?: boolean;
  children?: AppRoute[];
}
