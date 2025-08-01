'use client';

import { useState } from 'react';
import { SubscriptionPlan } from '@/lib/types/channel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SubscriptionPlansCardProps {
  plans: SubscriptionPlan[];
  channelName: string;
}

export default function SubscriptionPlansCard({ plans, channelName }: SubscriptionPlansCardProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();
  
  const handleSubscribe = (planId: string) => {
    // TODO: In Feature 2.13, this will navigate to the subscription flow
    console.log('Subscribe to plan:', planId);
    alert('Fluxo de assinatura será implementado na Feature 2.13');
  };
  
  return (
    <Card id="subscription-plans">
      <CardHeader>
        <CardTitle>Planos de Assinatura</CardTitle>
        <CardDescription>
          Escolha o plano ideal para você e comece a lucrar com {channelName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-4",
          plans.length === 1 ? "lg:grid-cols-1" :
          plans.length === 2 ? "lg:grid-cols-2" :
          plans.length === 3 ? "lg:grid-cols-3" :
          "lg:grid-cols-4"
        )}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const savings = plan.originalPrice ? plan.originalPrice - plan.price : 0;
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-lg border-2 p-6 cursor-pointer transition-all",
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  plan.isPopular && "shadow-lg"
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.duration} dias</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {plan.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    
                    {plan.discount && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {plan.discount}% OFF
                        </Badge>
                        <span className="text-sm text-green-700">
                          Economize R$ {savings.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      R$ {(plan.price / plan.duration * 30).toFixed(2).replace('.', ',')}/mês
                    </p>
                  </div>
                  
                  {plan.features && (
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <Button
                    className="w-full"
                    variant={isSelected ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan.id);
                    }}
                  >
                    {isSelected ? "Assinar Agora" : "Selecionar Plano"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}