import { Zap, Shield, Heart, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TechnicalStats = () => {
  const stats = [
    {
      value: "10K+",
      label: "Healthy Locations",
      description: "Restaurants, markets, and grocery stores",
      icon: MapPin,
      color: "text-green-600"
    },
    {
      value: "Instant",
      label: "Results",
      description: "Lightning-fast search and recommendations",
      icon: Zap,
      color: "text-yellow-600"
    },
    {
      value: "Always On",
      label: "Availability",
      description: "Works offline when you need it most",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      value: "100%",
      label: "Personalized",
      description: "Tailored to your dietary preferences",
      icon: Heart,
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
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable, and always available to help you make healthier choices
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

        {/* Benefits Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Smart Filters</h3>
            <p className="text-sm text-muted-foreground">
              Find exactly what you're looking for with dietary restrictions, cuisine preferences, and nutrition goals
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Works Everywhere</h3>
            <p className="text-sm text-muted-foreground">
              Access your data anytime, anywhere—even without an internet connection
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-2">Your Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Your health data stays private and secure. You're always in control
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TechnicalStats;
