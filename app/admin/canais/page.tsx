"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

const mockChannels = {
  pending: [
    { id: 1, name: "Tips Europa League", tipster: "Carlos Tips", subscribers: 0, status: "pending" }
  ],
  active: [
    { id: 2, name: "Tips Premium ⚽", tipster: "Ana Trader", subscribers: 89, status: "active" },
    { id: 3, name: "Tips VIP 🎾", tipster: "João Bets", subscribers: 45, status: "active" }
  ],
  suspended: []
};

const statusLabels = {
  pending: "Pendente",
  active: "Ativo",
  suspended: "Suspenso"
};

export default function CanaisPage() {
  const [tab, setTab] = useState("pending");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moderação de Canais</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="suspended">Suspensos</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {mockChannels.pending.length === 0 ? (
            <div className="text-muted-foreground p-6">Nenhum canal pendente.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockChannels.pending.map(channel => (
                <Card key={channel.id}>
                  <CardHeader>
                    <CardTitle>{channel.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Tipster: {channel.tipster}</span>
                      <Badge variant="outline">{statusLabels[channel.status]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <span>Assinantes: {channel.subscribers}</span>
                    <Button variant="success">Aprovar</Button>
                    <Button variant="destructive">Rejeitar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active">
          {mockChannels.active.length === 0 ? (
            <div className="text-muted-foreground p-6">Nenhum canal ativo.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockChannels.active.map(channel => (
                <Card key={channel.id}>
                  <CardHeader>
                    <CardTitle>{channel.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Tipster: {channel.tipster}</span>
                      <Badge variant="success">{statusLabels[channel.status]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <span>Assinantes: {channel.subscribers}</span>
                    <Button variant="destructive">Suspender</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="suspended">
          {mockChannels.suspended.length === 0 ? (
            <div className="text-muted-foreground p-6">Nenhum canal suspenso.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockChannels.suspended.map(channel => (
                <Card key={channel.id}>
                  <CardHeader>
                    <CardTitle>{channel.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Tipster: {channel.tipster}</span>
                      <Badge variant="destructive">{statusLabels[channel.status]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <span>Assinantes: {channel.subscribers}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 