import { ArrowRight, CheckCircle, Leaf, ShieldCheck, Store, Tractor, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const SolutionSection = () => {
  const stakeholders = [
    {
      icon: Users,
      title: "For Consumers",
      color: "from-blue-500 to-blue-600",
      features: [
        "See which farm supplied the eggs in your omelet",
        "Access allergen protocols with cross-contamination risk levels",
        "Track nutrition with verified data provenance (USDA, AI Vision, Restaurant Verified)",
        "Make informed decisions based on real supply chain data",
      ],
    },
    {
      icon: Store,
      title: "For Restaurants",
      color: "from-green-500 to-green-600",
      features: [
        "Showcase supply chain transparency to attract health-conscious diners",
        "Gain competitive advantage through verified farm partnerships",
        "Reduce liability with documented allergen protocols",
        "Turn sourcing into marketing with visible farm relationships",
      ],
    },
    {
      icon: Tractor,
      title: "For Farms & Suppliers",
      color: "from-amber-500 to-amber-600",
      features: [
        "Gain consumer visibility through restaurant profiles",
        "Access market intelligence on certification demand",
        "Build direct relationships with local restaurants",
        "Premium positioning for sustainable practices",
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
            A Three-Sided Marketplace
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            NutriMap creates value at every node of the food chain—building network effects that compound with scale.
          </p>
        </div>

        {/* Triangle Visual */}
        <div className="relative max-w-4xl mx-auto mb-16 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
          </div>
          <svg viewBox="0 0 400 300" className="w-full h-auto relative z-10">
            {/* Triangle lines */}
            <path
              d="M200 50 L350 250 L50 250 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
              strokeDasharray="8,8"
            />
            {/* Center logo */}
            <circle cx="200" cy="150" r="40" className="fill-primary/10 stroke-primary" strokeWidth="2" />
            <text x="200" y="155" textAnchor="middle" className="fill-primary font-bold text-sm">
              NutriMap
            </text>
            {/* Nodes */}
            <circle cx="200" cy="50" r="30" className="fill-blue-500/20 stroke-blue-500" strokeWidth="2" />
            <text x="200" y="55" textAnchor="middle" className="fill-blue-600 text-xs font-medium">
              Consumers
            </text>
            <circle cx="350" cy="250" r="30" className="fill-green-500/20 stroke-green-500" strokeWidth="2" />
            <text x="350" y="255" textAnchor="middle" className="fill-green-600 text-xs font-medium">
              Restaurants
            </text>
            <circle cx="50" cy="250" r="30" className="fill-amber-500/20 stroke-amber-500" strokeWidth="2" />
            <text x="50" y="255" textAnchor="middle" className="fill-amber-600 text-xs font-medium">
              Farms
            </text>
            {/* Flow arrows */}
            <path d="M180 70 L160 120" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#arrowhead)" />
            <path d="M220 70 L240 120" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#arrowhead)" />
            <path d="M320 235 L260 180" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#arrowhead)" />
            <path d="M80 235 L140 180" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
              </marker>
            </defs>
          </svg>
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

        {/* Network Effect Callout */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-8 px-8 py-6 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border/50">
            <ShieldCheck className="w-10 h-10 text-primary" />
            <div className="text-left">
              <div className="font-bold text-lg">Compounding Network Effects</div>
              <div className="text-muted-foreground text-sm">
                Each new restaurant adds visibility for farms. Each new farm strengthens restaurant sourcing. Each consumer drives demand.
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SolutionSection;
