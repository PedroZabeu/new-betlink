import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Star,
  Search,
  Filter,
  ChevronRight
} from "lucide-react";

// Mock channel data
const mockChannels = [
  {
    id: 1,
    name: "Elite Football Tips",
    tipster: "Carlos Mendes",
    avatar: "CM",
    description: "Especialista em ligas europeias com foco em over/under e ambas marcam",
    sport: "Futebol",
    price: 149.90,
    subscribers: 487,
    maxSubscribers: 500,
    roi: 18.5,
    hitRate: 68,
    rating: 4.8,
    totalTips: 1250,
    isPremium: true,
  },
  {
    id: 2,
    name: "Basquete Lucrativo",
    tipster: "Ana Santos",
    avatar: "AS",
    description: "NBA e NBB com análises detalhadas de handicap asiático",
    sport: "Basquete",
    price: 99.90,
    subscribers: 234,
    maxSubscribers: 300,
    roi: 22.3,
    hitRate: 71,
    rating: 4.9,
    totalTips: 856,
    isPremium: true,
  },
  {
    id: 3,
    name: "Tennis Pro Picks",
    tipster: "Roberto Lima",
    avatar: "RL",
    description: "ATP, WTA e Grand Slams. Especialista em jogos ao vivo",
    sport: "Tênis",
    price: 129.90,
    subscribers: 178,
    maxSubscribers: 200,
    roi: 15.7,
    hitRate: 65,
    rating: 4.6,
    totalTips: 923,
    isPremium: false,
  },
  {
    id: 4,
    name: "Trader Esportivo BR",
    tipster: "Felipe Oliveira",
    avatar: "FO",
    description: "Trading esportivo profissional com gestão de banca incluída",
    sport: "Multi",
    price: 299.90,
    subscribers: 95,
    maxSubscribers: 100,
    roi: 31.2,
    hitRate: 74,
    rating: 5.0,
    totalTips: 567,
    isPremium: true,
  },
  {
    id: 5,
    name: "Cartões & Escanteios",
    tipster: "João Silva",
    avatar: "JS",
    description: "Mercados alternativos com odds médias de 2.20",
    sport: "Futebol",
    price: 79.90,
    subscribers: 312,
    maxSubscribers: 400,
    roi: 12.4,
    hitRate: 62,
    rating: 4.5,
    totalTips: 1432,
    isPremium: false,
  },
  {
    id: 6,
    name: "MMA & UFC Profits",
    tipster: "Pedro Costa",
    avatar: "PC",
    description: "Especialista em lutas com análise técnica detalhada",
    sport: "MMA",
    price: 179.90,
    subscribers: 156,
    maxSubscribers: 200,
    roi: 28.9,
    hitRate: 69,
    rating: 4.7,
    totalTips: 345,
    isPremium: true,
  },
];

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
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por esporte, tipster ou canal..."
                  className="pl-10 pr-4 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Channels */}
        <section className="container mx-auto px-4 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Preço Mensal</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>R$ 0</span>
                        <span>R$ 500</span>
                      </div>
                      <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* ROI Filter */}
                  <div className="space-y-3">
                    <Label>ROI Mínimo</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>0%</span>
                        <span>50%</span>
                      </div>
                      <Slider
                        defaultValue={[10]}
                        max={50}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Sports */}
                  <div className="space-y-3">
                    <Label>Esportes</Label>
                    <div className="space-y-2">
                      {["Futebol", "Basquete", "Tênis", "MMA", "Multi"].map((sport) => (
                        <label key={sport} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{sport}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">Aplicar Filtros</Button>
                </CardContent>
              </Card>
            </aside>

            {/* Channels Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {mockChannels.length} canais encontrados
                </p>
                <select className="px-4 py-2 border rounded-md">
                  <option>Mais Populares</option>
                  <option>Maior ROI</option>
                  <option>Maior Taxa de Acerto</option>
                  <option>Menor Preço</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockChannels.map((channel) => (
                  <Card key={channel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                            {channel.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {channel.name}
                              {channel.isPremium && (
                                <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">por {channel.tipster}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{channel.sport}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {channel.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">ROI</p>
                            <p className="font-semibold">{channel.roi}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                            <p className="font-semibold">{channel.hitRate}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Assinantes</p>
                            <p className="font-semibold">{channel.subscribers}/{channel.maxSubscribers}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Avaliação</p>
                            <p className="font-semibold">{channel.rating}/5.0</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar for Subscribers */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Ocupação do canal</span>
                          <span>{Math.round((channel.subscribers / channel.maxSubscribers) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(channel.subscribers / channel.maxSubscribers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">R$ {channel.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">por mês</p>
                      </div>
                      <Button className="gap-2">
                        Ver Detalhes
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Carregar Mais Canais
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}