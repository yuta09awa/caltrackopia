import { CheckCircle, Leaf, Store, Package, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const SolutionSection = () => {
  const stakeholders = [
    {
      icon: Users,
      title: "For Every Eater",
      color: "from-blue-500 to-blue-600",
      features: [
        "Find restaurants, farms, and brands that match your needs",
        "Access standardized allergen protocols anywhere",
        "See ingredient sourcing for any food source",
        "Make informed choices based on real data",
      ],
    },
    {
      icon: Store,
      title: "For Food Sources",
      color: "from-green-500 to-green-600",
      features: [
        "Restaurants: showcase protocols & sourcing",
        "Farms: connect with local partners",
        "Brands: reach high-intent consumers",
        "Turn transparency into a competitive edge",
      ],
    },
    {
      icon: Package,
      title: "For D2C Brands",
      color: "from-purple-500 to-purple-600",
      features: [
        "List products alongside restaurant meals",
        "Reach consumers searching for your ingredients",
        "Showcase certifications and full sourcing",
        "Direct commerce integration",
      ],
    },
  ];

  return (
    <section 
      className="relative overflow-hidden"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      
      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Leaf className="w-4 h-4" />
            The Solution
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Connection Through Information
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We're the layer that connects food sources with the people looking for them. No judgment—just transparent information so everyone can make their own choice.
          </p>
        </div>

        {/* Hub & Spoke Visual */}
        <div className="relative max-w-4xl mx-auto mb-16 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
          </div>
          <svg viewBox="0 0 400 300" className="w-full h-auto relative z-10">
            {/* Connection lines */}
            <line x1="100" y1="150" x2="160" y2="150" stroke="currentColor" strokeWidth="2" className="text-primary/30" strokeDasharray="4,4" />
            <line x1="240" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="2" className="text-primary/30" strokeDasharray="4,4" />
            <line x1="200" y1="190" x2="200" y2="250" stroke="currentColor" strokeWidth="2" className="text-primary/30" strokeDasharray="4,4" />
            
            {/* Eaters node (left) */}
            <circle cx="70" cy="150" r="35" className="fill-blue-500/20 stroke-blue-500" strokeWidth="2" />
            <text x="70" y="145" textAnchor="middle" className="fill-current text-xl">👥</text>
            <text x="70" y="165" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-xs font-medium">Eaters</text>
            
            {/* Center hub - NutriMap */}
            <circle cx="200" cy="150" r="45" className="fill-primary/10 stroke-primary" strokeWidth="3" />
            <text x="200" y="155" textAnchor="middle" className="fill-primary font-bold text-sm">NutriMap</text>
            
            {/* Sources node (right) */}
            <circle cx="330" cy="150" r="35" className="fill-green-500/20 stroke-green-500" strokeWidth="2" />
            <text x="330" y="145" textAnchor="middle" className="fill-current text-xl">🏪</text>
            <text x="330" y="165" textAnchor="middle" className="fill-green-600 dark:fill-green-400 text-xs font-medium">Sources</text>
            
            {/* Brands node (bottom) */}
            <circle cx="200" cy="270" r="35" className="fill-purple-500/20 stroke-purple-500" strokeWidth="2" />
            <text x="200" y="265" textAnchor="middle" className="fill-current text-xl">📦</text>
            <text x="200" y="285" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400 text-xs font-medium">Brands</text>
          </svg>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground italic">Information flows freely in all directions</span>
          </div>
        </div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stakeholders.map((stakeholder, index) => {
            const Icon = stakeholder.icon;
            return (
              <div
                key={stakeholder.title}
                className="relative group p-8 rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stakeholder.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{stakeholder.title}</h3>
                </div>

                {/* Features */}
                <ul className="space-y-4">
                  {stakeholder.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default SolutionSection;
