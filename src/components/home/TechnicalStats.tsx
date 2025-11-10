import { Zap, Shield, TrendingDown, Layers } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TechnicalStats = () => {
  const stats = [
    {
      value: "70%",
      label: "API Cost Reduction",
      description: "Multi-layer caching saves thousands monthly",
      icon: TrendingDown,
      color: "text-green-600"
    },
    {
      value: "<500ms",
      label: "Response Time",
      description: "Memory, IndexedDB, and Supabase caching",
      icon: Zap,
      color: "text-yellow-600"
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Instant provider failover to Mapbox",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      value: "3-Tier",
      label: "Cache Architecture",
      description: "Enterprise-grade infrastructure",
      icon: Layers,
      color: "text-purple-600"
    }
  ];

  return (
    <section 
      className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-y border-border/50"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Enterprise Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Scale</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready infrastructure designed to serve millions of users while minimizing operational costs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover-scale animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="font-semibold text-foreground">{stat.label}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Multi-Layer Caching</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent caching strategy with Memory → IndexedDB → Supabase fallback reduces Google Maps API costs by $4,000/month for 100K searches
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Provider Abstraction</h3>
            <p className="text-sm text-muted-foreground">
              Seamless switching between Google Maps and Mapbox ensures business continuity and 75% cost optimization when needed
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Feature Flags</h3>
            <p className="text-sm text-muted-foreground">
              Deploy features safely with A/B testing and instant rollback capability, reducing deployment risk by 90%
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TechnicalStats;
