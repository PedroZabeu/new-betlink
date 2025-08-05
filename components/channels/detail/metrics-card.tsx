'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedChannelMetrics } from '@/lib/hooks/useUnifiedChannelMetrics';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsCardProps {
  channelId: number;
  period?: string;
}

const periodOptions = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: 'ytd', label: 'Ano atual' },
  { value: '12m', label: '12 meses' },
  { value: 'all', label: 'Todo período' }
];

function MetricsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MetricsCard({ channelId, period = '30d' }: MetricsCardProps) {
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period as any);
  
  if (isLoading) return <MetricsCardSkeleton />;
  
  if (!data || !data.summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhuma tip encontrada para o período selecionado.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { summary } = data;
  
  const metricItems = [
    {
      label: 'ROI',
      value: `${summary.roi > 0 ? '+' : ''}${summary.roi.toFixed(2)}%`,
      icon: summary.roi > 0 ? TrendingUp : TrendingDown,
      color: summary.roi > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary.roi > 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      label: 'Lucro',
      value: `${summary.profit > 0 ? '+' : ''}${summary.profit.toFixed(2)}u`,
      icon: summary.profit > 0 ? TrendingUp : TrendingDown,
      color: summary.profit > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary.profit > 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      label: 'Max Drawdown',
      value: `-${summary.maxDrawdown.toFixed(2)}u`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Unidades Apostadas',
      value: `${summary.totalStake.toFixed(0)}u`,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Odds Média',
      value: summary.avgOdds.toFixed(2),
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Total Tips',
      value: summary.totalTips.toString(),
      icon: Activity,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metricItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded", item.bgColor)}>
                    <Icon className={cn("w-4 h-4", item.color)} />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <p className={cn("text-2xl font-bold", item.color)}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}