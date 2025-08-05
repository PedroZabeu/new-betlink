'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricsCard from './metrics-card';
import { PerformanceChart } from '@/components/features/channels/performance-chart';
import { PeriodSelector } from '@/components/features/channels/period-selector';

interface ChannelMetricsSectionProps {
  channelId: number;
  channelName: string;
}

export default function ChannelMetricsSection({ channelId, channelName }: ChannelMetricsSectionProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  return (
    <div className="space-y-8" data-channel-id={channelId}>
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Performance do Canal</h2>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>
      
      {/* Metrics and Chart Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <MetricsCard channelId={channelId} period={selectedPeriod} />
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Banca</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart channelId={channelId} period={selectedPeriod} />
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}