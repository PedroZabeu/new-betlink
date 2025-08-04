import { createClient } from '@/lib/supabase/server';
import { ChannelWithDetails } from './channels';
import { logger } from '@/lib/utils/logger';

export interface ChannelFullDetails extends ChannelWithDetails {
  channel_tipsters: {
    profiles: {
      id: string;
      name: string;
      email: string;
      telegram: string | null;
    };
  }[];
  // Additional fields for future implementation
  about_bio?: string;
  about_methodology?: string;
  about_specialties?: string[];
  about_experience?: string;
  recent_tips?: any[];
  reviews?: any[];
}

export async function getChannelBySlug(slug: string) {
  const supabase = await createClient();
  
  try {
    // Buscar canal com todos os detalhes relacionados
    const { data: channel, error } = await supabase
      .from('channels')
      .select(`
        *,
        channel_tags(*),
        subscription_plans(*),
        channel_tipsters!inner(
          id,
          channel_id,
          user_id,
          joined_at,
          profiles!inner(
            id,
            name,
            email,
            telegram
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (error) {
      logger.error('Failed to fetch channel by slug', error, { slug });
      return { data: null, error };
    }
    
    // Buscar métricas live separadamente
    const { data: liveMetrics } = await supabase
      .from('channel_metrics_live')
      .select('*')
      .eq('channel_id', channel.id)
      .single();
    
    // Transformar métricas live em formato esperado
    const metricsArray = [];
    
    if (liveMetrics) {
      // Criar objetos de métricas para cada período
      const periods = [
        { window: '7d', profit: liveMetrics.profit_7d, roi: liveMetrics.roi_7d, mdd: liveMetrics.mdd_7d, hit_rate: liveMetrics.hit_rate_7d, volume: liveMetrics.volume_7d },
        { window: '30d', profit: liveMetrics.profit_30d, roi: liveMetrics.roi_30d, mdd: liveMetrics.mdd_30d, hit_rate: liveMetrics.hit_rate_30d, volume: liveMetrics.volume_30d },
        { window: '3m', profit: liveMetrics.profit_12m, roi: liveMetrics.roi_12m, mdd: liveMetrics.mdd_12m, hit_rate: liveMetrics.hit_rate_12m, volume: liveMetrics.volume_12m }, // Usar 12m para 3m
        { window: '6m', profit: liveMetrics.profit_12m, roi: liveMetrics.roi_12m, mdd: liveMetrics.mdd_12m, hit_rate: liveMetrics.hit_rate_12m, volume: liveMetrics.volume_12m }, // Usar 12m para 6m
        { window: 'ytd', profit: liveMetrics.profit_12m, roi: liveMetrics.roi_12m, mdd: liveMetrics.mdd_12m, hit_rate: liveMetrics.hit_rate_12m, volume: liveMetrics.volume_12m }, // Usar 12m para YTD
        { window: '12m', profit: liveMetrics.profit_12m, roi: liveMetrics.roi_12m, mdd: liveMetrics.mdd_12m, hit_rate: liveMetrics.hit_rate_12m, volume: liveMetrics.volume_12m },
        { window: 'all', profit: liveMetrics.profit_all_time, roi: liveMetrics.roi_all_time, mdd: liveMetrics.mdd_all_time, hit_rate: liveMetrics.hit_rate_all_time, volume: liveMetrics.volume_all_time }
      ];
      
      periods.forEach(period => {
        metricsArray.push({
          id: 0, // Dummy ID
          channel_id: channel.id,
          time_window: period.window,
          roi: Number(period.roi) || 0,
          profit_units: Number(period.profit) || 0,
          mdd: Number(period.mdd) || 0,
          win_rate: Number(period.hit_rate) || 0,
          avg_odds: Number(liveMetrics.avg_odd) || 0,
          total_bets: liveMetrics.total_tips || 0,
          volume_units: Number(period.volume) || 0,
          rating: Math.min(5, Math.max(1, 3 + (Number(period.roi) / 20))) // Calculate rating based on ROI
        });
      });
    }
    
    // Adicionar métricas ao objeto channel
    const channelWithMetrics = {
      ...channel,
      channel_metrics: metricsArray.length > 0 ? metricsArray : [{
        id: 0,
        channel_id: channel.id,
        time_window: '30d',
        roi: 0,
        profit_units: 0,
        mdd: 0,
        win_rate: 0,
        avg_odds: 0,
        total_bets: 0,
        volume_units: 0,
        rating: 3
      }]
    };
    
    return { data: channelWithMetrics as ChannelFullDetails, error: null };
  } catch (error) {
    logger.error('Unexpected error fetching channel', error as Error, { slug });
    return { data: null, error };
  }
}

// Buscar todos os slugs para generateStaticParams
export async function getAllChannelSlugs() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('channels')
    .select('slug')
    .eq('is_active', true);
    
  if (error) {
    logger.error('Failed to fetch channel slugs', error);
    return [];
  }
  
  return data?.map(channel => channel.slug) || [];
}

// Buscar métricas de um canal por período específico
export async function getChannelMetricsByPeriod(channelId: number, timeWindow: string) {
  const supabase = await createClient();
  
  try {
    const { data: liveMetrics, error } = await supabase
      .from('channel_metrics_live')
      .select('*')
      .eq('channel_id', channelId)
      .single();
      
    if (error) {
      logger.error('Failed to fetch channel metrics by period', error, { channelId, timeWindow });
      return { data: null, error };
    }
    
    // Extrair métricas para o período específico
    let metrics = {
      id: 0,
      channel_id: channelId,
      time_window: timeWindow,
      roi: 0,
      profit_units: 0,
      mdd: 0,
      win_rate: 0,
      avg_odds: Number(liveMetrics?.avg_odd) || 0,
      total_bets: liveMetrics?.total_tips || 0,
      volume_units: 0,
      rating: 3
    };
    
    if (liveMetrics) {
      switch(timeWindow) {
        case '7d':
          metrics.roi = Number(liveMetrics.roi_7d) || 0;
          metrics.profit_units = Number(liveMetrics.profit_7d) || 0;
          metrics.mdd = Number(liveMetrics.mdd_7d) || 0;
          metrics.win_rate = Number(liveMetrics.hit_rate_7d) || 0;
          metrics.volume_units = Number(liveMetrics.volume_7d) || 0;
          break;
        case '30d':
          metrics.roi = Number(liveMetrics.roi_30d) || 0;
          metrics.profit_units = Number(liveMetrics.profit_30d) || 0;
          metrics.mdd = Number(liveMetrics.mdd_30d) || 0;
          metrics.win_rate = Number(liveMetrics.hit_rate_30d) || 0;
          metrics.volume_units = Number(liveMetrics.volume_30d) || 0;
          break;
        case '12m':
        case '3m':
        case '6m':
        case 'ytd':
          metrics.roi = Number(liveMetrics.roi_12m) || 0;
          metrics.profit_units = Number(liveMetrics.profit_12m) || 0;
          metrics.mdd = Number(liveMetrics.mdd_12m) || 0;
          metrics.win_rate = Number(liveMetrics.hit_rate_12m) || 0;
          metrics.volume_units = Number(liveMetrics.volume_12m) || 0;
          break;
        case 'all':
          metrics.roi = Number(liveMetrics.roi_all_time) || 0;
          metrics.profit_units = Number(liveMetrics.profit_all_time) || 0;
          metrics.mdd = Number(liveMetrics.mdd_all_time) || 0;
          metrics.win_rate = Number(liveMetrics.hit_rate_all_time) || 0;
          metrics.volume_units = Number(liveMetrics.volume_all_time) || 0;
          break;
      }
      
      metrics.rating = Math.min(5, Math.max(1, 3 + (metrics.roi / 20)));
    }
    
    return { data: metrics, error: null };
  } catch (error) {
    logger.error('Unexpected error fetching channel metrics', error as Error, { channelId, timeWindow });
    return { data: null, error };
  }
}