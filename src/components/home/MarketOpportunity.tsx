import { TrendingUp, Target, Globe, Shield, Package } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const MarketOpportunity = () => {
  const marketSizing = [
    {
      label: "TAM",
      value: "$2.6T",
      description: "Global Food Service + D2C",
      percentage: 100,
      color: "from-primary/20 to-primary/30",
    },
    {
      label: "SAM",
      value: "$1.1T",
      description: "Informed Dining & Specialty Foods",
      percentage: 70,
      color: "from-primary/40 to-primary/50",
    },
    {
      label: "SOM",
      value: "$25B",
      description: "Initial Key Markets",
      percentage: 40,
      color: "from-primary to-accent",
    },
  ];

  const growthDrivers = [
    {
      icon: TrendingUp,
      title: "Rising Transparency Demand",
      stat: "73%",
      description: "consumers willing to pay more for transparency",
    },
    {
      icon: Package,
      title: "D2C Food Boom",
      stat: "$195B",
      description: "Direct-to-consumer market growing 15% annually",
    },
    {
      icon: Target,
      title: "Global Regulation",
      stat: "40+",
      description: "countries with mandatory allergen laws",
    },
    {
      icon: Shield,
      title: "Universal Need",
      stat: "100%",
      description: "of people eat—our total addressable humanity",
    },
  ];

  return (
    <section 
      id="market-opportunity"
      className="relative bg-gradient-to-b from-background via-secondary/30 to-background"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Target className="w-4 h-4" />
            Market Opportunity
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            The Largest Unaddressed Market
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Trillions in food transactions. Billions in D2C growth. Zero unified infrastructure. Until now.
          </p>
        </div>

        {/* TAM/SAM/SOM Visualization */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketSizing.map((market, index) => (
              <div
                key={market.label}
                className="relative group p-8 rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in text-center overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background bar */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${market.color} transition-all duration-700 opacity-20`}
                  style={{ height: `${market.percentage}%` }}
                />

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                    {market.label}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                    {market.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {market.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Concentric circles alternative visualization */}
          <div className="hidden md:flex justify-center mt-12">
            <div className="relative w-80 h-80">
              {/* TAM Circle */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                  TAM: $2.6T
                </span>
              </div>
              {/* SAM Circle */}
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                  SAM: $1.1T
                </span>
              </div>
              {/* SOM Circle */}
              <div className="absolute inset-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <div className="text-center text-primary-foreground">
                  <div className="text-2xl font-bold">$25B</div>
                  <div className="text-xs opacity-80">SOM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Drivers */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-2">Why Now?</h3>
            <p className="text-muted-foreground">The world is ready for food transparency—and the infrastructure finally exists to deliver it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthDrivers.map((driver, index) => {
              const Icon = driver.icon;
              return (
                <div
                  key={driver.title}
                  className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{driver.stat}</div>
                  <div className="font-semibold text-sm mb-1">{driver.title}</div>
                  <div className="text-xs text-muted-foreground">{driver.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MarketOpportunity;
