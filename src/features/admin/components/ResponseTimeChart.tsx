import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface ResponseTimeChartProps {
  data: Array<{
    timestamp: string;
    p50: number;
    p95: number;
    p99: number;
  }>;
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time (ms)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            p50: { label: "P50", color: "hsl(var(--primary))" },
            p95: { label: "P95", color: "hsl(var(--secondary))" },
            p99: { label: "P99", color: "hsl(var(--accent))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="timestamp" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip />
              <Line type="monotone" dataKey="p50" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="p95" stroke="hsl(var(--secondary))" strokeWidth={2} />
              <Line type="monotone" dataKey="p99" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
