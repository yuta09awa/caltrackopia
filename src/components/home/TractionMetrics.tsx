import { ArrowRight, ArrowUpRight, BarChart3, MapPin, Store, Sprout, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TractionMetrics = () => {
  const metrics = [
    { icon: Store, value: "10,000+", label: "Food Sources" },
    { icon: Sprout, value: "500+", label: "Local Producers" },
    { icon: ShoppingBag, value: "250+", label: "Direct Brands" },
    { icon: MapPin, value: "30+", label: "Active Markets" },
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
            Growing Every Day
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real restaurants. Real producers. Real brands. All connecting to diners who care.
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
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Connect?
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Whether you're an eater, a restaurant, a producer, or an investor—we're building this for you.
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
                <span>🍽️ For Eaters</span>
                <span>🏪 For Food Sources</span>
                <span>📦 For D2C Brands</span>
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
