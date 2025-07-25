"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const metrics = [
  { title: "ROI Médio", value: "+145%", icon: TrendingUp },
  { title: "Win Rate", value: "68%", icon: Target },
  { title: "Yield", value: "5.2%", icon: BarChart3 },
  { title: "Odd Média", value: "1.85", icon: Target }
];

export default function MetricasPage() {
  const [period, setPeriod] = useState("30");

  return (
    <>
      <PageHeader
        title="Métricas de Performance"
        breadcrumb={[{ title: "Métricas" }]}
      />

      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex justify-end">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Area */}
        <Card>
          <CardHeader>
            <CardTitle>Análise Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={BarChart3}
              title="Gráficos em Desenvolvimento"
              description="Gráficos detalhados de performance estarão disponíveis em breve."
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
} 