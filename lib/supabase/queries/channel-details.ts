import { createClient } from '@/lib/supabase/server';
import { ChannelWithDetails } from './channels';
import { logger } from '@/lib/utils/logger';

export interface ChannelFullDetails extends ChannelWithDetails {
  channel_tipsters: {
    user: {
      id: string;
      name: string;
      telegram: string | null;
    };
    role: string;
  }[];
  // Adicionaremos reviews e tips no futuro
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
        channel_tipsters(
          role,
          user:profiles(id, name, telegram)
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