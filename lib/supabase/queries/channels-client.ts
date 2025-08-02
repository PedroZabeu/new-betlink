import { createClient } from '@/lib/supabase/client';

export async function getAllChannels() {
  const supabase = createClient();
  
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
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('channels')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getChannelTagsCount() {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('channel_tags')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getChannelMetricsCount() {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('channel_metrics')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}

export async function getSubscriptionPlansCount() {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('subscription_plans')
    .select('*', { count: 'exact', head: true });
    
  return { count, error };
}