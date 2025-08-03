// Channel types for the discovery page

export type TimeWindow = '7d' | '30d' | '3m' | '6m' | 'ytd' | '12m' | 'all';
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
  '30d': '30 dias',
  '3m': '3 meses',
  '6m': '6 meses',
  'ytd': 'Ano atual',
  '12m': '12 meses',
  'all': 'Todo período'
};

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Mais Populares' },
  { value: 'roi', label: 'Maior ROI' },
  { value: 'price-low', label: 'Menor Preço' },
  { value: 'price-high', label: 'Maior Preço' }
];

// Types for channel detail page
export interface SubscriptionPlan {
  id: string;
  name: string; // "Mensal", "Trimestral", "Semestral", "Temporada"
  duration: number; // em dias
  price: number;
  originalPrice?: number; // para mostrar desconto
  discount?: number; // percentual de desconto
  features?: string[]; // benefícios específicos do plano
  isPopular?: boolean; // destacar plano mais vendido
}

export interface ChartPoint {
  date: string;
  value: number;
  profit: number;
}

export interface Tip {
  id: string;
  date: string;
  event: string;
  market: string;
  odd: number;
  stake: number;
  status: 'win' | 'loss' | 'void' | 'pending';
  return: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ChannelDetail extends ChannelCard {
  slug: string;
  
  // Planos de Assinatura (flexível por tipster)
  subscriptionPlans: SubscriptionPlan[];
  
  // Métricas detalhadas com gráfico por período
  detailedMetrics: Record<TimeWindow, {
    roi: number;
    profit: number;
    winRate: number;
    totalBets: number;
    avgOdds: number;
    maxDrawdown: number;
    chartData: ChartPoint[];
  }>;
  
  // Resultados
  recentTips: Tip[];
  
  // Informações
  about: {
    bio: string;
    methodology: string;
    specialties: string[];
    experience: string;
  };
  
  reviews: Review[];
  faqs: FAQ[];
}

// Period options for the detail page
export type DetailPeriod = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export const DETAIL_PERIOD_LABELS: Record<DetailPeriod, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '3m': '3 meses',
  '6m': '6 meses',
  '1y': '1 ano',
  'all': 'Total'
};