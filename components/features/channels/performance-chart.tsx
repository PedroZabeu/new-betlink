'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUnifiedChannelMetrics } from '@/lib/hooks/useUnifiedChannelMetrics';
import { getPeriodLabel } from '@/lib/utils/metrics-calculator';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceChartProps {
  channelId: number;
  period: string;
  className?: string;
}

// Skeleton do gráfico
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

// Tooltip customizado estilo stock market
function CustomStockTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const value = data.cumulativeProfit;
  const roi = data.cumulativeROI;
  
  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="text-sm text-muted-foreground">
        {format(new Date(label), "dd 'de' MMMM, yyyy", { locale: ptBR })}
      </p>
      <p className="font-semibold">
        {value >= 0 ? '+' : ''}{value.toFixed(2)} unidades
      </p>
      <p className="text-sm text-muted-foreground">
        ROI: {roi.toFixed(2)}%
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {data.dailyTips} tips no dia
      </p>
    </div>
  );
}

export function PerformanceChart({ channelId, period, className }: PerformanceChartProps) {
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period as any);
  
  // Calcular valores para o header
  const chartData = useMemo(() => {
    if (!data?.timeline || data.timeline.length === 0) return null;
    
    const lastValue = data.timeline[data.timeline.length - 1]?.cumulativeProfit || 0;
    const firstValue = data.timeline[0]?.cumulativeProfit || 0;
    const profitChange = lastValue - firstValue;
    const profitChangePercent = firstValue !== 0 ? (profitChange / Math.abs(firstValue)) * 100 : 0;
    
    // Para o cálculo correto quando começamos do zero
    const actualChangePercent = data.summary.totalStake > 0 
      ? (data.summary.profit / data.summary.totalStake) * 100 
      : 0;
    
    return {
      timeline: data.timeline,
      lastValue,
      profitChange,
      profitChangePercent: actualChangePercent,
      isPositive: profitChange >= 0
    };
  }, [data]);
  
  if (isLoading) return <ChartSkeleton />;
  
  if (!chartData || !data?.timeline || data.timeline.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <p>Nenhuma tip encontrada para o período selecionado.</p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header estilo Stock Market */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {chartData.lastValue >= 0 ? '+' : ''}{chartData.lastValue.toFixed(2)} un
          </span>
          <span className={cn(
            "flex items-center gap-1 text-sm font-medium",
            chartData.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {chartData.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {chartData.profitChange >= 0 ? '+' : ''}{chartData.profitChange.toFixed(2)} 
            ({chartData.profitChangePercent >= 0 ? '+' : ''}{chartData.profitChangePercent.toFixed(2)}%)
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {getPeriodLabel(period)} • ROI: {data?.summary.roi.toFixed(2)}%
        </p>
      </div>
      
      {/* Gráfico estilo Apple Stocks */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData.timeline}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={chartData.isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={chartData.isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
            stroke="#888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#888"
            fontSize={12}
            tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value}`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomStockTooltip />}
            cursor={{ stroke: '#888', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="cumulativeProfit"
            stroke={chartData.isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}