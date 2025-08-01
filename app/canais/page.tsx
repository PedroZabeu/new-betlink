import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { ChannelsClient } from "@/components/channels/channels-client";
import { mockChannels } from "@/lib/data/mock-channels";

export default function CanaisPage() {
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
          <ChannelsClient channels={mockChannels} />
        </section>
      </main>
    </PageWrapper>
  );
}