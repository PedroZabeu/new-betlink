import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Trophy,
  Heart,
  Zap,
  Globe
} from "lucide-react";

export default function SobrePage() {
  return (
    <PageWrapper>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Conectando Tipsters de Elite
                <span className="block text-primary mt-2">aos Melhores Apostadores</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A BetLink é a plataforma líder em conectar apostadores a tipsters profissionais verificados, 
                proporcionando transparência, segurança e resultados comprovados.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Tipsters Verificados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Clientes Ativos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Taxa de Satisfação</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">R$ 2M+</div>
                <p className="text-muted-foreground">Lucros Distribuídos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa História</h2>
                <div className="w-20 h-1 bg-primary mx-auto" />
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  A BetLink nasceu em 2023 da frustração de apostadores experientes com a falta de transparência 
                  e organização no mercado de tips esportivos. Cansados de grupos desorganizados no Telegram, 
                  tipsters sem histórico comprovado e a dificuldade de gerenciar múltiplas assinaturas, 
                  decidimos criar a solução definitiva.
                </p>
                <p>
                  Nossa plataforma revoluciona a forma como tipsters e apostadores se conectam. 
                  Com verificação rigorosa de resultados, integração automatizada com o Telegram, 
                  e um sistema transparente de métricas, garantimos que apenas os melhores profissionais 
                  façam parte da nossa comunidade.
                </p>
                <p>
                  Hoje, somos a maior plataforma de tipsters do Brasil, com centenas de profissionais 
                  verificados e milhares de apostadores satisfeitos que encontram em nossa plataforma 
                  a confiança e os resultados que procuram.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Mission */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Nossa Missão</h3>
                  <p className="text-muted-foreground">
                    Democratizar o acesso a informações de qualidade no mundo das apostas esportivas, 
                    conectando apostadores a tipsters profissionais de forma transparente e segura.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Nossa Visão</h3>
                  <p className="text-muted-foreground">
                    Ser a plataforma global de referência para apostadores que buscam conhecimento 
                    especializado e resultados consistentes, elevando o padrão do mercado.
                  </p>
                </CardContent>
              </Card>

              {/* Values */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Nossos Valores</h3>
                  <p className="text-muted-foreground">
                    Transparência total, verificação rigorosa, jogo responsável, inovação constante 
                    e compromisso absoluto com o sucesso de nossos usuários.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a BetLink?</h2>
              <div className="w-20 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Verificado</h3>
                <p className="text-muted-foreground">
                  Todos os tipsters passam por verificação rigorosa de histórico e resultados
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Métricas Reais</h3>
                <p className="text-muted-foreground">
                  Acompanhe ROI, taxa de acerto e evolução em tempo real
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Integração Total</h3>
                <p className="text-muted-foreground">
                  Receba tips diretamente no Telegram de forma automatizada
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
                <p className="text-muted-foreground">
                  Faça parte de uma comunidade séria e comprometida com resultados
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Time</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Profissionais apaixonados por tecnologia e apostas esportivas, unidos para criar 
                a melhor experiência do mercado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Ricardo Silva</h3>
                  <p className="text-sm text-primary mb-3">CEO & Co-fundador</p>
                  <p className="text-muted-foreground text-sm">
                    15 anos de experiência em apostas esportivas e tecnologia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Ana Martinez</h3>
                  <p className="text-sm text-primary mb-3">CTO & Co-fundadora</p>
                  <p className="text-muted-foreground text-sm">
                    Especialista em IA e automação de sistemas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Carlos Oliveira</h3>
                  <p className="text-sm text-primary mb-3">Head de Operações</p>
                  <p className="text-muted-foreground text-sm">
                    Ex-trader esportivo com foco em gestão de risco
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para elevar suas apostas ao próximo nível?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se a milhares de apostadores que já descobriram o poder de ter os melhores 
              tipsters ao seu lado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/sign-up" 
                className="inline-flex items-center justify-center px-8 py-3 bg-background text-primary rounded-md font-semibold hover:bg-background/90 transition"
              >
                Começar Agora
              </a>
              <a 
                href="/canais" 
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground/20 rounded-md font-semibold hover:bg-primary-foreground/30 transition"
              >
                Explorar Canais
              </a>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}