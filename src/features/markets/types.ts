
import { Location } from "@/features/locations/hooks/useLocations";

export interface Vendor {
  id: string;
  name: string;
  type: string;
  description: string;
  popular: string[];
  images: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

export interface Section {
  name: string;
  description: string;
  popular: string[];
}

export interface HighlightItem {
  id: string;
  name: string;
  type: "new" | "popular" | "seasonal";
  description: string;
  image?: string;
  vendor?: string;
}

export interface Market extends Location {
  phone: string;
  website: string;
  description: string;
  hours: { day: string; hours: string }[];
  features?: string[];
  vendors?: Vendor[];
  events?: Event[];
  sections?: Section[];
  seasonality?: string;
  vendorCount?: number;
  schedule?: string;
  cuisine: string; // Required by the Location interface
  highlights?: HighlightItem[]; // Add highlights to the Market interface
}
