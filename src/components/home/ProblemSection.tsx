import { AlertTriangle, Store, Sprout, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const ProblemSection = () => {
  const painPoints = [
    {
      icon: Users,
      audience: "For Eaters",
      stat: "87%",
      statLabel: "want transparent ingredient info",
      problem: "Allergens, sourcing, nutrition—basic information that should be accessible everywhere. Instead, every restaurant and product has different standards.",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Store,
      audience: "For Food Sources",
      stat: "$890B",
      statLabel: "informed dining market",
      problem: "Restaurants, farms, and brands that do things right have no standard way to prove it. The information exists—it's just invisible to the people who'd value it.",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Sprout,
      audience: "The Connection Gap",
      stat: "Disconnected",
      statLabel: "despite aligned interests",
      problem: "Eaters want information. Sources have it. The connection is broken. We are simply building the infrastructure to fix it.",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section 
      className="relative bg-gradient-to-b from-background via-secondary/30 to-background"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive mb-6">
            <AlertTriangle className="w-4 h-4" />
            The Data Gap
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Information Shouldn't Be Hard to Find
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you need allergen info for safety, want to support local, or just care about nutrition—the data exists. It's just scattered.
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.audience}
                className="relative group p-8 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${point.bgColor} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${point.color}`} />
                </div>

                {/* Audience Tag */}
                <div className="text-sm font-semibold text-muted-foreground mb-4">
                  {point.audience}
                </div>

                {/* Stat */}
                <div className="mb-4">
                  <span className={`text-4xl md:text-5xl font-bold ${point.color}`}>
                    {point.stat}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {point.statLabel}
                  </p>
                </div>

                {/* Problem Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {point.problem}
                </p>

                {/* Decorative gradient */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${point.bgColor}`} />
              </div>
            );
          })}
        </div>

        {/* Bottom stat */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary border border-border/50">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground font-semibold">$2.4 trillion</span> in food choices made every year—most with incomplete information.
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProblemSection;
