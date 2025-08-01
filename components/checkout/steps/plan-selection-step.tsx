"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChannelDetail } from "@/lib/data/mock-channel-details";
import { CheckoutData } from "../checkout-flow";
import { logger } from "@/lib/utils/logger";

interface PlanSelectionStepProps {
  channelDetail: ChannelDetail;
  checkoutData: CheckoutData;
  updateCheckoutData: (key: string, data: any) => void;
  onNext: () => void;
}

const FEATURE_NAME = '[Feature 2.13: Plan Selection]';

export function PlanSelectionStep({ 
  channelDetail, 
  checkoutData, 
  updateCheckoutData, 
  onNext 
}: PlanSelectionStepProps) {
  const [selectedPlan, setSelectedPlan] = useState(
    checkoutData.subscription?.planId || channelDetail.subscriptionPlans[0]?.id || ""
  );

  useEffect(() => {
    // Se já tem plano selecionado, atualizar
    if (checkoutData.subscription?.planId) {
      setSelectedPlan(checkoutData.subscription.planId);
    }
  }, [checkoutData.subscription]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    const plan = channelDetail.subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      logger.info(`${FEATURE_NAME} Plan selected`, {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        duration: plan.duration
      });

      updateCheckoutData('subscription', {
        channelId: channelDetail.id,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        duration: plan.duration,
      });
    }
  };

  const handleContinue = () => {
    const plan = channelDetail.subscriptionPlans.find(p => p.id === selectedPlan);
    if (plan) {
      updateCheckoutData('subscription', {
        channelId: channelDetail.id,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        duration: plan.duration,
      });
      onNext();
    }
  };

  const calculateMonthlyPrice = (price: number, duration: number) => {
    return (price / (duration / 30)).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha seu plano de assinatura</CardTitle>
        <CardDescription>
          Selecione o plano que melhor atende suas necessidades. Planos maiores oferecem melhor custo-benefício.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedPlan} onValueChange={handlePlanSelect}>
          <div className="space-y-4">
            {channelDetail.subscriptionPlans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration);
              
              return (
                <label
                  key={plan.id}
                  htmlFor={plan.id}
                  className={cn(
                    "relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors",
                    isSelected && "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <RadioGroupItem
                    value={plan.id}
                    id={plan.id}
                    className="mt-1"
                  />
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          {plan.isPopular && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Mais popular
                            </Badge>
                          )}
                          {plan.discount && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {plan.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.duration} dias de acesso
                        </p>

                        {plan.features && plan.features.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          R$ {plan.price.toFixed(2)}
                        </div>
                        {plan.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {plan.originalPrice.toFixed(2)}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          R$ {monthlyPrice}/mês
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>

        <Button
          onClick={handleContinue}
          className="w-full mt-6"
          size="lg"
          disabled={!selectedPlan}
        >
          Continuar com o plano selecionado
        </Button>
      </CardContent>
    </Card>
  );
}