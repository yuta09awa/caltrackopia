
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmersMarketDetails from "./FarmersMarketDetails";
import ConvenienceStoreDetails from "./ConvenienceStoreDetails";
import FoodFestivalDetails from "./FoodFestivalDetails";
import GenericMarketDetails from "./GenericMarketDetails";
import MarketInfoTab from "./MarketInfoTab";
import MarketReviewsTab from "./MarketReviewsTab";
import MarketHighlights from "./MarketHighlights";
import { Location } from "@/models/Location";

interface MarketDetailTabsProps {
  market: Location;
  similarMarkets: Location[];
}

const MarketDetailTabs = ({ market, similarMarkets }: MarketDetailTabsProps) => {
  // Determine what content to show based on market subType
  const renderMarketSpecificContent = () => {
    if (!market.subType) return <GenericMarketDetails market={market} />;
    
    switch(market.subType.toLowerCase()) {
      case "farmers market":
        return <FarmersMarketDetails market={market} />;
      case "convenience store":
        return <ConvenienceStoreDetails market={market} />;
      case "food festival":
        return <FoodFestivalDetails market={market} />;
      default:
        return <GenericMarketDetails market={market} />;
    }
  };

  return (
    <div className="mt-6">
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          {market.highlights && market.highlights.length > 0 && (
            <div className="mb-6">
              <MarketHighlights items={market.highlights} />
            </div>
          )}
          {renderMarketSpecificContent()}
        </TabsContent>
        
        <TabsContent value="info" className="mt-4">
          <MarketInfoTab market={market} />
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-4">
          <MarketReviewsTab market={market} similarMarkets={similarMarkets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketDetailTabs;
