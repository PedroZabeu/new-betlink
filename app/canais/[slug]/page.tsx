import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChannelDetail, getAllChannelSlugs } from '@/lib/data/mock-channel-details';
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

export async function generateStaticParams() {
  const slugs = getAllChannelSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const channel = getChannelDetail(params.slug);
  
  if (!channel) {
    return {
      title: 'Canal não encontrado',
    };
  }
  
  return {
    title: `${channel.name} - ${channel.tipster} | BetLink`,
    description: channel.description,
    openGraph: {
      title: `${channel.name} - ${channel.tipster}`,
      description: channel.description,
      type: 'website',
    },
  };
}

export default function ChannelDetailPage({ params }: { params: { slug: string } }) {
  const channel = getChannelDetail(params.slug);
  
  if (!channel) {
    notFound();
  }
  
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
          <SubscriptionPlansCard plans={channel.subscriptionPlans} channelName={channel.name} />
          
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
            <ReviewsCard reviews={channel.reviews} rating={channel.metrics['30d'].rating} />
            <FaqCard faqs={channel.faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}