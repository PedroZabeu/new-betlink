import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { ChannelsClient } from "@/components/channels/channels-client";
import { getChannelsWithDetails, type ChannelWithDetails } from "@/lib/supabase/queries/channels";
import { getChannelMetricsLive } from "@/lib/queries/channel-metrics-live";
import { logger } from "@/lib/utils/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Transform Supabase data to frontend format
function transformChannelData(channels: ChannelWithDetails[], timeWindow: string = '30d') {
  return channels.map(channel => {
    // Get the live metrics from channel_metrics_live (now includes all periods in one row)
    const metrics = channel.channel_metrics?.[0]; // Only one metrics object now with all periods
    
    // Get first subscription plan for base price
    const basePlan = channel.subscription_plans?.[0];
    
    // Create metrics object with current timeWindow data for all periods
    // This ensures the selected filter is applied correctly
    const currentMetrics = {
      roi: metrics?.roi || 0,
      profitUnits: metrics?.profit_units || 0,
      mdd: metrics?.mdd || 0,
      avgOdds: metrics?.avg_odds || 0,
      volumeUnits: metrics?.volume_units || 0,
      rating: metrics?.rating || 0
    };
    
    return {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      tipster: channel.channel_tipsters?.[0]?.profiles?.name || "Tipster",
      avatar: (channel.channel_tipsters?.[0]?.profiles?.name || channel.name).substring(0, 2).toUpperCase(),
      isPremium: channel.is_premium,
      description: channel.description || "",
      metrics: {
        // Use the same metrics for all time windows (they're already filtered by timeWindow param)
        '7d': currentMetrics,
        '30d': currentMetrics,
        '3m': currentMetrics,
        '6m': currentMetrics,
        'ytd': currentMetrics,
        '12m': currentMetrics,
        'all': currentMetrics,
        // Legacy keys for compatibility
        'MTD': currentMetrics,
        '180d': currentMetrics,
        'YTD': currentMetrics
      },
      tags: {
        sport: channel.channel_tags?.[0]?.sport || "Futebol",
        bookmaker: channel.channel_tags?.[0]?.bookmaker || "Bet365",
        method: channel.channel_tags?.[0]?.method || "Model",
        market: channel.channel_tags?.[0]?.market || "Over/Under",
        liquidity: channel.channel_tags?.[0]?.liquidity || "média"
      },
      subscribers: channel.subscribers_count || 0,
      maxSubscribers: channel.max_subscribers,
      price: basePlan ? basePlan.price / 100 : 0, // Convert from cents to reais
      createdAt: channel.created_at,
      totalTips: metrics?.total_bets || 0,
      // Adicionar dados do tipster quando disponível
      tipsterData: channel.channel_tipsters?.[0] || null
    };
  });
}

// Add loading component
export const runtime = 'nodejs'; // Force dynamic rendering

export default async function CanaisPage({
  searchParams
}: {
  searchParams: Promise<{ timeWindow?: string }>
}) {
  // Await searchParams as required in Next.js 15
  const params = await searchParams;
  // Get timeWindow from URL params, default to '30d'
  const timeWindow = params.timeWindow || '30d';
  
  // Fetch channels from Supabase with the selected time window
  const { data: channels, error } = await getChannelsWithDetails(timeWindow);
  
  if (error) {
    logger.error('Failed to fetch channels', error, { page: 'canais', timeWindow });
  }

  // Fetch live metrics for all channels (for the badge)
  const liveMetrics = await getChannelMetricsLive();
  const channelsWithLiveMetrics = new Set(
    liveMetrics
      .filter(m => m.total_tips > 0)
      .map(m => m.channel_id)
  );

  const transformedChannels = channels ? transformChannelData(channels, timeWindow) : [];

  return (
    <PageWrapper>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubra os Melhores Tipsters
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore nossa seleção de tipsters verificados e encontre o canal perfeito 
                para suas apostas. Todos com histórico comprovado e métricas transparentes.
              </p>
            </div>
          </div>
        </section>

        {/* Channels Section */}
        <section className="container mx-auto px-4 pb-20">
          {error ? (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro ao carregar canais. Por favor, tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          ) : (
            <ChannelsClient 
              channels={transformedChannels} 
              isLiveData 
              channelsWithLiveMetrics={Array.from(channelsWithLiveMetrics)}
            />
          )}
        </section>
      </main>
    </PageWrapper>
  );
}