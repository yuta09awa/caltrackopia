import { Heart, Shield, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const PhilosophySection = () => {
  const principles = [
    {
      icon: Heart,
      title: "Your Body, Your Rules",
      description:
        "Whether it's a medical necessity, a personal belief, or simply a preference—you don't need to justify why. If you don't want to eat something, that's reason enough.",
    },
    {
      icon: Shield,
      title: "Beyond Labels & Laws",
      description:
        "Regulations change. Trends fade. What matters is what you want to know about your food. We give you the information; you decide what to do with it.",
    },
    {
      icon: Sparkles,
      title: "Empowerment, Not Judgment",
      description:
        "We're not here to tell you what's 'healthy' or 'clean.' We're here to show you what's in your food so you can eat with confidence—whatever that means for you.",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
            <Heart className="w-4 h-4 text-primary" />
            Our Philosophy
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            You Decide What Goes on Your Plate
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe food choices are deeply personal. Not everyone eats the same way—and that's a beautiful thing. NutriMap exists to give you the tools to eat the way <em className="text-foreground not-italic font-medium">you</em> want to.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="relative p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in text-center"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Warm closing statement */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "450ms" }}>
          <blockquote className="text-xl md:text-2xl text-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            "Allergens, sourcing, nutrition. The information is there.
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              The choice is yours."
            </span>
          </blockquote>
        </div>
      </Container>
    </section>
  );
};

export default PhilosophySection;
