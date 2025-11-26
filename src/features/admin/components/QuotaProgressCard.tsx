import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuotaProgressCardProps {
  service: string;
  used: number;
  limit: number;
  resetAt?: string;
}

export function QuotaProgressCard({ service, used, limit, resetAt }: QuotaProgressCardProps) {
  const percentage = (used / limit) * 100;
  
  const getColorClass = () => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{service}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-bold", getColorClass())}>
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
          <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
        </div>
        <Progress 
          value={percentage} 
          className={cn(
            percentage >= 80 && "[&>div]:bg-red-600",
            percentage >= 50 && percentage < 80 && "[&>div]:bg-yellow-600"
          )}
        />
        {resetAt && (
          <p className="text-xs text-muted-foreground">
            Resets: {new Date(resetAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
