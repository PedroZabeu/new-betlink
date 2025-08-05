import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
  calculateSummaryMetrics, 
  calculateTimelineMetrics, 
  getStartDateForPeriod 
} from '@/lib/utils/metrics-calculator';
import { Tip } from '@/lib/types/tip';

/**
 * Hook unificado para métricas de canal
 * FONTE ÚNICA DE VERDADE para todos os componentes
 */
export function useUnifiedChannelMetrics(
  channelId: number,
  period: '7d' | '30d' | '3m' | '6m' | '12m' | 'ytd' | 'all' = '30d'
) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  const QUERY_KEY = ['channel', 'metrics', channelId, period];
  
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // 1. Buscar tips do período
      const startDate = getStartDateForPeriod(period);
      const { data: tips, error } = await supabase
        .from('tips')
        .select('*')
        .eq('channel_id', channelId)
        .gte('event_date', startDate)
        .in('status', ['green', 'half_green', 'red', 'half_red'])
        .order('event_date', { ascending: true });
      
      if (error) {
        console.error('[Feature 2.19] Error fetching tips:', error);
        throw error;
      }
      
      const typedTips = (tips || []) as Tip[];
      
      // 2. Calcular métricas summary
      let summary;
      let timeline;
      
      try {
        summary = calculateSummaryMetrics(typedTips);
      } catch (summaryError) {
        throw summaryError;
      }
      
      // 3. Calcular timeline para gráfico
      try {
        timeline = calculateTimelineMetrics(typedTips);
      } catch (timelineError) {
        throw timelineError;
      }
      
      return { 
        summary, 
        timeline,
        tips: typedTips 
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)
  });
}

/**
 * Invalida o cache de métricas de um canal
 */
export function useInvalidateChannelMetrics() {
  const queryClient = useQueryClient();
  
  return (channelId: number) => {
    queryClient.invalidateQueries({
      queryKey: ['channel', 'metrics', channelId]
    });
  };
}