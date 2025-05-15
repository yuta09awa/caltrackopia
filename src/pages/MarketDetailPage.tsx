
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { mockMarkets } from "@/features/markets/data/mockMarkets";
import MarketHeader from "@/features/markets/components/MarketHeader";
import MarketDetailTabs from "@/features/markets/components/MarketDetailTabs";
import { Market } from "@/features/markets/types";

const MarketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Get market data based on ID
  const market = id ? mockMarkets[id] : null;
  
  if (!market) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Market not found</h1>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }

  // Find similar markets for the reviews tab
  const similarMarkets = Object.values(mockMarkets)
    .filter(m => m.id !== market.id && m.subType === market.subType)
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <MarketHeader market={market} />
        
        <div className="px-4">
          <MarketDetailTabs market={market} similarMarkets={similarMarkets} />
        </div>
      </main>
    </div>
  );
};

export default MarketDetailPage;
