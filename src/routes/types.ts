
import { ReactNode } from "react";
import { RouteObject } from 'react-router-dom';

export interface AppRoute extends RouteObject {
  title?: string;
  navLabel?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  protected?: boolean;
}
