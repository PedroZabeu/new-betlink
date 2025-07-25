"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";

export default function AssinaturasPage() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Minhas Assinaturas"
        description="Gerencie suas assinaturas de tipsters"
        breadcrumb={[{ title: "Assinaturas" }]}
        actions={
          <Button>Explorar Tipsters</Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <EmptyState
            icon={Package}
            title="Você ainda não tem assinaturas ativas"
            description="Explore nossos tipsters e comece a lucrar com suas apostas"
            action={{
              label: "Explorar Tipsters",
              href: "/canais"
            }}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <EmptyState
            icon={Package}
            title="Nenhuma assinatura cancelada"
            description="Assinaturas que você cancelar aparecerão aqui"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}