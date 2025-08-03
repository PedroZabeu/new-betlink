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
  current_subscribers: number;
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

export async function getChannelsWithDetails() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('channels')
      .select(`
        *,
        channel_tags!inner(*),
        channel_metrics!inner(*),
        subscription_plans!inner(*),
        channel_tipsters!inner(
          id,
          channel_id,
          user_id,
          joined_at,
          profiles!inner(
            id,
            name,
            email
          )
        )
      `)
      .eq('is_active', true)
      .eq('channel_metrics.time_window', '30d') // Use 30d for main display
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch channels with details', error, {
        function: 'getChannelsWithDetails'
      });
      throw error;
    }

    return { data: data as ChannelWithDetails[] | null, error: null };
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