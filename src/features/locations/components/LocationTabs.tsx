
import React from 'react';
import { LocationType } from '../hooks/useLocations';

interface LocationTabsProps {
  activeTab: LocationType;
  onTabChange: (tab: LocationType) => void;
}

const LocationTabs: React.FC<LocationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex mr-4 overflow-x-auto hide-scrollbar">
      <button 
        className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('all')}
      >
        All
      </button>
      <button 
        className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'restaurant' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('restaurant')}
      >
        Restaurants
      </button>
      <button 
        className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'grocery' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('grocery')}
      >
        Markets
      </button>
    </div>
  );
};

export default LocationTabs;
