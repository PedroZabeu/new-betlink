"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, X } from "lucide-react";
import { ChannelCard } from "./channel-card";
import { ChannelFilters } from "./channel-filters";
import { ChannelsSkeleton } from "./channels-skeleton";
import { 
  ChannelCard as ChannelCardType, 
  FilterState, 
  SortOption,
  TimeWindow,
  SORT_OPTIONS
} from "@/lib/types/channel";
import { logger } from "@/lib/utils/logger";

interface ChannelsClientProps {
  channels: ChannelCardType[];
}

const FEATURE_NAME = '[Feature 2.11: Channel Discovery]';

export function ChannelsClient({ channels }: ChannelsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Log component mount
  useEffect(() => {
    logger.info(`${FEATURE_NAME} Component mounted`, {
      totalChannels: channels.length,
      urlParams: Object.fromEntries(searchParams.entries())
    });
    return () => {
      logger.debug(`${FEATURE_NAME} Component unmounted`);
    };
  }, []);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const timeWindow = (searchParams.get('timeWindow') as TimeWindow) || '30d';
    const sortBy = (searchParams.get('sortBy') as SortOption) || 'popular';
    const searchQuery = searchParams.get('q') || '';
    
    return {
      timeWindow,
      priceRange: [0, 500],
      tags: {
        sports: [],
        bookmakers: [],
        methods: [],
        markets: [],
        liquidity: []
      },
      availability: 'all',
      searchQuery,
      sortBy
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.timeWindow !== '30d') params.set('timeWindow', filters.timeWindow);
    if (filters.sortBy !== 'popular') params.set('sortBy', filters.sortBy);
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [filters.timeWindow, filters.sortBy, filters.searchQuery, router]);

  // Filter channels
  const filteredChannels = useMemo(() => {
    const startTime = performance.now();
    logger.info(`${FEATURE_NAME} Filtering channels started`, { 
      totalChannels: channels.length, 
      filters 
    });

    let filtered = [...channels];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(channel => 
        channel.name.toLowerCase().includes(query) ||
        channel.tipster.toLowerCase().includes(query) ||
        channel.description.toLowerCase().includes(query) ||
        channel.tags.sport.toLowerCase().includes(query)
      );
    }

    // Price range
    filtered = filtered.filter(channel => 
      channel.price >= filters.priceRange[0] && 
      channel.price <= filters.priceRange[1]
    );

    // Sports filter
    if (filters.tags.sports.length > 0) {
      filtered = filtered.filter(channel => 
        filters.tags.sports.includes(channel.tags.sport)
      );
    }

    // Bookmakers filter
    if (filters.tags.bookmakers.length > 0) {
      filtered = filtered.filter(channel => 
        filters.tags.bookmakers.includes(channel.tags.bookmaker)
      );
    }

    // Methods filter
    if (filters.tags.methods.length > 0) {
      filtered = filtered.filter(channel => 
        filters.tags.methods.includes(channel.tags.method)
      );
    }

    // Markets filter
    if (filters.tags.markets.length > 0) {
      filtered = filtered.filter(channel => 
        filters.tags.markets.includes(channel.tags.market)
      );
    }

    // Liquidity filter
    if (filters.tags.liquidity.length > 0) {
      filtered = filtered.filter(channel => 
        filters.tags.liquidity.includes(channel.tags.liquidity)
      );
    }

    // Availability filter
    if (filters.availability === 'available') {
      filtered = filtered.filter(channel => 
        channel.subscribers < channel.maxSubscribers
      );
    } else if (filters.availability === 'waitlist') {
      filtered = filtered.filter(channel => 
        channel.subscribers >= channel.maxSubscribers
      );
    }

    // Sort channels
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'roi':
          return b.metrics[filters.timeWindow].roi - a.metrics[filters.timeWindow].roi;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
        default:
          return b.subscribers - a.subscribers;
      }
    });

    const endTime = performance.now();
    const filterTime = Math.round(endTime - startTime);
    
    logger.info(`${FEATURE_NAME} Filtering complete`, { 
      filteredCount: filtered.length,
      filterTime: `${filterTime}ms`,
      appliedFilters: {
        hasSearch: !!filters.searchQuery,
        hasPriceFilter: filters.priceRange[0] > 0 || filters.priceRange[1] < 500,
        hasSportsFilter: filters.tags.sports.length > 0,
        hasBookmakersFilter: filters.tags.bookmakers.length > 0,
        hasMethodsFilter: filters.tags.methods.length > 0,
        hasMarketsFilter: filters.tags.markets.length > 0,
        hasLiquidityFilter: filters.tags.liquidity.length > 0,
        hasAvailabilityFilter: filters.availability !== 'all'
      }
    });

    return filtered;
  }, [channels, filters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.timeWindow !== '30d') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.searchQuery) count++;
    if (filters.availability !== 'all') count++;
    count += filters.tags.sports.length;
    count += filters.tags.bookmakers.length;
    count += filters.tags.methods.length;
    count += filters.tags.markets.length;
    count += filters.tags.liquidity.length;
    return count;
  }, [filters]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Filters */}
      <aside className="hidden lg:block lg:w-64 space-y-6">
        <ChannelFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          activeFiltersCount={activeFiltersCount}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search and Sort */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por canal, tipster ou esporte..."
                value={filters.searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  logger.info(`${FEATURE_NAME} Search query changed`, { 
                    query,
                    queryLength: query.length 
                  });
                  setFilters({ ...filters, searchQuery: query });
                }}
                className="pl-10 pr-10"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => {
                    logger.info(`${FEATURE_NAME} Search cleared`);
                    setFilters({ ...filters, searchQuery: '' });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted rounded p-1"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="mt-6">
                  <ChannelFilters 
                    filters={filters} 
                    onFiltersChange={setFilters}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredChannels.length} {filteredChannels.length === 1 ? 'canal encontrado' : 'canais encontrados'}
            </p>
            <Select value={filters.sortBy} onValueChange={(value) => {
              logger.info(`${FEATURE_NAME} Sort option changed`, { 
                from: filters.sortBy,
                to: value 
              });
              setFilters({ ...filters, sortBy: value as SortOption });
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChannels.map((channel) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              timeWindow={filters.timeWindow}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum canal encontrado com os filtros selecionados.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                logger.info(`${FEATURE_NAME} All filters cleared`);
                setFilters({
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
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredChannels.length > 0 && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                logger.info(`${FEATURE_NAME} Load more clicked`, {
                  currentlyShowing: filteredChannels.length
                });
                // TODO: Implement load more functionality
              }}
            >
              Carregar Mais Canais
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}