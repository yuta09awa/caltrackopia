import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { SPACING } from "@/constants/spacing";

const Hero = () => {
  const trustBadges = [
    { value: "10K+", label: "Restaurants" },
    { value: "500+", label: "Verified Farms" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <section 
      className="relative overflow-hidden"
      style={{ paddingTop: SPACING.hero.pt, paddingBottom: SPACING.hero.pb }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl -z-10" />
      
      <Container size="full" className="relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <TrendingUp className="w-4 h-4" />
            The Global Food Intelligence Platform
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Farm-to-Fork Transparency
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              at Global Scale
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The first platform connecting <span className="text-foreground font-medium">consumers</span>, <span className="text-foreground font-medium">restaurants</span>, and <span className="text-foreground font-medium">farms</span> through supply chain transparency, allergen safety protocols, and verified nutrition data.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to="/map"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Request Early Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#market-opportunity"
              className="px-8 py-4 bg-background text-foreground rounded-xl font-semibold hover:bg-secondary transition-all border-2 border-border hover:border-primary/50"
            >
              For Investors
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 md:gap-12">
            {trustBadges.map((badge, index) => (
              <div 
                key={badge.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {badge.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-1">
                  {badge.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Platform Preview */}
        <div className="mt-20 max-w-6xl mx-auto animate-scale-in">
          <div className="relative glass rounded-3xl p-3 border border-border/50 shadow-2xl shadow-primary/10">
            <div className="aspect-[16/9] bg-gradient-to-br from-secondary via-background to-secondary rounded-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Live Platform Demo
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg border border-border/50">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powering the future of food transparency
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
