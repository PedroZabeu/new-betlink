"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HistoricoPage() {
  const [period, setPeriod] = useState("30");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Histórico de Pagamentos"
        description="Acompanhe todos os seus pagamentos realizados"
        breadcrumb={[{ title: "Histórico" }]}
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="period" className="text-sm font-medium">
            Período:
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment History */}
      <EmptyState
        icon={FileText}
        title="Nenhum pagamento encontrado"
        description="Seus pagamentos aparecerão aqui após sua primeira assinatura"
      />
    </div>
  );
}