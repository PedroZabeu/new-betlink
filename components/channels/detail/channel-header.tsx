'use client';

import { ChannelDetail } from '@/lib/types/channel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, TrendingUp } from 'lucide-react';

interface ChannelHeaderProps {
  channel: ChannelDetail;
}

export default function ChannelHeader({ channel }: ChannelHeaderProps) {
  const isAlmostFull = channel.subscribers >= channel.maxSubscribers * 0.9;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {channel.avatar}
          </div>
          
          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold">{channel.name}</h1>
              {channel.isPremium && (
                <Badge variant="default" className="bg-yellow-500">
                  Premium
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground">por {channel.tipster}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{channel.metrics['30d'].rating}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>
                  {channel.subscribers}/{channel.maxSubscribers} assinantes
                </span>
                {isAlmostFull && (
                  <Badge variant="destructive" className="ml-2">
                    Quase Lotado
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  +{channel.metrics['30d'].roi}% ROI (30d)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex flex-col items-start lg:items-end gap-2">
          <Button 
            size="lg"
            className="w-full lg:w-auto"
            onClick={() => {
              const plansSection = document.getElementById('subscription-plans');
              plansSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ver Planos de Assinatura
          </Button>
          <p className="text-sm text-muted-foreground">
            A partir de R$ {Math.min(...channel.subscriptionPlans.map(p => p.price)).toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-muted-foreground">{channel.description}</p>
      
      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary">{channel.tags.sport}</Badge>
        <Badge variant="secondary">{channel.tags.bookmaker}</Badge>
        <Badge variant="secondary">{channel.tags.method}</Badge>
        <Badge variant="secondary">{channel.tags.market}</Badge>
        <Badge variant="secondary">Liquidez {channel.tags.liquidity}</Badge>
      </div>
    </div>
  );
}