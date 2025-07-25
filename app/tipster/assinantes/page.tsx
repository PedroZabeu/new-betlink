"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, UserCheck, UserX, Clock, Download } from "lucide-react";

export default function AssinantesPage() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock subscribers data
  const mockSubscribers = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      channel: "Tips Premium ⚽",
      subscriptionDate: "15/01/2025",
      status: "active",
      revenue: "R$ 39,90",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      channel: "Tips Premium ⚽",
      subscriptionDate: "10/01/2025",
      status: "active",
      revenue: "R$ 39,90",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro.costa@email.com",
      channel: "Tips VIP 🎾",
      subscriptionDate: "05/01/2025",
      status: "active",
      revenue: "R$ 59,90",
    },
  ];

  return (
    <>
      <PageHeader
        title="Assinantes"
        description="Gerencie seus assinantes e acompanhe o crescimento"
        breadcrumb={[{ title: "Assinantes" }]}
        actions={
          <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Assinantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                <UserCheck className="mr-2 h-4 w-4" />
                Ativos
              </TabsTrigger>
              <TabsTrigger value="inactive">
                <UserX className="mr-2 h-4 w-4" />
                Inativos
              </TabsTrigger>
              <TabsTrigger value="waitlist">
                <Clock className="mr-2 h-4 w-4" />
                Lista de Espera
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left text-sm font-medium">Nome</th>
                      <th className="p-3 text-left text-sm font-medium">Canal</th>
                      <th className="p-3 text-left text-sm font-medium">Data Assinatura</th>
                      <th className="p-3 text-left text-sm font-medium">Status</th>
                      <th className="p-3 text-left text-sm font-medium">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{subscriber.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {subscriber.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">{subscriber.channel}</td>
                        <td className="p-3 text-sm">{subscriber.subscriptionDate}</td>
                        <td className="p-3">
                          <Badge variant="default">Ativo</Badge>
                        </td>
                        <td className="p-3 font-medium">{subscriber.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex items-center justify-between p-3">
                  <p className="text-sm text-muted-foreground">
                    Mostrando 3 de 127 assinantes
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <EmptyState
                icon={UserX}
                title="Nenhum assinante inativo"
                description="Assinantes que cancelaram aparecerão aqui"
              />
            </TabsContent>

            <TabsContent value="waitlist">
              <EmptyState
                icon={Clock}
                title="Lista de espera vazia"
                description="Quando seus canais estiverem lotados, interessados entrarão na lista de espera"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Média dos últimos 3 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6%</div>
            <p className="text-xs text-muted-foreground">Abaixo da média do mercado</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}