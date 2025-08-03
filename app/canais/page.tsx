import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { ChannelsClient } from "@/components/channels/channels-client";
import { getChannelsWithDetails, type ChannelWithDetails } from "@/lib/supabase/queries/channels";
import { logger } from "@/lib/utils/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Transform Supabase data to frontend format
function transformChannelData(channels: ChannelWithDetails[]) {
  return channels.map(channel => {
    // Find the 30d metrics
    const metrics30d = channel.channel_metrics.find(m => m.time_window === '30d');
    
    // Get first subscription plan for base price
    const basePlan = channel.subscription_plans[0];
    
    return {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      tipster: channel.channel_tipsters?.[0]?.profiles?.name || "Tipster",
      avatar: (channel.channel_tipsters?.[0]?.profiles?.name || channel.name).substring(0, 2).toUpperCase(),
      isPremium: channel.is_premium,
      description: channel.description || "",
      metrics: {
        // We only have 30d data from the query, but need to provide all time windows
        // for compatibility with the frontend types
        '7d': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        },
        'MTD': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        },
        '30d': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        },
        '180d': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        },
        'YTD': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        },
        'all': {
          roi: metrics30d?.roi || 0,
          profitUnits: metrics30d?.profit_units || 0,
          mdd: metrics30d?.mdd || 0,
          avgOdds: metrics30d?.avg_odds || 0,
          volumeUnits: metrics30d?.volume_units || 0,
          rating: metrics30d?.rating || 0
        }
      },
      tags: {
        sport: channel.channel_tags[0]?.sport || "Futebol",
        bookmaker: channel.channel_tags[0]?.bookmaker || "Bet365",
        method: channel.channel_tags[0]?.method || "Model",
        market: channel.channel_tags[0]?.market || "Over/Under",
        liquidity: channel.channel_tags[0]?.liquidity || "média"
      },
      subscribers: channel.current_subscribers,
      maxSubscribers: channel.max_subscribers,
      price: basePlan ? basePlan.price / 100 : 0, // Convert from cents to reais
      createdAt: channel.created_at,
      totalTips: metrics30d?.total_bets || 0,
      // Adicionar dados do tipster quando disponível
      tipsterData: channel.channel_tipsters?.[0] || null
    };
  });
}

// Add loading component
export const runtime = 'nodejs'; // Force dynamic rendering

export default async function CanaisPage() {
  // Fetch channels from Supabase
  const { data: channels, error } = await getChannelsWithDetails();
  
  if (error) {
    logger.error('Failed to fetch channels', error, { page: 'canais' });
  }

  const transformedChannels = channels ? transformChannelData(channels) : [];

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
            <ChannelsClient channels={transformedChannels} isLiveData />
          )}
        </section>
      </main>
    </PageWrapper>
  );
}