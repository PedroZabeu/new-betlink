"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreVertical, Eye, Edit, Ban } from "lucide-react";

export default function AdminTipstersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Mock data for tipsters
  const mockTipsters = [
    {
      id: 1,
      name: "Carlos Tips",
      email: "carlos@tips.com",
      channels: 2,
      subscribers: 127,
      status: "active",
      joinedDate: "15/01/2024",
      revenue: "R$ 4.572,00"
    },
    {
      id: 2,
      name: "Ana Trader",
      email: "ana@trader.com",
      channels: 1,
      subscribers: 89,
      status: "active",
      joinedDate: "22/02/2024",
      revenue: "R$ 3.201,00"
    },
    {
      id: 3,
      name: "João Bets",
      email: "joao@bets.com",
      channels: 3,
      subscribers: 201,
      status: "suspended",
      joinedDate: "10/12/2023",
      revenue: "R$ 7.236,00"
    },
    {
      id: 4,
      name: "Maria Apostas",
      email: "maria@apostas.com",
      channels: 1,
      subscribers: 45,
      status: "active",
      joinedDate: "05/03/2024",
      revenue: "R$ 1.620,00"
    },
  ];

  // Filter tipsters based on search and status
  const filteredTipsters = mockTipsters.filter(tipster => {
    const matchesSearch = tipster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tipster.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tipster.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Tipsters"
        subtitle="Visualize e gerencie todos os tipsters da plataforma"
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === "suspended" ? "default" : "outline"}
                onClick={() => setStatusFilter("suspended")}
                size="sm"
              >
                Suspensos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipsters Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Canais</TableHead>
                <TableHead className="text-center">Assinantes</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTipsters.map((tipster) => (
                <TableRow key={tipster.id}>
                  <TableCell className="font-medium">{tipster.name}</TableCell>
                  <TableCell>{tipster.email}</TableCell>
                  <TableCell className="text-center">{tipster.channels}</TableCell>
                  <TableCell className="text-center">{tipster.subscribers}</TableCell>
                  <TableCell className="text-right">{tipster.revenue}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={tipster.status === "active" ? "success" : "destructive"}>
                      {tipster.status === "active" ? "Ativo" : "Suspenso"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          {tipster.status === "active" ? "Suspender" : "Reativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total de Tipsters</p>
              <p className="text-2xl font-bold">{mockTipsters.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipsters Ativos</p>
              <p className="text-2xl font-bold">
                {mockTipsters.filter(t => t.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold">R$ 16.629,00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}