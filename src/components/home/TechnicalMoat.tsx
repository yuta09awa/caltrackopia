import { Globe, Lock, Scale, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TechnicalMoat = () => {
  const capabilities = [
    {
      value: "Global",
      label: "Edge Network",
      description: "Fast everywhere—because hunger doesn't wait",
      icon: Globe,
    },
    {
      value: "Real-time",
      label: "Data Sync",
      description: "Menu changes, allergen updates—instantly reflected",
      icon: Zap,
    },
    {
      value: "Infinite",
      label: "Scalability",
      description: "Built to grow from one city to every city",
      icon: Scale,
    },
    {
      value: "GDPR",
      label: "Compliant",
      description: "Privacy-first architecture with consent tracking",
      icon: Lock,
    },
  ];

  return (
    <section 
      id="technical-moat"
      className="relative overflow-hidden"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Globe className="w-4 h-4" />
            Everybody Eats
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            One Platform. Every Source. Any Need.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ingredient safety and food transparency aren't local issues—they're universal. We built infrastructure that starts in one neighborhood and scales to every corner of the world.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="relative group p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {item.value}
                </div>
                <div className="font-semibold text-sm mb-1">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            );
          })}
        </div>

        {/* Global Message */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Infrastructure, Not Just an App
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                We're building the transparency layer for all food commerce. APIs for restaurants. Widgets for brands. Integrations for platforms. The information layer that makes informed choice possible everywhere.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                  40+ countries with allergen laws
                </div>
                <div className="px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium">
                  Works in any language
                </div>
                <div className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium">
                  Adapts to local regulations
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TechnicalMoat;
