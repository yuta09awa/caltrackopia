import { Package, TrendingUp, ShoppingBag } from "lucide-react";
import Container from "@/components/ui/Container";
import { SPACING } from "@/constants/spacing";

const D2CSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: SPACING.section.py, paddingBottom: SPACING.section.py }}
    >
      <Container size="full" className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
              <Package className="w-4 h-4" />
              Beyond Restaurants
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Direct From Source to You.
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                The Future of Food Commerce.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              The same transparency engine that powers our restaurant discovery works for any food product. We're building the infrastructure that connects every type of food source—from local farms to D2C brands—with every type of eater.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$195B</div>
                <div className="text-sm font-medium text-foreground">D2C Food Market</div>
                <div className="text-xs text-muted-foreground mt-1">Growing 15% YoY</div>
              </div>
              <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">3x</div>
                <div className="text-sm font-medium text-foreground">Higher Margins</div>
                <div className="text-xs text-muted-foreground mt-1">Vs. Traditional Retail</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-foreground">Investor Note: Infrastructure Play</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We're not just a directory. We are the transaction layer for verified food commerce. Restaurants today. CPG and D2C tomorrow. Grocery integration next.
              </p>
            </div>
          </div>

          {/* Visual Mockup */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl blur-3xl -z-10" />

            <div className="space-y-4">
              {/* Card 1: Restaurant */}
              <div className="p-4 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🥗</div>
                  <div>
                    <div className="font-semibold">Green Roots Cafe</div>
                    <div className="text-sm text-muted-foreground">Restaurant • 0.8 mi</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">Gluten Free Kitchen</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">Local Sourcing</span>
                </div>
              </div>

              {/* Card 2: D2C Product (Highlighted) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/30 shadow-xl relative">
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold shadow-lg">
                  D2C
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🍯</div>
                  <div>
                    <div className="font-semibold">Valley Hive Honey</div>
                    <div className="text-sm text-muted-foreground">Direct to Consumer</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Sourcing</div>
                    <div className="font-medium">Single Origin, CA</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Allergens</div>
                    <div className="font-medium">Nut-Free Facility</div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors">
                  Order Direct • $14.00
                </button>
              </div>

              {/* Card 3: Farm */}
              <div className="p-4 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🥬</div>
                  <div>
                    <div className="font-semibold">River Bend Farms</div>
                    <div className="text-sm text-muted-foreground">Local Producer • CSA Box</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">Organic Certified</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">Pesticide Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default D2CSection;
