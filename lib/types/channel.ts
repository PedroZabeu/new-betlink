// Channel types for the discovery page

export type TimeWindow = '7d' | 'MTD' | '30d' | '180d' | 'YTD' | 'all';
export type Liquidity = 'alta' | 'média' | 'baixa';
export type SortOption = 'popular' | 'roi' | 'price-low' | 'price-high';
export type Availability = 'available' | 'waitlist' | 'all';

export interface ChannelMetrics {
  roi: number;          // Ex: +18.5
  profitUnits: number;  // Ex: +127.3
  mdd: number;          // Ex: -23.5 (Maximum Drawdown)
  avgOdds: number;      // Ex: 2.15
  volumeUnits: number;  // Ex: 892
  rating: number;       // Ex: 4.8
}

export interface ChannelTags {
  sport: string;        // futebol, basquete, NFL, etc
  bookmaker: string;    // bet365, pinnacle, betfair
  method: string;       // model, arb, chasing, comp
  market: string;       // player_prop, spread, total, ML
  liquidity: Liquidity;
}

export interface ChannelCard {
  // Identification
  id: number;
  name: string;
  tipster: string;
  avatar: string;
  isPremium: boolean;
  description: string;
  
  // Dynamic metrics by time window
  metrics: Record<TimeWindow, ChannelMetrics>;
  
  // Tags
  tags: ChannelTags;
  
  // Occupancy
  subscribers: number;
  maxSubscribers: number;
  
  // Pricing
  price: number;
  
  // Metadata
  createdAt: string;
  totalTips: number;
}

export interface FilterState {
  timeWindow: TimeWindow;
  priceRange: [number, number];
  tags: {
    sports: string[];
    bookmakers: string[];
    methods: string[];
    markets: string[];
    liquidity: Liquidity[];
  };
  availability: Availability;
  searchQuery: string;
  sortBy: SortOption;
}

// Tag options for filters
export const SPORT_OPTIONS = [
  'Futebol',
  'Basquete', 
  'NFL',
  'NBA',
  'Tênis',
  'MMA',
  'Baseball',
  'eSports',
  'Multi'
];

export const BOOKMAKER_OPTIONS = [
  'Bet365',
  'Pinnacle',
  'Betfair',
  'Betano',
  'SportingBet',
  'Multi'
];

export const METHOD_OPTIONS = [
  'Model',
  'Arbitragem',
  'Chasing',
  'Value Betting',
  'Comp',
  'Insider'
];

export const MARKET_OPTIONS = [
  'Over/Under',
  'Spread',
  'Money Line',
  '1X2',
  'Player Props',
  'Handicap Asiático'
];

export const TIME_WINDOW_LABELS: Record<TimeWindow, string> = {
  '7d': '7 dias',
  'MTD': 'Mês atual',
  '30d': '30 dias',
  '180d': '6 meses',
  'YTD': 'Ano atual',
  'all': 'Todo período'
};

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Mais Populares' },
  { value: 'roi', label: 'Maior ROI' },
  { value: 'price-low', label: 'Menor Preço' },
  { value: 'price-high', label: 'Maior Preço' }
];