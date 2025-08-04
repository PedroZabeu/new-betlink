import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChannelBySlug } from '@/lib/supabase/queries/channel-details';
import { Separator } from '@/components/ui/separator';
import ChannelHeader from '@/components/channels/detail/channel-header';
import SubscriptionPlansCard from '@/components/channels/detail/subscription-plans-card';
import MetricsCard from '@/components/channels/detail/metrics-card';
import PerformanceChart from '@/components/channels/detail/performance-chart';
import ResultsTable from '@/components/channels/detail/results-table';
import AboutCard from '@/components/channels/detail/about-card';
import ReviewsCard from '@/components/channels/detail/reviews-card';
import FaqCard from '@/components/channels/detail/faq-card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering since we need cookies for auth
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: channel } = await getChannelBySlug(params.slug);
  
  if (!channel) {
    return {
      title: 'Canal não encontrado',
    };
  }
  
  const tipsterName = channel.channel_tipsters?.[0]?.profiles?.name || 'Tipster';
  
  return {
    title: `${channel.name} - ${tipsterName} | BetLink`,
    description: channel.description || 'Canal de apostas esportivas profissional',
    openGraph: {
      title: `${channel.name} - ${tipsterName}`,
      description: channel.description || 'Canal de apostas esportivas profissional',
      type: 'website',
    },
  };
}

export default async function ChannelDetailPage({ params }: { params: { slug: string } }) {
  const { data: channelData, error } = await getChannelBySlug(params.slug);
  
  if (error || !channelData) {
    notFound();
  }
  
  // Transform Supabase data to component format
  const tipsterName = channelData.channel_tipsters?.[0]?.profiles?.name || 'Tipster Pro';
  
  // Build metrics object with all time windows
  const metricsMap: Record<string, any> = {};
  
  // No mapping needed anymore - use values directly from DB
  const timeWindowMap: Record<string, string> = {
    '7d': '7d',
    '30d': '30d',
    '3m': '3m',
    '6m': '6m',
    'ytd': 'ytd',
    '12m': '12m',
    'all': 'all'
  };
  
  channelData.channel_metrics.forEach(metric => {
    const displayWindow = timeWindowMap[metric.time_window] || metric.time_window;
    metricsMap[displayWindow] = {
      roi: metric.roi || 0,
      profitUnits: metric.profit_units || 0,
      mdd: metric.mdd || 0,
      avgOdds: metric.avg_odds || 0,
      volumeUnits: metric.volume_units || 0,
      winRate: metric.win_rate || 0,
      totalBets: metric.total_bets || 0,
      rating: metric.rating || 0
    };
  });
  
  
  // Ensure we have at least 30d metrics (fallback with default values)
  if (!metricsMap['30d']) {
    metricsMap['30d'] = {
      roi: 0,
      profitUnits: 0,
      mdd: 0,
      avgOdds: 0,
      volumeUnits: 0,
      winRate: 0,
      totalBets: 0,
      rating: 0
    };
  }
  
  // Build detailedMetrics structure expected by MetricsCard
  const detailedMetrics: Record<string, any> = {};
  
  Object.entries(metricsMap).forEach(([period, data]) => {
    detailedMetrics[period] = {
      roi: data.roi,
      profit: data.profitUnits,
      winRate: data.winRate,
      totalBets: data.totalBets,
      avgOdds: data.avgOdds,
      maxDrawdown: Math.abs(data.mdd), // MDD is stored as negative
      volumeUnits: data.volumeUnits, // Add volumeUnits for metrics card
      chartData: [] // Empty for now, will be populated when we implement chart data
    };
  });
  
  const channel = {
    id: channelData.id,
    name: channelData.name,
    slug: channelData.slug,
    tipster: tipsterName,
    avatar: (tipsterName || channelData.name).substring(0, 2).toUpperCase(),
    isPremium: channelData.is_premium,
    description: channelData.description || '',
    subscribers: channelData.current_subscribers,
    maxSubscribers: channelData.max_subscribers,
    metrics: metricsMap,
    detailedMetrics,
    tags: {
      sport: channelData.channel_tags[0]?.sport || 'Futebol',
      bookmaker: channelData.channel_tags[0]?.bookmaker || 'Bet365',
      method: channelData.channel_tags[0]?.method || 'Model',
      market: channelData.channel_tags[0]?.market || 'Over/Under',
      liquidity: channelData.channel_tags[0]?.liquidity || 'média'
    },
    subscriptionPlans: channelData.subscription_plans.map(plan => ({
      id: plan.id.toString(),
      name: plan.name,
      duration: `${plan.duration_days} dias`,
      price: plan.price / 100, // Convert from cents
      originalPrice: plan.original_price ? plan.original_price / 100 : null,
      features: plan.features || [],
      isPopular: plan.is_popular || false
    })),
    // Temporariamente usando dados mock para seções ainda não migradas
    recentTips: [],
    reviews: [],
    about: {
      bio: channelData.about_bio || 'Tipster profissional com anos de experiência no mercado de apostas esportivas.',
      methodology: channelData.about_methodology || 'Análise estatística avançada combinada com conhecimento profundo do esporte.',
      specialties: channelData.about_specialties || ['Futebol', 'Over/Under', 'Ambas Marcam'],
      experience: channelData.about_experience || '5+ anos'
    },
    faqs: [
      {
        id: 'faq-1',
        question: 'Como recebo as dicas?',
        answer: 'As dicas são enviadas diretamente no canal do Telegram assim que você se torna assinante.'
      },
      {
        id: 'faq-2',
        question: 'Posso cancelar a qualquer momento?',
        answer: 'Sim, você pode cancelar sua assinatura a qualquer momento através do painel de controle.'
      },
      {
        id: 'faq-3',
        question: 'Qual o horário de envio das tips?',
        answer: 'As tips são enviadas conforme identificamos oportunidades, geralmente entre 10h e 22h.'
      }
    ]
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/canais" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar para Canais
        </Link>
      </div>
      
      {/* Header */}
      <div className="container mx-auto px-4 pb-8">
        <ChannelHeader channel={channel} />
      </div>
      
      <Separator className="mb-8" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid gap-8">
          {/* Subscription Plans */}
          <SubscriptionPlansCard plans={channel.subscriptionPlans} channelName={channel.name} channelSlug={params.slug} />
          
          {/* Metrics and Chart Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <MetricsCard channel={channel} />
            <PerformanceChart channel={channel} />
          </div>
          
          {/* Results Table */}
          <ResultsTable tips={channel.recentTips} />
          
          {/* Info Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            <AboutCard about={channel.about} tipster={channel.tipster} />
            <ReviewsCard reviews={channel.reviews} rating={channel.metrics['30d']?.rating || 0} />
            <FaqCard faqs={channel.faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}