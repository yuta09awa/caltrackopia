
import { MapPin, Utensils, Filter, Heart, MapPinned } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeatureCard from "@/components/home/FeatureCard";
import TechnicalStats from "@/components/home/TechnicalStats";
import GlobalSearch from "@/components/search/GlobalSearch";
import { SPACING } from "@/constants/spacing";
import { Ingredient } from "@/models/NutritionalInfo";

const Index = () => {
  const navigate = useNavigate();

  const handleSelectIngredient = (ingredient: Ingredient) => {
    // Navigate to map page when ingredient is selected
    navigate('/map');
  };

  const handleSearchReset = () => {
    // No action needed on home page
  };

  const features = [
    {
      title: "Map",
      description: "Find healthy food options nearby with our integrated mapping system.",
      icon: MapPin
    },
    {
      title: "Nutrition",
      description: "Track your daily nutrition, calories, and macros with an intuitive interface.",
      icon: Utensils
    },
    {
      title: "Local Menus",
      description: "Browse restaurant menus and discover local dining options.",
      icon: Filter
    },
    {
      title: "Health Analytics",
      description: "Get insights into your nutrition habits with detailed analytics.",
      icon: Heart
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar>
        <div className="flex-1 max-w-2xl mx-4">
          <GlobalSearch 
            onSelectIngredient={handleSelectIngredient}
            onSearchReset={handleSearchReset}
            displayValue=""
            className="w-full"
            compact={true}
          />
        </div>
      </Navbar>
      
      <main className="flex-1">
        <Hero />
        
        {/* Technical Stats Section */}
        <TechnicalStats />
        
        {/* Features Section */}
        <section 
          className="bg-secondary/30"
          style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
        >
          <Container size="full" className="px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to track your nutrition and discover healthy food options.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </Container>
        </section>
        
        {/* Map Preview Section */}
        <section style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}>
          <Container size="full" className="px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 animate-slide-up">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                  Location Services
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Healthy Options Nearby</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Discover restaurants, grocery stores, and more with our interactive map. Filter by dietary preferences and see nutrition information before you go.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <MapPinned className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Location-Based Recommendations</h4>
                      <p className="text-muted-foreground">Get personalized recommendations based on your location.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Filter className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Advanced Filtering</h4>
                      <p className="text-muted-foreground">Filter by cuisine, dietary restrictions, and nutritional content.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    to="/map"
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover-scale"
                  >
                    Explore Map
                    <MapPin className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 animate-scale-in">
                <div className="glass rounded-2xl p-3 border border-gray-200/30 shadow-xl">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-primary opacity-20" />
                        </div>
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute left-1/4 top-1/3 w-2 h-2 bg-primary rounded-full" />
                          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full" />
                          <div className="absolute left-2/3 top-1/4 w-2 h-2 bg-primary rounded-full" />
                          <div className="absolute left-1/3 top-2/3 w-2 h-2 bg-primary rounded-full" />
                          <div className="absolute left-3/4 top-3/4 w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <div className="absolute bottom-5 left-5 glass rounded-lg p-3 bg-white/90">
                          <div className="text-sm font-medium">Nearby Healthy Options</div>
                          <div className="text-xs text-muted-foreground mt-1">15 locations found</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section 
          className="bg-primary/5"
          style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
        >
          <Container size="full" className="px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your nutrition?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who are already tracking their nutrition and discovering healthy food options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/nutrition"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover-scale"
                >
                  Start Tracking Now
                </Link>
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-foreground rounded-lg font-medium hover:bg-secondary transition-colors border border-border hover-scale"
                >
                  Learn More
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
