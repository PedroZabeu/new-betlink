import { PageHeader } from "@/components/layouts/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Target, Send, FileText, UserPlus } from "lucide-react";

export default function TipsterDashboard() {
  const tipsterStats = [
    {
      title: "Total de Assinantes",
      value: 127,
      icon: Users,
      description: "Ativos em todos os canais",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Receita Mensal",
      value: "R$ 3.429,00",
      icon: CreditCard,
      description: "Projeção deste mês",
    },
    {
      title: "Taxa de Acerto",
      value: "68%",
      icon: Target,
      description: "Últimos 30 dias",
      trend: { value: 3, isPositive: true },
    },
    {
      title: "Tips Este Mês",
      value: 45,
      icon: Send,
      description: "15 greens, 8 reds",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard do Tipster"
        description="Acompanhe o desempenho dos seus canais e assinantes"
        breadcrumb={[{ title: "Dashboard" }]}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tipsterStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Recent Tips Section */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Tips Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileText}
              title="Nenhuma tip recente"
              description="As tips que você enviar aparecerão aqui"
            />
          </CardContent>
        </Card>

        {/* New Subscribers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Novos Assinantes</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={UserPlus}
              title="Nenhum assinante novo"
              description="Novos assinantes dos últimos 7 dias aparecerão aqui"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}