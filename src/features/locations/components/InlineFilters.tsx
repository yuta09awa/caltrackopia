
import React from 'react';
import CuisineFilter from "@/features/map/components/filters/CuisineFilter";
import GroceryCategoryFilter from "@/features/map/components/filters/GroceryCategoryFilter";
import { LocationType } from '../types';

interface InlineFiltersProps {
  activeTab: LocationType;
  cuisineOptions: Array<{ value: string; label: string }>;
  groceryCategoryOptions: Array<{ value: string; label: string }>;
}

const InlineFilters: React.FC<InlineFiltersProps> = ({
  activeTab,
  cuisineOptions,
  groceryCategoryOptions
}) => {
  if (activeTab === 'restaurant') {
    return <CuisineFilter cuisineOptions={cuisineOptions} />;
  }
  
  if (activeTab === 'grocery') {
    return <GroceryCategoryFilter categoryOptions={groceryCategoryOptions} />;
  }
  
  return null;
};

export default InlineFilters;
