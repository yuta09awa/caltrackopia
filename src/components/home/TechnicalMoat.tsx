import { Cloud, Database, Globe, Lock, Server, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const TechnicalMoat = () => {
  const metrics = [
    {
      value: "<50ms",
      label: "Global Edge Response",
      description: "Cloudflare Workers at 300+ edge locations",
      icon: Zap,
    },
    {
      value: "99.99%",
      label: "Uptime SLA",
      description: "Multi-region redundancy with automatic failover",
      icon: Server,
    },
    {
      value: "Real-time",
      label: "Supply Chain Sync",
      description: "CDC webhooks for instant data propagation",
      icon: Database,
    },
    {
      value: "GDPR",
      label: "Compliant",
      description: "Privacy-first architecture with consent tracking",
      icon: Lock,
    },
  ];

  const architectureLayers = [
    {
      name: "Edge Layer",
      tech: "Cloudflare Workers",
      description: "Global distribution, sub-50ms responses",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Read Replicas",
      tech: "Turso (LibSQL)",
      description: "Globally distributed read replicas",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Source of Truth",
      tech: "Supabase (PostgreSQL)",
      description: "ACID-compliant primary database",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Sync Layer",
      tech: "CDC Webhooks",
      description: "Real-time change data capture",
      color: "from-purple-500 to-purple-600",
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
            Technical Moat
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Built for Global Scale
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The only food platform with infrastructure to serve 1M+ concurrent users globally with sub-50ms response times.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="relative group p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="font-semibold text-sm mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            );
          })}
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Multi-Layer Architecture</h3>
            <p className="text-muted-foreground">Designed for speed, reliability, and infinite scale</p>
          </div>

          <div className="relative">
            {/* Connection lines - visible on desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="space-y-4">
              {architectureLayers.map((layer, index) => (
                <div
                  key={layer.name}
                  className={`relative flex items-center gap-6 p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm animate-fade-in ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layer.color} flex items-center justify-center flex-shrink-0`}>
                    <Cloud className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <div className="font-bold text-lg mb-1">{layer.name}</div>
                    <div className="text-primary font-medium text-sm mb-1">{layer.tech}</div>
                    <div className="text-muted-foreground text-sm">{layer.description}</div>
                  </div>

                  {/* Connection dot */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom callout */}
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border/50">
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-sm md:text-base font-medium">
                <span className="text-foreground">Zero cold starts.</span>{" "}
                <span className="text-muted-foreground">Instant global deployment. Automatic scaling to millions.</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TechnicalMoat;
