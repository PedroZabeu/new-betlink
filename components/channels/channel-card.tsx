import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star, ChevronRight } from "lucide-react";
import { ChannelCard as ChannelCardType, TimeWindow } from "@/lib/types/channel";
import { logger } from "@/lib/utils/logger";
import { useRouter } from "next/navigation";

interface ChannelCardProps {
  channel: ChannelCardType;
  timeWindow: TimeWindow;
}

const FEATURE_NAME = '[Feature 2.11: Channel Discovery]';

export function ChannelCard({ channel, timeWindow }: ChannelCardProps) {
  const router = useRouter();
  const metrics = channel.metrics[timeWindow];
  const occupancyRate = (channel.subscribers / channel.maxSubscribers) * 100;
  const isAlmostFull = occupancyRate >= 90;
  const hasWaitlist = occupancyRate >= 100;
  
  const channelSlug = channel.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                {channel.avatar}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg leading-tight truncate pr-2">
                  {channel.name}
                </h3>
                <p className="text-sm text-muted-foreground">por {channel.tipster}</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">{channel.tags.sport}</Badge>
          </div>
          {channel.isPremium && (
            <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {channel.description}
        </p>

        {/* Metrics Grid 3x2 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">ROI</p>
            <p className="font-bold text-green-600 text-sm sm:text-base">+{metrics.roi}%</p>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Lucro</p>
            <p className="font-bold text-sm sm:text-base">+{metrics.profitUnits}u</p>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">MDD</p>
            <p className="font-bold text-red-600 text-sm sm:text-base">{metrics.mdd}u</p>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Odds Média</p>
            <p className="font-bold text-sm sm:text-base">{metrics.avgOdds}</p>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-bold text-sm sm:text-base">{metrics.volumeUnits}u</p>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Avaliação</p>
            <p className="font-bold flex items-center justify-center gap-1 text-sm sm:text-base">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {metrics.rating}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">{channel.tags.method}</Badge>
          <Badge variant="outline" className="text-xs">{channel.tags.bookmaker}</Badge>
          <Badge variant="outline" className="text-xs capitalize">{channel.tags.liquidity} Liquidez</Badge>
          <Badge variant="outline" className="text-xs">{channel.tags.market}</Badge>
        </div>

        {/* Occupancy Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Ocupação do canal</span>
            <span>{Math.round(occupancyRate)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {hasWaitlist ? (
              <span className="text-orange-600 font-medium">Lista de espera</span>
            ) : isAlmostFull ? (
              <span className="text-orange-600 font-medium">{channel.subscribers}/{channel.maxSubscribers} vagas (últimas!)</span>
            ) : (
              <span>{channel.subscribers}/{channel.maxSubscribers} vagas</span>
            )}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-2xl font-bold">R$ {channel.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">por mês</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2" 
            onClick={() => {
              logger.info(`${FEATURE_NAME} View details clicked`, {
                channelId: channel.id,
                channelName: channel.name,
                tipster: channel.tipster,
                price: channel.price
              });
              router.push(`/canais/${channelSlug}`);
            }}
          >
            Ver Detalhes
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            className="gap-2" 
            disabled={hasWaitlist}
            onClick={() => {
              logger.info(`${FEATURE_NAME} Subscribe clicked`, {
                channelId: channel.id,
                channelName: channel.name,
                tipster: channel.tipster,
                price: channel.price,
                hasWaitlist,
                occupancyRate: Math.round(occupancyRate)
              });
            }}
          >
            {hasWaitlist ? 'Lista de Espera' : 'Assinar Canal'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}