'use client';

import { useState } from 'react';
import { ChannelDetail, TimeWindow } from '@/lib/types/channel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceChartProps {
  channel: ChannelDetail;
}

const periodOptions: { value: TimeWindow; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '180d', label: '6 meses' },
  { value: 'YTD', label: 'Ano atual' },
  { value: 'all', label: 'Todo período' }
];

export default function PerformanceChart({ channel }: PerformanceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimeWindow>('30d');
  const chartData = channel.detailedMetrics[selectedPeriod].chartData;
  
  // Format data for display
  const formattedData = chartData.map(point => ({
    ...point,
    displayDate: format(new Date(point.date), 'dd/MM', { locale: ptBR })
  }));
  
  // Show fewer points for longer periods
  const dataToShow = selectedPeriod === 'all' || selectedPeriod === 'YTD' || selectedPeriod === '180d'
    ? formattedData.filter((_, index) => index % 7 === 0) // Show weekly points
    : formattedData;
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium">
            {format(new Date(data.date), "d 'de' MMMM", { locale: ptBR })}
          </p>
          <p className="text-sm">
            Lucro Acumulado: <span className={`font-bold ${data.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.value > 0 ? '+' : ''}{data.value.toFixed(1)}u
            </span>
          </p>
          <p className="text-sm">
            Lucro do Dia: <span className={`font-medium ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profit > 0 ? '+' : ''}{data.profit.toFixed(1)}u
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evolução do Bankroll</CardTitle>
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataToShow} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="displayDate" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => `${value}u`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="currentColor" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Período: {periodOptions.find(p => p.value === selectedPeriod)?.label}
          </span>
          <span>
            Lucro Total: <span className={`font-bold ${channel.detailedMetrics[selectedPeriod].profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {channel.detailedMetrics[selectedPeriod].profit > 0 ? '+' : ''}
              {channel.detailedMetrics[selectedPeriod].profit.toFixed(1)}u
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}