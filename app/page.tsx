import { Header } from "@/components/header";
import { LandingHero } from "@/components/landing-hero";
import { AdvantagesSection } from "@/components/home/advantages-section";
import { BlogCTASection } from "@/components/home/blog-cta-section";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <LandingHero />
        </div>
        
        <AdvantagesSection />
        
        <div className="container mx-auto px-4">
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Descubra Profissionais Verificados</h3>
                <p className="text-sm text-muted-foreground">
                  Browse nosso catálogo de tipsters com histórico comprovado e métricas transparentes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Assine os Melhores Canais</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha entre planos mensais ou anuais e acesse tips exclusivas dos profissionais
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Tips Direto no Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  Receba análises em tempo real e gerencie todas suas assinaturas em um só lugar
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <BlogCTASection />
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 BetLink. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="/termos" className="text-sm text-muted-foreground hover:text-foreground">
                Termos de Uso
              </a>
              <a href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground">
                Privacidade
              </a>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
