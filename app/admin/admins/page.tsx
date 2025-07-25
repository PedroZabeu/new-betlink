import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
import { Shield, UserPlus, MoreVertical } from "lucide-react";

export default async function AdminAdminsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only master can access this page
  if (!profile || profile.role !== "master") {
    redirect("/access-denied");
  }

  // Mock data for administrators
  const mockAdmins = [
    {
      id: 1,
      name: "Master Admin",
      email: "newmaster@betlink.com",
      role: "master",
      status: "active",
      createdAt: "01/01/2024",
      lastLogin: "Hoje, 14:30"
    },
    {
      id: 2,
      name: "Admin Silva",
      email: "newadmin@betlink.com",
      role: "admin",
      status: "active",
      createdAt: "15/01/2024",
      lastLogin: "Ontem, 18:45"
    },
    {
      id: 3,
      name: "Admin Santos",
      email: "admin.santos@betlink.com",
      role: "admin",
      status: "active",
      createdAt: "20/02/2024",
      lastLogin: "Há 3 dias"
    },
    {
      id: 4,
      name: "Admin Costa",
      email: "admin.costa@betlink.com",
      role: "admin",
      status: "suspended",
      createdAt: "10/03/2024",
      lastLogin: "Há 1 semana"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Gerenciar Administradores"
          subtitle="Controle de acesso administrativo da plataforma"
        />
        <Button disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Admin
        </Button>
      </div>

      {/* Warning Card */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Acesso Master:</strong> Apenas você pode gerenciar administradores. 
              Mudanças aqui afetam o controle de acesso de toda a plataforma.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Administrators Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === "master" ? "default" : "secondary"}>
                      {admin.role === "master" ? "Master" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.createdAt}</TableCell>
                  <TableCell>{admin.lastLogin}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={admin.status === "active" ? "success" : "destructive"}>
                      {admin.status === "active" ? "Ativo" : "Suspenso"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={admin.role === "master"}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Master</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Admin</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suspensos</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}