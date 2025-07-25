import { PageHeader } from "@/components/layouts/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, UserCheck, Hash, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
  // Mock data for admin statistics
  const adminStats = [
    {
      title: "Total de Tipsters",
      value: 12,
      icon: Users,
      trend: { value: 20, isPositive: true },
      description: "+2 este mês"
    },
    {
      title: "Total de Clientes",
      value: 342,
      icon: UserCheck,
      trend: { value: 15, isPositive: true },
      description: "+48 este mês"
    },
    {
      title: "Canais Ativos",
      value: 18,
      icon: Hash,
      trend: { value: 5, isPositive: true },
      description: "+1 esta semana"
    },
    {
      title: "Receita Total",
      value: "R$ 45.678,00",
      icon: DollarSign,
      trend: { value: 32, isPositive: true },
      description: "+R$ 8.234,00 este mês"
    },
  ];

  // Mock recent activities
  const recentActivities = [
    { type: "info", message: "Novo tipster registrado: Carlos Tips", time: "Há 2 horas" },
    { type: "warning", message: "Canal 'Tips Premium' atingiu limite de assinantes", time: "Há 5 horas" },
    { type: "success", message: "Pagamento processado: R$ 1.234,00", time: "Há 1 dia" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão Geral Administrativa"
        subtitle="Monitore e gerencie toda a plataforma BetLink"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <EmptyState
                icon={AlertCircle}
                title="Sem atividades recentes"
                description="Atividades importantes aparecerão aqui"
              />
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      activity.type === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Backup Automático</p>
                  <p className="text-sm text-muted-foreground">
                    Último backup realizado há 3 dias
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Atualização Disponível</p>
                  <p className="text-sm text-muted-foreground">
                    Versão 1.2.0 disponível para instalação
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart Placeholder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crescimento da Plataforma</CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Gráfico de crescimento (em breve)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}