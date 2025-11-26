import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RegionData {
  region: string;
  requests: number;
  avgLatency: number;
  p95Latency: number;
}

interface RegionPerformanceTableProps {
  data: RegionData[];
}

export function RegionPerformanceTable({ data }: RegionPerformanceTableProps) {
  const getLatencyBadge = (latency: number) => {
    if (latency < 100) return <Badge>Fast</Badge>;
    if (latency < 300) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Slow</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Edge Region</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Avg Latency (ms)</TableHead>
              <TableHead className="text-right">P95 Latency (ms)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No regional data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((region) => (
                <TableRow key={region.region}>
                  <TableCell className="font-medium">{region.region}</TableCell>
                  <TableCell className="text-right">{region.requests.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{region.avgLatency.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{region.p95Latency.toFixed(1)}</TableCell>
                  <TableCell>{getLatencyBadge(region.avgLatency)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
