import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import NutritionTracker from "@/components/nutrition/NutritionTracker";
import { Utensils, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const NutritionPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Nutrition Tracker</h1>
            <p className="text-muted-foreground">
              Monitor your daily nutrition intake and track your progress.
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center">
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Today</span>
                </div>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors">
                Weekly Report
              </button>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <NutritionTracker />
          </div>
        </Container>
      </main>
    </div>
  );
};

export default NutritionPage;
