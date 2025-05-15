
import { Link } from "react-router-dom";
import { Market } from "../types";

interface MarketReviewsTabProps {
  market: Market;
  similarMarkets: Market[];
}

const MarketReviewsTab = ({ market, similarMarkets }: MarketReviewsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="py-2 px-4 bg-muted/50 rounded-md">
        <h3 className="font-medium">Reviews Coming Soon</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We're collecting reviews for this location. Check back soon!
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Similar Places</h3>
        <div className="grid grid-cols-2 gap-3">
          {similarMarkets.map((similar) => (
            <Link 
              key={similar.id} 
              to={`/markets/${similar.id}`}
              className="block"
            >
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={similar.images[0]} 
                  alt={similar.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-medium mt-1">{similar.name}</h4>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span>{similar.subType}</span>
                <span>•</span>
                <span>{similar.distance}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketReviewsTab;
