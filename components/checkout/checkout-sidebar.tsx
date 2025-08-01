"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Clock, CheckCircle } from "lucide-react";
import { ChannelCard as ChannelType } from "@/lib/types/channel";
import { CheckoutData } from "./checkout-flow";

interface CheckoutSidebarProps {
  channel: ChannelType;
  checkoutData: CheckoutData;
}

export function CheckoutSidebar({ channel, checkoutData }: CheckoutSidebarProps) {
  const { subscription } = checkoutData;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Channel Info */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              {channel.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{channel.name}</h3>
              <p className="text-sm text-muted-foreground">por {channel.tipster}</p>
            </div>
          </div>

          <Separator />

          {/* Plan Details */}
          {subscription && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plano</span>
                  <span className="font-medium">{subscription.planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Duração</span>
                  <span className="font-medium">{subscription.duration} dias</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {subscription.price.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm">Pagamento 100% Seguro</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Seus dados estão protegidos</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm">Acesso imediato após pagamento</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-sm">7 dias de garantia</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Assinantes</span>
              <Badge variant="secondary">
                {channel.subscribers}/{channel.maxSubscribers}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ROI (30d)</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +{channel.metrics['30d'].roi}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}