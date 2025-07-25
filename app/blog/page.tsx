import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Como Começar nas Apostas Esportivas: Guia Completo para Iniciantes",
    excerpt: "Descubra os primeiros passos para entrar no mundo das apostas esportivas de forma responsável e estratégica. Aprenda conceitos básicos e dicas essenciais.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
    author: "João Silva",
    date: "2025-01-20",
    readTime: "5 min",
    category: "Iniciantes",
    categoryColor: "bg-blue-500"
  },
  {
    id: 2,
    title: "Gestão de Banca: O Segredo dos Apostadores Profissionais",
    excerpt: "Entenda por que a gestão de banca é fundamental para o sucesso a longo prazo nas apostas esportivas e como implementá-la corretamente.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop",
    author: "Maria Santos",
    date: "2025-01-18",
    readTime: "8 min",
    category: "Estratégia",
    categoryColor: "bg-green-500"
  },
  {
    id: 3,
    title: "Análise Estatística no Futebol: Métricas que Importam",
    excerpt: "Aprenda quais estatísticas realmente fazem diferença na hora de analisar jogos de futebol e como usá-las para melhorar suas previsões.",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop",
    author: "Pedro Oliveira",
    date: "2025-01-15",
    readTime: "10 min",
    category: "Análise",
    categoryColor: "bg-purple-500"
  },
  {
    id: 4,
    title: "Psicologia nas Apostas: Controlando as Emoções",
    excerpt: "Descubra como o controle emocional pode ser a diferença entre lucro e prejuízo nas apostas esportivas. Técnicas práticas para manter a disciplina.",
    image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&h=400&fit=crop",
    author: "Ana Costa",
    date: "2025-01-12",
    readTime: "6 min",
    category: "Mindset",
    categoryColor: "bg-orange-500"
  },
  {
    id: 5,
    title: "Os Melhores Mercados para Apostar em Basquete",
    excerpt: "Conheça os mercados mais lucrativos do basquete e como identificar as melhores oportunidades em jogos da NBA e outras ligas.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    author: "Carlos Mendes",
    date: "2025-01-10",
    readTime: "7 min",
    category: "Basquete",
    categoryColor: "bg-red-500"
  },
  {
    id: 6,
    title: "Value Betting: Encontrando Apostas de Valor",
    excerpt: "Entenda o conceito de value betting e como identificar apostas com valor esperado positivo. A matemática por trás das apostas lucrativas.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    author: "Roberto Lima",
    date: "2025-01-08",
    readTime: "12 min",
    category: "Avançado",
    categoryColor: "bg-indigo-500"
  },
  {
    id: 7,
    title: "Apostas ao Vivo: Estratégias e Oportunidades",
    excerpt: "Domine as apostas ao vivo com estratégias específicas para diferentes momentos do jogo. Quando entrar e quando sair do mercado.",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=400&fit=crop",
    author: "Felipe Rodrigues",
    date: "2025-01-05",
    readTime: "9 min",
    category: "Live Betting",
    categoryColor: "bg-pink-500"
  },
  {
    id: 8,
    title: "Tênis: Analisando Superfícies e Estilos de Jogo",
    excerpt: "Como as diferentes superfícies afetam o desempenho dos tenistas e como usar essa informação para fazer apostas mais precisas.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop",
    author: "Laura Fernandes",
    date: "2025-01-02",
    readTime: "8 min",
    category: "Tênis",
    categoryColor: "bg-yellow-500"
  }
];

// Format date to Brazilian format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

export default function BlogPage() {
  return (
    <PageWrapper>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/50 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blog BetLink
              </h1>
              <p className="text-xl text-muted-foreground">
                Dicas, estratégias e análises para melhorar suas apostas esportivas. 
                Conteúdo criado por especialistas para apostadores de todos os níveis.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${blogPosts[0].categoryColor} text-white border-0`}>
                      {blogPosts[0].category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">Destaque</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blogPosts[0].date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blogPosts[0].readTime} de leitura</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${post.categoryColor} text-white border-0`}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination (Mock) */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border rounded-md hover:bg-muted" disabled>
                Anterior
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                1
              </button>
              <button className="px-4 py-2 border rounded-md hover:bg-muted">
                2
              </button>
              <button className="px-4 py-2 border rounded-md hover:bg-muted">
                3
              </button>
              <button className="px-4 py-2 border rounded-md hover:bg-muted">
                Próxima
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}