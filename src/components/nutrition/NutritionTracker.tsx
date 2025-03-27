
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Plus, Search, ListFilter, Utensils, Apple, ArrowRight } from "lucide-react";

// Mock nutrition data
const mockNutritionData = [
  { name: "Protein", value: 30, color: "#4f46e5" },
  { name: "Carbs", value: 45, color: "#06b6d4" },
  { name: "Fat", value: 25, color: "#f59e0b" },
];

// Mock recent foods
const mockRecentFoods = [
  { id: "1", name: "Greek Yogurt", calories: 120, protein: 15, carbs: 5, fat: 0 },
  { id: "2", name: "Chicken Salad", calories: 350, protein: 25, carbs: 15, fat: 20 },
  { id: "3", name: "Protein Smoothie", calories: 220, protein: 20, carbs: 25, fat: 5 },
  { id: "4", name: "Avocado Toast", calories: 280, protein: 10, carbs: 30, fat: 15 },
];

const NutritionTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const totalCalories = 1850;
  const calorieGoal = 2000;
  const caloriesRemaining = calorieGoal - totalCalories;
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calories Summary */}
        <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Today's Summary</h3>
          <div className="aspect-square flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: totalCalories }, { value: caloriesRemaining }]}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e5e7eb" />
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as { cx: number; cy: number };
                      return (
                        <>
                          <text
                            x={cx}
                            y={cy - 10}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-3xl font-bold"
                            fill="#0f172a"
                          >
                            {totalCalories}
                          </text>
                          <text
                            x={cx}
                            y={cy + 20}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-sm"
                            fill="#64748b"
                          >
                            of {calorieGoal} cal
                          </text>
                        </>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Remaining</p>
              <p className="font-medium">{caloriesRemaining} cal</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Goal</p>
              <p className="font-medium">{calorieGoal} cal</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Consumed</p>
              <p className="font-medium">{totalCalories} cal</p>
            </div>
          </div>
        </div>
        
        {/* Macros Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Macros Breakdown</h3>
          <div className="flex items-center justify-center h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockNutritionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + outerRadius;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fill={mockNutritionData[index].color}
                        fontWeight="500"
                      >
                        {`${mockNutritionData[index].name} ${value}%`}
                      </text>
                    );
                  }}
                >
                  {mockNutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {mockNutritionData.map((macro) => (
              <div key={macro.name} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-1" 
                  style={{ backgroundColor: macro.color }}
                ></div>
                <p className="text-muted-foreground text-xs">{macro.name}</p>
                <p className="font-medium">{macro.value}%</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Add */}
        <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Quick Add</h3>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search for foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <button className="w-full py-2 px-3 text-left rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
              <Apple className="h-4 w-4 text-primary" />
              <span>Add a food item</span>
            </button>
            <button className="w-full py-2 px-3 text-left rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              <span>Add a recipe</span>
            </button>
          </div>
          <div className="mt-6">
            <button className="w-full py-2 bg-primary text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Meal</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Foods */}
      <div className="mt-6 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-medium">Recent Foods</h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {mockRecentFoods.map((food) => (
            <div key={food.id} className="px-6 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div>
                <p className="font-medium">{food.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>{food.protein}g protein</span>
                  <span>{food.carbs}g carbs</span>
                  <span>{food.fat}g fat</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium">{food.calories} cal</span>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-muted/10 border-t border-border">
          <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1">
            View All History
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
