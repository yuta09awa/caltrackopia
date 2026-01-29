import { useState } from "react";
import { AlertCircle, CheckCircle, Leaf, MapPin, Search, Shield, Utensils, ShoppingBag } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const PlatformDemo = () => {
  const [activeTab, setActiveTab] = useState(3);

  const tabs = [
    { id: "supply-chain", label: "Source Transparency", icon: Leaf },
    { id: "allergens", label: "Allergen Safety", icon: Shield },
    { id: "nutrition", label: "Full Ingredients", icon: Utensils },
    { id: "search", label: "Find Your Food", icon: Search },
  ];

  const demoContent = [
    // Source Transparency
    {
      title: "Traceability for Everyone",
      description: "Know exactly where ingredients come from",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Sunrise Valley Farm</div>
              <div className="text-sm text-muted-foreground">Organic • 12 miles away • Since 2019</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">Verified Source</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">Supplying 12 local restaurants</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Allergen Safety
    {
      title: "Safety Standardized",
      description: "Protocols displayed clearly for any venue",
      content: (
        <div className="space-y-4">
          {[
            { allergen: "Gluten", risk: "Low", color: "green", protocol: "Dedicated gluten-free prep area" },
            { allergen: "Peanuts", risk: "Medium", color: "yellow", protocol: "Separate fryer, shared kitchen" },
            { allergen: "Shellfish", risk: "High", color: "red", protocol: "Same prep surfaces, thorough cleaning" },
          ].map((item) => (
            <div key={item.allergen} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <div className={`w-3 h-3 rounded-full ${
                item.color === "green" ? "bg-green-500" :
                item.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.allergen}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.color === "green" ? "bg-green-500/10 text-green-600" :
                    item.color === "yellow" ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"
                  }`}>
                    {item.risk} Risk
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{item.protocol}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    // Full Ingredients
    {
      title: "Beyond Calorie Counting",
      description: "Full ingredient lists and micronutrients",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Grilled Salmon Bowl</div>
              <div className="text-sm text-muted-foreground">520 cal</div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "Protein", value: "42g" },
                { label: "Carbs", value: "38g" },
                { label: "Fat", value: "18g" },
                { label: "Fiber", value: "6g" },
              ].map((macro) => (
                <div key={macro.label} className="text-center p-2 rounded-lg bg-background">
                  <div className="text-lg font-bold text-primary">{macro.value}</div>
                  <div className="text-xs text-muted-foreground">{macro.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data Sources</div>
              {[
                { source: "USDA Database", confidence: "98%", icon: CheckCircle },
                { source: "Restaurant Verified", confidence: "95%", icon: CheckCircle },
                { source: "AI Vision Analysis", confidence: "87%", icon: AlertCircle },
              ].map((source) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <source.icon className={`w-4 h-4 ${source.confidence === "87%" ? "text-yellow-500" : "text-green-500"}`} />
                    <span>{source.source}</span>
                  </div>
                  <span className="text-muted-foreground">{source.confidence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    // Find Your Food
    {
      title: "One Search. Every Option.",
      description: "Restaurants, groceries, and D2C products in one view.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">"Organic gluten-free snacks"</span>
          </div>
          {[
            { name: "Green Kitchen", type: "Restaurant", distance: "0.3 mi", icon: MapPin, color: "text-primary" },
            { name: "Valley Hive Honey", type: "Direct Brand", distance: "Ships Nationwide", icon: ShoppingBag, color: "text-orange-500" },
            { name: "Whole Foods Market", type: "Grocery", distance: "0.7 mi", icon: MapPin, color: "text-green-600" },
          ].map((result, i) => (
            <div 
              key={result.name} 
              className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors cursor-pointer animate-fade-in" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <result.icon className={`w-6 h-6 ${result.color}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-muted-foreground">{result.type} • {result.distance}</div>
              </div>
              <div className="text-sm font-medium text-primary">View</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section 
      className="relative bg-gradient-to-b from-background via-secondary/20 to-background"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Utensils className="w-4 h-4" />
            Platform Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            See How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            One platform for restaurants, products, and producers. Same transparency standard everywhere.
          </p>
        </div>

        {/* Demo Container */}
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === index
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Demo Content */}
          <div className="relative rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{demoContent[activeTab].title}</h3>
              <p className="text-muted-foreground">{demoContent[activeTab].description}</p>
            </div>
            <div className="min-h-[300px]">
              {demoContent[activeTab].content}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PlatformDemo;
