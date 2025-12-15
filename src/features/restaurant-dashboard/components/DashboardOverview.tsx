import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, CheckCircle, TrendingUp, Package, Plus, Upload } from 'lucide-react';
import type { MenuStats } from '../types';

interface DashboardOverviewProps {
  stats: MenuStats;
  isLoading: boolean;
  onAddItem: () => void;
  onUploadMenu: () => void;
}

export default function DashboardOverview({ 
  stats, 
  isLoading, 
  onAddItem, 
  onUploadMenu 
}: DashboardOverviewProps) {
  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      description: 'Menu items in your catalog',
    },
    {
      title: 'Available',
      value: stats.availableItems,
      icon: UtensilsCrossed,
      description: 'Currently available items',
    },
    {
      title: 'Verified Nutrition',
      value: stats.verifiedItems,
      icon: CheckCircle,
      description: 'High confidence data (≥85%)',
    },
    {
      title: 'Avg. Confidence',
      value: `${Math.round(stats.averageConfidence * 100)}%`,
      icon: TrendingUp,
      description: 'Data quality score',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '—' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
          <Button variant="outline" onClick={onUploadMenu}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Menu PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
