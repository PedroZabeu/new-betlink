"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, Search, Filter } from "lucide-react";

const mockClientes = [
  { id: 1, name: "João Silva", email: "joao@email.com", subscriptions: 2, totalSpent: "R$ 179,80", since: "Jan 2024", status: "active" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", subscriptions: 1, totalSpent: "R$ 39,90", since: "Mar 2024", status: "active" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", subscriptions: 0, totalSpent: "R$ 0,00", since: "Dez 2024", status: "inactive" },
  { id: 4, name: "Lucas Lima", email: "lucas@email.com", subscriptions: 3, totalSpent: "R$ 299,70", since: "Fev 2024", status: "active" },
  { id: 5, name: "Ana Paula", email: "ana@email.com", subscriptions: 1, totalSpent: "R$ 19,90", since: "Abr 2024", status: "inactive" },
];

const statusLabels = {
  active: "Ativo",
  inactive: "Inativo"
};

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = mockClientes.filter(c =>
    (status === "all" || c.status === status) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Gerenciar Clientes" icon={UserCheck} />
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
              startIcon={<Search size={16} />}
            />
            <Button variant={status === "all" ? "default" : "outline"} onClick={() => setStatus("all")}>Todos</Button>
            <Button variant={status === "active" ? "default" : "outline"} onClick={() => setStatus("active")}>Ativos</Button>
            <Button variant={status === "inactive" ? "default" : "outline"} onClick={() => setStatus("inactive")}>Inativos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Nome</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-center">Assinaturas</th>
                  <th className="py-2 px-4 text-center">Gasto Total</th>
                  <th className="py-2 px-4 text-center">Desde</th>
                  <th className="py-2 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cliente => (
                  <tr key={cliente.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 px-4">{cliente.name}</td>
                    <td className="py-2 px-4">{cliente.email}</td>
                    <td className="py-2 px-4 text-center">{cliente.subscriptions}</td>
                    <td className="py-2 px-4 text-center">{cliente.totalSpent}</td>
                    <td className="py-2 px-4 text-center">{cliente.since}</td>
                    <td className="py-2 px-4 text-center">
                      <Badge variant={cliente.status === "active" ? "success" : "destructive"}>
                        {statusLabels[cliente.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 