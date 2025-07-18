import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Map, 
  List, 
  Filter, 
  ShoppingCart,
  MapPin,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RestaurantListView from '@/features/map/components/RestaurantListView';
import FilterPanel from '@/features/map/components/FilterPanel';
import { LocationType } from '@/features/locations/types';

interface MapScreenSidebarProps {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
  activeTab: LocationType;
  onTabChange: (type: LocationType) => void;
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
  onApplyFilters: () => void;
  showGroceryList?: boolean;
  onToggleGroceryList?: () => void;
  className?: string;
}

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  completed: boolean;
}

const mockGroceryList: GroceryItem[] = [
  { id: '1', name: 'Organic Tomatoes', quantity: '2 lbs', completed: false },
  { id: '2', name: 'Free-Range Eggs', quantity: '1 dozen', completed: true },
  { id: '3', name: 'Sourdough Bread', quantity: '1 loaf', completed: false },
  { id: '4', name: 'Local Honey', quantity: '1 jar', completed: false },
];

const MapScreenSidebar: React.FC<MapScreenSidebarProps> = ({
  activeView,
  onViewChange,
  activeTab,
  onTabChange,
  priceFilter,
  setPriceFilter,
  onApplyFilters,
  showGroceryList = false,
  onToggleGroceryList,
  className
}) => {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(mockGroceryList);

  const toggleGroceryItem = (id: string) => {
    setGroceryList(list => 
      list.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = groceryList.filter(item => item.completed).length;

  return (
    <div className={cn("w-80 bg-background border-r border-border flex flex-col", className)}>
      {/* Header with View Toggle */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Discover</h2>
          {onToggleGroceryList && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleGroceryList}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {groceryList.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                >
                  {groceryList.length - completedCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={activeView === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('map')}
            className="flex-1"
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="flex-1"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={showGroceryList ? 'grocery-list' : 'main'} className="h-full flex flex-col">
          {/* Grocery List View */}
          {showGroceryList && (
            <TabsContent value="grocery-list" className="flex-1 overflow-y-auto p-4 mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Shopping List</span>
                    <Badge variant="outline">{completedCount}/{groceryList.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {groceryList.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-colors",
                        item.completed ? "bg-muted/50" : "hover:bg-accent/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleGroceryItem(item.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}>
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Main Content */}
          <TabsContent value="main" className="flex-1 overflow-hidden mt-0">
            <Tabs value={activeView} className="h-full flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="map" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </TabsTrigger>
                <TabsTrigger value="list" className="flex-1">
                  <Utensils className="h-4 w-4 mr-2" />
                  Places
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="flex-1 overflow-y-auto mt-0">
                <div className="p-4">
                  <FilterPanel
                    priceFilter={priceFilter}
                    setPriceFilter={setPriceFilter}
                    activeTab={activeTab}
                    onApplyFilters={onApplyFilters}
                  />
                </div>
              </TabsContent>

              <TabsContent value="list" className="flex-1 overflow-y-auto mt-0">
                <div className="p-4">
                  <RestaurantListView
                    restaurants={[]}
                    onRestaurantSelect={(id) => console.log('Selected restaurant:', id)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapScreenSidebar;