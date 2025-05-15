
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Star, LeafyGreen } from "lucide-react";

interface HighlightItem {
  id: string;
  name: string;
  type: "new" | "popular" | "seasonal";
  description: string;
  image?: string;
  vendor?: string;
}

interface MarketHighlightsProps {
  items: HighlightItem[];
}

const MarketHighlights: React.FC<MarketHighlightsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;
  
  // Group items by type
  const newItems = items.filter(item => item.type === "new");
  const popularItems = items.filter(item => item.type === "popular");
  const seasonalItems = items.filter(item => item.type === "seasonal");
  
  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "new":
        return <CalendarDays className="h-4 w-4 text-blue-500" />;
      case "popular":
        return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
      case "seasonal":
        return <LeafyGreen className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getHighlightLabel = (type: string) => {
    switch (type) {
      case "new":
        return "Recently Added";
      case "popular":
        return "Popular";
      case "seasonal":
        return "Seasonal";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Highlights</h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
        {items.map((item) => (
          <Card 
            key={item.id}
            className="min-w-[200px] max-w-[200px] snap-start hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-2">
                {getHighlightIcon(item.type)}
                <Badge 
                  variant="outline"
                  className={`text-xs px-2 py-0 h-5 ${
                    item.type === "new" 
                      ? "border-blue-200 bg-blue-50 text-blue-700" 
                      : item.type === "popular"
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {getHighlightLabel(item.type)}
                </Badge>
              </div>
              
              <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
              {item.vendor && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {item.vendor}
                </p>
              )}
              <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketHighlights;
