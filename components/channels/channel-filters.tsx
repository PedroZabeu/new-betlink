"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter } from "lucide-react";
import { 
  FilterState, 
  TimeWindow, 
  TIME_WINDOW_LABELS,
  SPORT_OPTIONS,
  BOOKMAKER_OPTIONS,
  METHOD_OPTIONS,
  MARKET_OPTIONS,
  Liquidity,
  Availability
} from "@/lib/types/channel";
import { logger } from "@/lib/utils/logger";

interface ChannelFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

const FEATURE_NAME = '[Feature 2.11: Channel Discovery]';

export function ChannelFilters({ filters, onFiltersChange, activeFiltersCount }: ChannelFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    logger.info(`${FEATURE_NAME} Filter updated`, { 
      filterType: key,
      value 
    });
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateTagFilter = (tagType: keyof typeof filters.tags, value: string, checked: boolean) => {
    const currentTags = filters.tags[tagType];
    const updatedTags = checked 
      ? [...currentTags, value]
      : currentTags.filter(tag => tag !== value);
    
    logger.info(`${FEATURE_NAME} Tag filter ${checked ? 'added' : 'removed'}`, { 
      tagType,
      value,
      totalSelected: updatedTags.length
    });
    
    onFiltersChange({
      ...filters,
      tags: {
        ...filters.tags,
        [tagType]: updatedTags
      }
    });
  };

  const clearFilters = () => {
    logger.info(`${FEATURE_NAME} Filters cleared from filter panel`);
    onFiltersChange({
      timeWindow: '30d',
      priceRange: [0, 500],
      tags: {
        sports: [],
        bookmakers: [],
        methods: [],
        markets: [],
        liquidity: []
      },
      availability: 'all',
      searchQuery: '',
      sortBy: 'popular'
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Window */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">Janela Temporal</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <RadioGroup value={filters.timeWindow} onValueChange={(value) => updateFilter('timeWindow', value as TimeWindow)}>
              {Object.entries(TIME_WINDOW_LABELS).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={value} id={`time-${value}`} />
                  <Label htmlFor={`time-${value}`} className="cursor-pointer text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">Preço Mensal</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>R$ {filters.priceRange[0]}</span>
                <span>R$ {filters.priceRange[1]}</span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                onValueCommit={(value) => {
                  logger.info(`${FEATURE_NAME} Price range committed`, { 
                    range: value,
                    min: value[0],
                    max: value[1]
                  });
                }}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Sports */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">
              Esportes {filters.tags.sports.length > 0 && `(${filters.tags.sports.length})`}
            </Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            {SPORT_OPTIONS.map((sport) => (
              <div key={sport} className="flex items-center space-x-2">
                <Checkbox 
                  id={`sport-${sport}`}
                  checked={filters.tags.sports.includes(sport)}
                  onCheckedChange={(checked) => updateTagFilter('sports', sport, checked as boolean)}
                />
                <Label htmlFor={`sport-${sport}`} className="cursor-pointer text-sm font-normal">
                  {sport}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Bookmakers */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">
              Casas de Aposta {filters.tags.bookmakers.length > 0 && `(${filters.tags.bookmakers.length})`}
            </Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            {BOOKMAKER_OPTIONS.map((bookmaker) => (
              <div key={bookmaker} className="flex items-center space-x-2">
                <Checkbox 
                  id={`bookmaker-${bookmaker}`}
                  checked={filters.tags.bookmakers.includes(bookmaker)}
                  onCheckedChange={(checked) => updateTagFilter('bookmakers', bookmaker, checked as boolean)}
                />
                <Label htmlFor={`bookmaker-${bookmaker}`} className="cursor-pointer text-sm font-normal">
                  {bookmaker}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Methods */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">
              Métodos {filters.tags.methods.length > 0 && `(${filters.tags.methods.length})`}
            </Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            {METHOD_OPTIONS.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox 
                  id={`method-${method}`}
                  checked={filters.tags.methods.includes(method)}
                  onCheckedChange={(checked) => updateTagFilter('methods', method, checked as boolean)}
                />
                <Label htmlFor={`method-${method}`} className="cursor-pointer text-sm font-normal">
                  {method}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Liquidity */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">
              Liquidez {filters.tags.liquidity.length > 0 && `(${filters.tags.liquidity.length})`}
            </Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            {(['alta', 'média', 'baixa'] as Liquidity[]).map((liquidity) => (
              <div key={liquidity} className="flex items-center space-x-2">
                <Checkbox 
                  id={`liquidity-${liquidity}`}
                  checked={filters.tags.liquidity.includes(liquidity)}
                  onCheckedChange={(checked) => updateTagFilter('liquidity', liquidity, checked as boolean)}
                />
                <Label htmlFor={`liquidity-${liquidity}`} className="cursor-pointer text-sm font-normal capitalize">
                  {liquidity}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Availability */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
            <Label className="cursor-pointer">Disponibilidade</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <RadioGroup value={filters.availability} onValueChange={(value) => updateFilter('availability', value as Availability)}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="all" id="avail-all" />
                <Label htmlFor="avail-all" className="cursor-pointer text-sm font-normal">
                  Todos
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="available" id="avail-available" />
                <Label htmlFor="avail-available" className="cursor-pointer text-sm font-normal">
                  Com vagas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="waitlist" id="avail-waitlist" />
                <Label htmlFor="avail-waitlist" className="cursor-pointer text-sm font-normal">
                  Lista de espera
                </Label>
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          <Button className="w-full" onClick={() => {
            logger.info(`${FEATURE_NAME} Apply filters clicked`, {
              activeFiltersCount
            });
          }}>
            Aplicar Filtros
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}