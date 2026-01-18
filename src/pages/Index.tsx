import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import PlatformDemo from "@/components/home/PlatformDemo";
import TechnicalMoat from "@/components/home/TechnicalMoat";
import MarketOpportunity from "@/components/home/MarketOpportunity";
import TractionMetrics from "@/components/home/TractionMetrics";
import GlobalSearch from "@/components/search/GlobalSearch";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar>
        <div className="flex-1 max-w-2xl mx-4">
          <GlobalSearch 
            navigateTo="/map"
            className="w-full"
            compact={true}
          />
        </div>
      </Navbar>
      
      <main className="flex-1">
        {/* Hero - Vision Statement */}
        <Hero />
        
        {/* Problem - Market Pain Points */}
        <ProblemSection />
        
        {/* Solution - Three-Sided Marketplace */}
        <SolutionSection />
        
        {/* Platform Demo - Interactive Features */}
        <PlatformDemo />
        
        {/* Technical Moat - Scalability */}
        <TechnicalMoat />
        
        {/* Market Opportunity - TAM/SAM/SOM */}
        <MarketOpportunity />
        
        {/* Traction - Metrics & CTA */}
        <TractionMetrics />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
