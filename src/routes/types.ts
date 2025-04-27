
import { ReactNode } from "react";

export interface AppRoute {
  path: string;
  element: ReactNode;
  children?: AppRoute[];
  index?: boolean;
}
