
import { ReactNode } from "react";

// Define our custom route type without extending RouteObject
export interface AppRoute {
  path?: string;
  element?: ReactNode;
  title?: string;
  navLabel?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  protected?: boolean;
  children?: AppRoute[];
  index?: boolean;
}
