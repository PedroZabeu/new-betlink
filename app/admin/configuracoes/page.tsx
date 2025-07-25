import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ConfiguracoesPage() {
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

  const userRole = profile?.role || "admin";
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <label htmlFor="site-name" className="block text-sm font-medium">Nome do site</label>
            <input 
              id="site-name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" 
              value="BetLink" 
              disabled 
              title="Nome do site da plataforma"
            />
          </div>
          <div>
            <label htmlFor="support-email" className="block text-sm font-medium">Email de suporte</label>
            <input 
              id="support-email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" 
              value="suporte@betlink.com" 
              disabled 
              title="Email para contato de suporte"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="maintenance-mode" className="block text-sm font-medium">Modo manutenção</label>
            <Switch id="maintenance-mode" checked={false} disabled />
          </div>
        </CardContent>
      </Card>
      {/* Limites do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Limites do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div>Máx. canais por tipster: <b>5</b></div>
          <div>Máx. assinantes por canal: <b>100</b></div>
          <div>Preço mínimo da assinatura: <b>R$ 19,90</b></div>
        </CardContent>
      </Card>
      {/* Seções condicionais para master apenas */}
      {userRole === "master" && (
        <>
          {/* Gestão de Admins - apenas master */}
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                Total de Administradores: <Badge variant="secondary">3</Badge>
              </div>
              <Button disabled>Criar Novo Admin</Button>
            </CardContent>
          </Card>
          {/* Integrações - apenas master */}
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">Telegram Bot: <Badge variant="default">Conectado</Badge></div>
              <div className="flex items-center gap-2">Stripe: <Badge variant="secondary">Configurar</Badge></div>
              <div className="flex items-center gap-2">MercadoPago: <Badge variant="destructive">Desconectado</Badge></div>
            </CardContent>
          </Card>
          {/* Manutenção - apenas master */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button disabled>Backup do Banco</Button>
              <Button disabled>Limpar Cache</Button>
              <Button disabled>Ver Logs</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 