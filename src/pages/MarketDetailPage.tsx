
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useHybridLocation } from "@/hooks/useHybridLocation";
import MarketHeader from "@/features/markets/components/MarketHeader";
import MarketDetailTabs from "@/features/markets/components/MarketDetailTabs";
import { Location } from "@/models/Location";
import { isMarketCustomData } from "@/utils/typeGuards";

const MarketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { location: hybridLocation, loading, error } = useHybridLocation(id || null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading market details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-destructive">Error loading market</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }
  
  if (!hybridLocation || hybridLocation.type !== "Grocery") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Market not found</h1>
        <Link to="/map" className="text-primary hover:underline">
          Return to map
        </Link>
      </div>
    );
  }

  const market = hybridLocation;

  // Find similar markets for the reviews tab - this would ideally come from a proper search
  const similarMarkets: Location[] = [];

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
