import { ArrowRight, ArrowUpRight, BarChart3, Store, Tractor, Users, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TractionMetrics = () => {
  const metrics = [
    {
      icon: Store,
      value: "10,000+",
      label: "Restaurants Onboarded",
      growth: "+340%",
      growthLabel: "YoY",
    },
    {
      icon: Tractor,
      value: "500+",
      label: "Farms in Network",
      growth: "+180%",
      growthLabel: "YoY",
    },
    {
      icon: Utensils,
      value: "2.5M+",
      label: "Menu Items Tracked",
      growth: "+420%",
      growthLabel: "YoY",
    },
    {
      icon: Users,
      value: "850K+",
      label: "Monthly Active Users",
      growth: "+290%",
      growthLabel: "YoY",
    },
  ];

  const milestones = [
    { quarter: "Q1 2024", event: "Platform Launch", highlight: true },
    { quarter: "Q2 2024", event: "1K Restaurants" },
    { quarter: "Q3 2024", event: "Farm Network Expansion" },
    { quarter: "Q4 2024", event: "10K Restaurants Milestone", highlight: true },
    { quarter: "Q1 2025", event: "International Expansion", upcoming: true },
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
            <BarChart3 className="w-4 h-4" />
            Traction
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Accelerating Growth
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Strong product-market fit with exponential growth across all key metrics.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="relative group p-6 md:p-8 rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.growth} {metric.growthLabel}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Growth Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Key Milestones</h3>
            <p className="text-muted-foreground">Building momentum quarter over quarter</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex justify-between relative">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.quarter}
                  className={`flex flex-col items-center text-center animate-fade-in ${
                    milestone.upcoming ? "opacity-60" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full mb-4 ${
                    milestone.highlight
                      ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
                      : milestone.upcoming
                      ? "bg-border border-2 border-dashed border-muted-foreground"
                      : "bg-primary/30"
                  }`} />
                  
                  {/* Content */}
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {milestone.quarter}
                  </div>
                  <div className={`text-xs md:text-sm font-medium max-w-[80px] md:max-w-[100px] ${
                    milestone.highlight ? "text-primary" : milestone.upcoming ? "text-muted-foreground" : ""
                  }`}>
                    {milestone.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Learn More?
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join the food transparency revolution. Whether you're an investor, restaurant, or farm—we'd love to connect.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Request Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#"
                  className="px-8 py-4 bg-background text-foreground rounded-xl font-semibold hover:bg-secondary transition-all border-2 border-border hover:border-primary/50 flex items-center justify-center gap-2"
                >
                  Investor Deck
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <span>🏢 For Restaurants</span>
                <span>🌾 For Farms</span>
                <span>💼 For Investors</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TractionMetrics;
