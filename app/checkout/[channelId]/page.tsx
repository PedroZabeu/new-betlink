import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChannelBySlug } from "@/lib/data/mock-channels";
import { getChannelDetail } from "@/lib/data/mock-channel-details";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { logger } from "@/lib/utils/logger";

interface PageProps {
  params: {
    channelId: string;
  };
  searchParams: {
    plan?: string;
    source?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const channel = getChannelBySlug(params.channelId);
  if (!channel) return { title: "Canal não encontrado" };

  return {
    title: `Assinar ${channel.name} - BetLink`,
    description: `Complete sua assinatura do canal ${channel.name} e tenha acesso às melhores tips de ${channel.tipster}`,
  };
}

export default function CheckoutPage({ params, searchParams }: PageProps) {
  const FEATURE_NAME = '[Feature 2.13: Checkout Flow]';
  
  // Buscar dados do canal
  const channelBasic = getChannelBySlug(params.channelId);
  const channelDetail = channelBasic ? getChannelDetail(params.channelId) : null;
  
  if (!channelBasic || !channelDetail) {
    logger.warn(`${FEATURE_NAME} Channel not found`, { 
      channelId: params.channelId 
    });
    notFound();
  }

  // Log entrada no checkout
  logger.info(`${FEATURE_NAME} Checkout started`, {
    channelId: params.channelId,
    channelName: channelBasic.name,
    preSelectedPlan: searchParams.plan,
    source: searchParams.source || 'direct'
  });

  return (
    <div className="min-h-screen bg-background">
      <CheckoutFlow
        channel={channelBasic}
        channelDetail={channelDetail}
        preSelectedPlan={searchParams.plan}
        source={searchParams.source || 'direct'}
      />
    </div>
  );
}

// Pre-render all channel checkout pages
export async function generateStaticParams() {
  const { mockChannels } = await import("@/lib/data/mock-channels");
  
  return mockChannels.map((channel) => ({
    channelId: channel.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}