import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import PhilosophySection from "@/components/home/PhilosophySection";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import PlatformDemo from "@/components/home/PlatformDemo";
import TechnicalMoat from "@/components/home/TechnicalMoat";
import MarketOpportunity from "@/components/home/MarketOpportunity";
import TractionMetrics from "@/components/home/TractionMetrics";
import GlobalSearch from "@/components/search/GlobalSearch";
import D2CSection from "@/components/home/D2CSection";

const Index = () => {
  const handleNavigateToMap = () => {
    window.location.href = '/map';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar>
        <div className="flex-1 max-w-2xl mx-4">
          <GlobalSearch 
            onNavigate={handleNavigateToMap}
            className="w-full"
            compact={true}
          />
        </div>
      </Navbar>
      
      <main className="flex-1">
        {/* Hero - Vision Statement */}
        <Hero />
        
        {/* Philosophy - Empowerment Messaging */}
        <PhilosophySection />
        
        {/* Problem - The Data Gap */}
        <ProblemSection />
        
        {/* Solution - Connection Through Information */}
        <SolutionSection />
        
        {/* Platform Demo - Interactive Features */}
        <PlatformDemo />
        
        {/* Technical Moat - Scalability */}
        <TechnicalMoat />
        
        {/* Market Opportunity - TAM/SAM/SOM */}
        <MarketOpportunity />
        
        {/* D2C Section - Beyond Restaurants */}
        <D2CSection />
        
        {/* Traction - Metrics & CTA */}
        <TractionMetrics />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
