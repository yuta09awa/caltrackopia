
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Container size="full" className="relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Track your nutrition. Find healthy options nearby.
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Nutrition tracking
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> reimagined </span>
            for everyone
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your nutrition, discover restaurants with healthy options, and make informed choices about your diet, all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/map"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover-scale"
            >
              Explore Nearby
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/nutrition"
              className="px-6 py-3 bg-white text-foreground rounded-lg font-medium hover:bg-secondary transition-colors border border-border hover-scale"
            >
              Start Tracking
            </Link>
          </div>
        </div>
        
        {/* App Preview Image */}
        <div className="mt-16 max-w-5xl mx-auto animate-scale-in">
          <div className="relative glass rounded-2xl p-2 border border-gray-200/30 shadow-xl">
            <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-muted-foreground">
                  App preview will be displayed here
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200/50">
              Experience the future of nutrition tracking
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
