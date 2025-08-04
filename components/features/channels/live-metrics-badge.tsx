'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LiveMetricsBadgeProps {
  size?: 'small' | 'large';
  className?: string;
}

export function LiveMetricsBadge({ 
  size = 'small',
  className 
}: LiveMetricsBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-1",
            size === 'small' ? "text-xs" : "text-sm",
            className
          )}>
            <Zap className={cn(
              "text-yellow-500 animate-pulse",
              size === 'small' ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span className="text-muted-foreground font-medium">
              Tempo Real
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Métricas calculadas com base em apostas reais</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}