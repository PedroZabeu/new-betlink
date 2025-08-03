'use client';

import { useState } from 'react';
import { ChannelDetail, TimeWindow } from '@/lib/types/channel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Target, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  channel: ChannelDetail;
}

const periodOptions: { value: TimeWindow; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: 'ytd', label: 'Ano atual' },
  { value: '12m', label: '12 meses' },
  { value: 'all', label: 'Todo período' }
];

export default function MetricsCard({ channel }: MetricsCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimeWindow>('30d');
  const metrics = channel.detailedMetrics[selectedPeriod];
  
  const metricItems = [
    {
      label: 'ROI',
      value: `${metrics.roi > 0 ? '+' : ''}${metrics.roi}%`,
      icon: metrics.roi > 0 ? TrendingUp : TrendingDown,
      color: metrics.roi > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: metrics.roi > 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      label: 'Lucro',
      value: `${metrics.profit > 0 ? '+' : ''}${metrics.profit.toFixed(1)}u`,
      icon: metrics.profit > 0 ? TrendingUp : TrendingDown,
      color: metrics.profit > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: metrics.profit > 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      label: 'Taxa de Acerto',
      value: `${metrics.winRate}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Unidades Apostadas',
      value: `${metrics.volumeUnits}u`,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Odds Média',
      value: metrics.avgOdds.toFixed(2),
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Max Drawdown',
      value: `${metrics.maxDrawdown}u`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Métricas de Performance</CardTitle>
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimeWindow)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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