import { createClient } from '@/lib/supabase/server';
import { ChannelMetricsLive } from '@/lib/types/tip';
import { logger } from '@/lib/utils/logger';

export async function getChannelMetricsLive(
  channelId?: number,
  timeWindow?: string
): Promise<ChannelMetricsLive[]> {
  const supabase = await createClient();

  try {
    let query = supabase
      .from('channel_metrics_live')
      .select('*');

    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    if (timeWindow) {
      query = query.eq('time_window', timeWindow);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to fetch channel metrics live', error, { channelId, timeWindow });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Error in getChannelMetricsLive', error as Error, { channelId, timeWindow });
    return [];
  }
}

export async function hasChannelTips(channelId: number): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { count, error } = await supabase
      .from('tips')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channelId)
      .in('status', ['win', 'loss']);

    if (error) {
      logger.error('Failed to check channel tips', error, { channelId });
      return false;
    }

    return (count || 0) > 0;
  } catch (error) {
    logger.error('Error in hasChannelTips', error as Error, { channelId });
    return false;
  }
}