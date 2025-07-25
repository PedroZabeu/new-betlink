import { PageHeader } from "@/components/layouts/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp, FileText, Inbox } from "lucide-react";

export default function DashboardPage() {
  // Mock data for stats
  const stats = [
    {
      title: "Assinaturas Ativas",
      value: 2,
      icon: Users,
      description: "+1 este mês",
      trend: { value: 50, isPositive: true }
    },
    {
      title: "Gasto Mensal",
      value: "R$ 89,90",
      icon: CreditCard,
      description: "Próximo pagamento em 5 dias",
    },
    {
      title: "ROI Médio",
      value: "+145%",
      icon: TrendingUp,
      description: "Últimos 30 dias",
      trend: { value: 12, isPositive: true }
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Acompanhe suas assinaturas e resultados"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Recent Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileText}
            title="Nenhuma tip recente"
            description="As tips dos canais que você assina aparecerão aqui"
          />
        </CardContent>
      </Card>

      {/* Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={TrendingUp}
            title="Dados de performance em breve"
            description="Acompanhe o desempenho das suas apostas e ROI detalhado"
          />
        </CardContent>
      </Card>
    </div>
  );
}