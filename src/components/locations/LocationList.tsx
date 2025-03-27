
import { useState } from "react";
import { Star, MapPin, Clock, Filter, ArrowUpDown } from "lucide-react";

const mockLocations = [
  {
    id: "1",
    name: "Healthy Greens Cafe",
    type: "Restaurant",
    rating: 4.8,
    distance: "0.3 mi",
    address: "123 Nutrition St",
    openNow: true,
    price: "$",
    dietaryOptions: ["High Protein", "Low Fat"],
    cuisine: "American",
  },
  {
    id: "2",
    name: "Fresh Market Grocery",
    type: "Grocery",
    rating: 4.6,
    distance: "0.5 mi",
    address: "456 Organic Ave",
    openNow: true,
    price: "$$",
    dietaryOptions: ["High Fiber", "Vegan"],
    cuisine: "Various",
  },
  {
    id: "3",
    name: "Protein Power Bar",
    type: "Restaurant",
    rating: 4.4,
    distance: "0.8 mi",
    address: "789 Fitness Blvd",
    openNow: false,
    price: "$$",
    dietaryOptions: ["High Protein", "Keto Friendly"],
    cuisine: "American",
  },
  {
    id: "4",
    name: "Nature's Pantry",
    type: "Grocery",
    rating: 4.7,
    distance: "1.2 mi",
    address: "101 Wholesome Way",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Vegan"],
    cuisine: "Various",
  },
  {
    id: "5",
    name: "Green Leaf Deli",
    type: "Restaurant",
    rating: 4.3,
    distance: "1.5 mi",
    address: "202 Salad Rd",
    openNow: true,
    price: "$",
    dietaryOptions: ["Low Fat", "High Fiber"],
    cuisine: "Mediterranean",
  },
];

const LocationList = () => {
  const [locations, setLocations] = useState(mockLocations);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filterByType = (type: string) => {
    setActiveTab(type);
  };

  return (
    <div className="w-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-medium">Recommended Locations</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex border-b border-border">
        <button 
          className={`px-4 py-2 text-sm font-medium flex-1 ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => filterByType('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium flex-1 ${activeTab === 'restaurant' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => filterByType('restaurant')}
        >
          Restaurants
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium flex-1 ${activeTab === 'grocery' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => filterByType('grocery')}
        >
          Groceries
        </button>
      </div>
      
      <div className="max-h-[500px] overflow-auto">
        {locations.map((location) => (
          <div 
            key={location.id}
            className="p-4 border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{location.name}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                    {location.type}
                  </span>
                  <span>•</span>
                  <span>{location.price}</span>
                  <span>•</span>
                  <span>{location.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{location.rating}</span>
              </div>
            </div>
            
            {/* Show dietary options */}
            <div className="mt-1 flex flex-wrap gap-1">
              {location.dietaryOptions && location.dietaryOptions.map((option, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {option}
                </span>
              ))}
            </div>
            
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location.address}</span>
              </div>
              <div className={`flex items-center gap-1 ${location.openNow ? 'text-green-600' : 'text-red-500'}`}>
                <Clock className="w-3 h-3" />
                <span>{location.openNow ? 'Open Now' : 'Closed'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
