import { CheckCircle2, BarChart3, FolderOpen, Search } from "lucide-react";

interface Advantage {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const advantages: Advantage[] = [
  {
    icon: <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />,
    title: "Tipsters Verificados",
    description: "Todos os canais passam por verificação técnica e histórica"
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-primary mx-auto" />,
    title: "Planilhas Automatizadas",
    description: "Estatísticas reais e confiáveis com base nas tips publicadas"
  },
  {
    icon: <FolderOpen className="w-10 h-10 text-primary mx-auto" />,
    title: "Gestão Unificada",
    description: "Organize e acompanhe todos os seus canais em um só painel"
  },
  {
    icon: <Search className="w-10 h-10 text-primary mx-auto" />,
    title: "Filtros Inteligentes",
    description: "Encontre canais por esporte, mercado ou tipo de estratégia"
  }
];

export function AdvantagesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mb-4">{advantage.icon}</div>
              <h3 className="text-xl font-semibold">
                {advantage.title}
              </h3>
              <p className="text-muted-foreground">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}