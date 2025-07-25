import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Users, DollarSign, Plus, Settings, Eye } from "lucide-react";

export default function CanaisPage() {
  // Mock channel data
  const channelExample = {
    id: 1,
    name: "Tips Premium ⚽",
    description: "Tips diárias de futebol com análise detalhada",
    subscribers: 89,
    price: "R$ 39,90",
    status: "active",
    telegram: "@tipspremium",
    maxSubscribers: 100,
  };

  return (
    <>
      <PageHeader
        title="Meus Canais"
        description="Gerencie seus canais de tips"
        breadcrumb={[{ title: "Canais" }]}
        actions={
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Canal
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Existing Channel Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                {channelExample.name}
              </CardTitle>
              <Badge variant="default">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {channelExample.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Assinantes
                </div>
                <p className="text-2xl font-bold">
                  {channelExample.subscribers}/{channelExample.maxSubscribers}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Mensalidade
                </div>
                <p className="text-2xl font-bold">{channelExample.price}</p>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Telegram:</span>{" "}
              <span className="font-mono">{channelExample.telegram}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State for Second Channel */}
        <Card className="flex items-center justify-center">
          <CardContent className="py-8">
            <EmptyState
              icon={Hash}
              title="Criar novo canal"
              description="Expanda seu negócio criando canais especializados"
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Channels */}
      <Card className="mt-4">
        <CardContent className="py-8">
          <EmptyState
            icon={Plus}
            title="Slots de canais disponíveis"
            description="Você pode criar até 5 canais. Entre em contato para aumentar seu limite."
          />
        </CardContent>
      </Card>
    </>
  );
}