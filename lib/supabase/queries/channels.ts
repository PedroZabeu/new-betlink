import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

// Types for Supabase data
export interface ChannelWithDetails {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  is_premium: boolean;
  subscribers_count: number;
  max_subscribers: number;
  created_at: string;
  updated_at: string;
  channel_tags: ChannelTag[];
  channel_metrics: ChannelMetric[];
  subscription_plans: SubscriptionPlan[];
  channel_tipsters: ChannelTipster[];
}

export interface ChannelTipster {
  id: number;
  channel_id: number;
  user_id: string;
  joined_at: string;
  profiles: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ChannelTag {
  id: number;
  channel_id: number;
  sport: string;
  bookmaker: string;
  method: string;
  market: string;
  liquidity: string;
}

export interface ChannelMetric {
  id: number;
  channel_id: number;
  time_window: string;
  roi: number;
  profit_units: number | null;
  mdd: number | null;
  win_rate: number | null;
  avg_odds: number | null;
  total_bets: number | null;
  volume_units: number | null;
  rating: number;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: number;
  channel_id: number;
  name: string;
  price: number;
  duration_days: number;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getChannelsWithDetails(timeWindow: string = '30d') {
  try {
    const supabase = await createClient();
    
    // First, get channels with basic info
    const { data: channels, error: channelsError } = await supabase
      .from('channels')
      .select(`
        *,
        channel_tags(*),
        subscription_plans(*),
        channel_tipsters(
          id,
          channel_id,
          user_id,
          joined_at,
          profiles(
            id,
            name,
            email
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (channelsError) {
      logger.error('Failed to fetch channels', channelsError, {
        function: 'getChannelsWithDetails'
      });
      throw channelsError;
    }

    // Then, get live metrics from the view (no time_window filter needed anymore)
    const { data: liveMetrics, error: metricsError } = await supabase
      .from('channel_metrics_live')
      .select('*');

    if (metricsError) {
      logger.error('Failed to fetch live metrics', metricsError, {
        function: 'getChannelsWithDetails'
      });
      // Continue without live metrics, use fallback
    }

    // Merge live metrics with channels
    const channelsWithMetrics = channels?.map(channel => {
      const metrics = liveMetrics?.find(m => m.channel_id === channel.id);
      
      // Select metrics based on timeWindow parameter with defaults
      let roi = 0, profit = 0, mdd = 0, hitRate = 0, volume = 0;
      if (metrics) {
        // Debug log
        logger.info('Processing metrics for timeWindow', { 
          timeWindow, 
          channelId: metrics.channel_id,
          hasMetrics: !!metrics 
        });
        
        switch(timeWindow) {
          case '7d':
            roi = Number(metrics.roi_7d) || 0;
            profit = Number(metrics.profit_7d) || 0;
            mdd = Number(metrics.mdd_7d) || 0;
            hitRate = Number(metrics.hit_rate_7d) || 0;
            volume = Number(metrics.volume_7d) || 0;
            break;
          case '30d':
            roi = Number(metrics.roi_30d) || 0;
            profit = Number(metrics.profit_30d) || 0;
            mdd = Number(metrics.mdd_30d) || 0;
            hitRate = Number(metrics.hit_rate_30d) || 0;
            volume = Number(metrics.volume_30d) || 0;
            break;
          case '3m':
          case '180d':
            // Use 12m data for 3m/6m (we don't have specific 3m data)
            roi = Number(metrics.roi_12m) || 0;
            profit = Number(metrics.profit_12m) || 0;
            mdd = Number(metrics.mdd_12m) || 0;
            hitRate = Number(metrics.hit_rate_12m) || 0;
            volume = Number(metrics.volume_12m) || 0;
            break;
          case '6m':
            // Use 12m data for 6m
            roi = Number(metrics.roi_12m) || 0;
            profit = Number(metrics.profit_12m) || 0;
            mdd = Number(metrics.mdd_12m) || 0;
            hitRate = Number(metrics.hit_rate_12m) || 0;
            volume = Number(metrics.volume_12m) || 0;
            break;
          case 'ytd':
          case 'YTD':
            // Use 12m data for YTD (year to date)
            roi = Number(metrics.roi_12m) || 0;
            profit = Number(metrics.profit_12m) || 0;
            mdd = Number(metrics.mdd_12m) || 0;
            hitRate = Number(metrics.hit_rate_12m) || 0;
            volume = Number(metrics.volume_12m) || 0;
            break;
          case '12m':
            roi = Number(metrics.roi_12m) || 0;
            profit = Number(metrics.profit_12m) || 0;
            mdd = Number(metrics.mdd_12m) || 0;
            hitRate = Number(metrics.hit_rate_12m) || 0;
            volume = Number(metrics.volume_12m) || 0;
            break;
          case 'all':
            roi = Number(metrics.roi_all_time) || 0;
            profit = Number(metrics.profit_all_time) || 0;
            mdd = Number(metrics.mdd_all_time) || 0;
            hitRate = Number(metrics.hit_rate_all_time) || 0;
            volume = Number(metrics.volume_all_time) || 0;
            break;
          default:
            // Fallback to 30d for any unknown timeWindow
            logger.warn('Unknown timeWindow, using 30d as fallback', { timeWindow });
            roi = Number(metrics.roi_30d) || 0;
            profit = Number(metrics.profit_30d) || 0;
            mdd = Number(metrics.mdd_30d) || 0;
            hitRate = Number(metrics.hit_rate_30d) || 0;
            volume = Number(metrics.volume_30d) || 0;
        }
      }
      
      // Transform live metrics to match expected format
      const transformedMetrics = metrics ? [{
        id: 0, // Dummy ID for compatibility
        channel_id: metrics.channel_id,
        time_window: timeWindow,
        roi: roi,
        profit_units: profit,
        mdd: mdd,
        avg_odds: Number(metrics.avg_odd) || 0,
        volume_units: volume, // Now using actual stake volume
        total_bets: metrics.total_tips || 0,
        rating: Math.min(5, Math.max(1, 3 + (roi / 20))), // Calculate rating based on ROI (1-5 scale)
        win_rate: hitRate
      }] : [];

      return {
        ...channel,
        channel_metrics: transformedMetrics.length > 0 ? transformedMetrics : [{
          id: 0,
          channel_id: channel.id,
          time_window: '30d',
          roi: 0,
          profit_units: 0,
          mdd: 0,
          avg_odds: 0,
          volume_units: 0,
          total_bets: 0,
          rating: 3,
          win_rate: 0
        }]
      };
    });

    return { data: channelsWithMetrics as ChannelWithDetails[] | null, error: null };
  } catch (error) {
    logger.error('Unexpected error in getChannelsWithDetails', error as Error);
    return { data: null, error: error as Error };
  }
}

export async function getAllChannels() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_tags(*),
      channel_metrics(*),
      subscription_plans(*)
    `)
    .order('id');
    
  return { data, error };
}

export async function getChannelCount() {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('channels')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getChannelTagsCount() {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('channel_tags')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getChannelMetricsCount() {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('channel_metrics')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getSubscriptionPlansCount() {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('subscription_plans')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}