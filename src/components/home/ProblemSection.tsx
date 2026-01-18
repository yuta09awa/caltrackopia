import { AlertTriangle, Store, Tractor, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const ProblemSection = () => {
  const painPoints = [
    {
      icon: Users,
      audience: "For Consumers",
      stat: "87%",
      statLabel: "of diners want food source transparency",
      problem: "Zero platforms deliver comprehensive farm-to-fork visibility with allergen protocols and verified nutrition data.",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Store,
      audience: "For Restaurants",
      stat: "$890B",
      statLabel: "health-conscious dining market",
      problem: "No tools exist to showcase supply chain as a competitive marketing advantage for attracting health-focused diners.",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Tractor,
      audience: "For Farms",
      stat: "0%",
      statLabel: "visibility to end consumers",
      problem: "Local producers remain invisible to the diners who value their products. No direct-to-consumer visibility exists.",
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
            The Problem
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            The Broken Food Trust Chain
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A fragmented ecosystem where transparency should exist but doesn't—leaving billions in value untapped.
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
              <span className="text-foreground font-semibold">$2.4 trillion</span> global food service market with zero transparency infrastructure
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProblemSection;
