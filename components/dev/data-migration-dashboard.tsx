'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MigrationProgress } from '@/components/dev/migration-progress';
import { SyncStatusBadge } from '@/components/dev/sync-status-badge';
import { DataComparisonTable } from '@/components/dev/data-comparison-table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockChannels } from '@/lib/data/mock-channels';
import { 
  getAllChannels, 
  getChannelCount, 
  getChannelTagsCount,
  getChannelMetricsCount,
  getSubscriptionPlansCount 
} from '@/lib/supabase/queries/channels-client';
import { compareChannelData, calculateOverallSync } from '@/lib/utils/data-comparison';
import { generateSlug } from '@/lib/utils/slug';

interface MigrationStats {
  channels: { expected: number; actual: number };
  tags: { expected: number; actual: number };
  metrics: { expected: number; actual: number };
  plans: { expected: number; actual: number };
}

export function DataMigrationDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MigrationStats>({
    channels: { expected: 12, actual: 0 },
    tags: { expected: 12, actual: 0 },
    metrics: { expected: 72, actual: 0 },
    plans: { expected: 27, actual: 0 }, // Ajustado para o valor real
  });
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [overallSync, setOverallSync] = useState({
    overallPercentage: 0,
    fullySyncedCount: 0,
    totalChannels: 0,
    totalFields: 0,
    matchedFields: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch counts
      const [channelsCount, tagsCount, metricsCount, plansCount] = await Promise.all([
        getChannelCount(),
        getChannelTagsCount(),
        getChannelMetricsCount(),
        getSubscriptionPlansCount(),
      ]);

      // Update stats
      setStats({
        channels: { expected: 12, actual: channelsCount.count || 0 },
        tags: { expected: 12, actual: tagsCount.count || 0 },
        metrics: { expected: 72, actual: metricsCount.count || 0 },
        plans: { expected: 27, actual: plansCount.count || 0 }, // Ajustado para o valor real
      });

      // Fetch full channel data for comparison
      const { data: dbChannels, error: channelsError } = await getAllChannels();
      
      if (channelsError) {
        throw new Error(channelsError.message);
      }

      if (dbChannels && dbChannels.length > 0) {
        // Compare each channel
        const channelComparisons = mockChannels.map(mockChannel => {
          const expectedSlug = generateSlug(mockChannel.name);
          
          const dbChannel = dbChannels.find(
            db => db.slug === expectedSlug
          );
          
          // Channel not found - handled by compareChannelData
          
          return compareChannelData(mockChannel, dbChannel);
        });

        setComparisons(channelComparisons);
        setOverallSync(calculateOverallSync(channelComparisons));
      }
    } catch (err) {
      console.error('Error loading migration data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load migration data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const isFullyMigrated = overallSync.overallPercentage === 100;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overall Sync Status</CardTitle>
            <SyncStatusBadge 
              status={isFullyMigrated ? 'synced' : 'partial'} 
              percentage={!isFullyMigrated ? overallSync.overallPercentage : undefined}
            />
          </div>
        </CardHeader>
        <CardContent>
          <MigrationProgress 
            percentage={overallSync.overallPercentage} 
            label="Overall Synchronization"
            className="mb-4"
          />
          
          {isFullyMigrated ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All data is fully synchronized! Mock data matches database perfectly.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-sm text-muted-foreground">
              {overallSync.matchedFields} of {overallSync.totalFields} fields matched across {overallSync.totalChannels} channels
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([table, counts]) => {
          const percentage = counts.expected > 0 
            ? Math.round((counts.actual / counts.expected) * 100) 
            : 0;
          const isComplete = counts.actual === counts.expected;
          
          return (
            <Card key={table}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">
                    {table === 'metrics' ? 'Channel Metrics' : 
                     table === 'tags' ? 'Channel Tags' :
                     table === 'plans' ? 'Subscription Plans' : 
                     'Channels'}
                  </CardTitle>
                  <SyncStatusBadge 
                    status={isComplete ? 'synced' : 'partial'} 
                    percentage={!isComplete ? percentage : undefined}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {counts.actual} / {counts.expected}
                </div>
                <MigrationProgress 
                  percentage={percentage} 
                  showPercentage={false}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      {comparisons.length > 0 && (
        <DataComparisonTable comparisons={comparisons} />
      )}
    </div>
  );
}