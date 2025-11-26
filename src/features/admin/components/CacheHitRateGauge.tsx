import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CacheHitRateGaugeProps {
  hitRate: number;
}

export function CacheHitRateGauge({ hitRate }: CacheHitRateGaugeProps) {
  const data = [
    { name: "Hits", value: hitRate },
    { name: "Misses", value: 100 - hitRate },
  ];

  const colors = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Hit Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            hits: { label: "Hits", color: "hsl(var(--primary))" },
            misses: { label: "Misses", color: "hsl(var(--muted))" },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="text-center mt-4">
          <div className="text-3xl font-bold">{hitRate.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
        </div>
      </CardContent>
    </Card>
  );
}
