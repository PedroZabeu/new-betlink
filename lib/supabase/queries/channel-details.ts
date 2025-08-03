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
        channel_metrics(*),
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
    
    return { data: channel as ChannelFullDetails, error: null };
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
    const { data, error } = await supabase
      .from('channel_metrics')
      .select('*')
      .eq('channel_id', channelId)
      .eq('time_window', timeWindow)
      .single();
      
    if (error) {
      logger.error('Failed to fetch channel metrics by period', error, { channelId, timeWindow });
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    logger.error('Unexpected error fetching channel metrics', error as Error, { channelId, timeWindow });
    return { data: null, error };
  }
}