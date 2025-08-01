import { ChannelCard } from '@/lib/types/channel';

export const mockChannels: ChannelCard[] = [
  {
    id: 1,
    name: "Futebol Europeu Premium",
    tipster: "Carlos Silva",
    avatar: "CS",
    isPremium: true,
    description: "Especialista em ligas top 5 europeias com modelo matemático proprietário",
    metrics: {
      '7d': { roi: 23.5, profitUnits: 45.2, mdd: -12.3, avgOdds: 2.08, volumeUnits: 192, rating: 4.9 },
      'MTD': { roi: 19.8, profitUnits: 89.7, mdd: -18.4, avgOdds: 2.12, volumeUnits: 453, rating: 4.9 },
      '30d': { roi: 18.5, profitUnits: 127.3, mdd: -23.5, avgOdds: 2.15, volumeUnits: 687, rating: 4.8 },
      '180d': { roi: 15.2, profitUnits: 412.8, mdd: -45.2, avgOdds: 2.18, volumeUnits: 2714, rating: 4.8 },
      'YTD': { roi: 16.8, profitUnits: 892.4, mdd: -67.3, avgOdds: 2.16, volumeUnits: 5312, rating: 4.8 },
      'all': { roi: 14.3, profitUnits: 1843.7, mdd: -89.5, avgOdds: 2.20, volumeUnits: 12892, rating: 4.7 }
    },
    tags: {
      sport: "Futebol",
      bookmaker: "Pinnacle",
      method: "Model",
      market: "Over/Under",
      liquidity: "alta"
    },
    subscribers: 487,
    maxSubscribers: 500,
    price: 149.90,
    createdAt: "2023-03-15",
    totalTips: 2847
  },
  {
    id: 2,
    name: "NBA Props Master",
    tipster: "Michael Johnson",
    avatar: "MJ",
    isPremium: true,
    description: "Player props NBA com análise estatística avançada e alta liquidez",
    metrics: {
      '7d': { roi: 31.2, profitUnits: 67.8, mdd: -8.9, avgOdds: 1.95, volumeUnits: 217, rating: 5.0 },
      'MTD': { roi: 28.4, profitUnits: 142.3, mdd: -15.2, avgOdds: 1.97, volumeUnits: 501, rating: 5.0 },
      '30d': { roi: 25.7, profitUnits: 198.4, mdd: -22.1, avgOdds: 1.98, volumeUnits: 772, rating: 4.9 },
      '180d': { roi: 22.3, profitUnits: 567.2, mdd: -38.7, avgOdds: 2.01, volumeUnits: 2543, rating: 4.9 },
      'YTD': { roi: 24.1, profitUnits: 1123.8, mdd: -52.4, avgOdds: 2.00, volumeUnits: 4662, rating: 4.9 },
      'all': { roi: 21.8, profitUnits: 2341.5, mdd: -71.3, avgOdds: 2.02, volumeUnits: 10743, rating: 4.8 }
    },
    tags: {
      sport: "NBA",
      bookmaker: "Bet365",
      method: "Value Betting",
      market: "Player Props",
      liquidity: "alta"
    },
    subscribers: 234,
    maxSubscribers: 300,
    price: 199.90,
    createdAt: "2022-10-20",
    totalTips: 3156
  },
  {
    id: 3,
    name: "Arbitragem Tênis ATP",
    tipster: "Roberto Lima",
    avatar: "RL",
    isPremium: false,
    description: "Oportunidades de arbitragem em ATP e WTA com ROI garantido",
    metrics: {
      '7d': { roi: 8.3, profitUnits: 23.4, mdd: -3.2, avgOdds: 3.45, volumeUnits: 282, rating: 4.6 },
      'MTD': { roi: 7.9, profitUnits: 45.7, mdd: -5.8, avgOdds: 3.52, volumeUnits: 579, rating: 4.6 },
      '30d': { roi: 7.2, profitUnits: 67.8, mdd: -8.4, avgOdds: 3.58, volumeUnits: 942, rating: 4.5 },
      '180d': { roi: 6.8, profitUnits: 234.5, mdd: -15.3, avgOdds: 3.61, volumeUnits: 3448, rating: 4.5 },
      'YTD': { roi: 7.1, profitUnits: 432.1, mdd: -21.7, avgOdds: 3.59, volumeUnits: 6087, rating: 4.5 },
      'all': { roi: 6.5, profitUnits: 876.3, mdd: -32.4, avgOdds: 3.63, volumeUnits: 13482, rating: 4.4 }
    },
    tags: {
      sport: "Tênis",
      bookmaker: "Multi",
      method: "Arbitragem",
      market: "Money Line",
      liquidity: "baixa"
    },
    subscribers: 178,
    maxSubscribers: 200,
    price: 129.90,
    createdAt: "2023-01-10",
    totalTips: 4231
  },
  {
    id: 4,
    name: "NFL Underdogs System",
    tipster: "Jake Williams",
    avatar: "JW",
    isPremium: true,
    description: "Sistema contrarian focado em underdogs NFL com spreads alternativos",
    metrics: {
      '7d': { roi: 42.3, profitUnits: 89.2, mdd: -15.6, avgOdds: 2.85, volumeUnits: 211, rating: 4.7 },
      'MTD': { roi: 38.7, profitUnits: 167.3, mdd: -23.4, avgOdds: 2.88, volumeUnits: 432, rating: 4.7 },
      '30d': { roi: 35.2, profitUnits: 234.5, mdd: -31.2, avgOdds: 2.91, volumeUnits: 666, rating: 4.7 },
      '180d': { roi: 31.8, profitUnits: 678.9, mdd: -48.7, avgOdds: 2.93, volumeUnits: 2135, rating: 4.6 },
      'YTD': { roi: 33.4, profitUnits: 1234.7, mdd: -62.3, avgOdds: 2.92, volumeUnits: 3695, rating: 4.6 },
      'all': { roi: 29.7, profitUnits: 2456.8, mdd: -87.4, avgOdds: 2.95, volumeUnits: 8271, rating: 4.5 }
    },
    tags: {
      sport: "NFL",
      bookmaker: "Pinnacle",
      method: "Value Betting",
      market: "Spread",
      liquidity: "média"
    },
    subscribers: 95,
    maxSubscribers: 100,
    price: 299.90,
    createdAt: "2022-09-01",
    totalTips: 1892
  },
  {
    id: 5,
    name: "MMA Insider Tips",
    tipster: "Pedro Costa",
    avatar: "PC",
    isPremium: true,
    description: "Inside info UFC e Bellator com análise técnica detalhada de lutas",
    metrics: {
      '7d': { roi: 52.4, profitUnits: 78.6, mdd: -12.3, avgOdds: 2.42, volumeUnits: 150, rating: 4.8 },
      'MTD': { roi: 47.8, profitUnits: 156.2, mdd: -19.7, avgOdds: 2.45, volumeUnits: 327, rating: 4.8 },
      '30d': { roi: 43.2, profitUnits: 234.7, mdd: -28.4, avgOdds: 2.48, volumeUnits: 543, rating: 4.8 },
      '180d': { roi: 38.9, profitUnits: 712.3, mdd: -42.1, avgOdds: 2.51, volumeUnits: 1831, rating: 4.7 },
      'YTD': { roi: 41.2, profitUnits: 1342.8, mdd: -56.8, avgOdds: 2.50, volumeUnits: 3259, rating: 4.7 },
      'all': { roi: 36.7, profitUnits: 2567.4, mdd: -78.3, avgOdds: 2.53, volumeUnits: 6994, rating: 4.6 }
    },
    tags: {
      sport: "MMA",
      bookmaker: "Betfair",
      method: "Insider",
      market: "Money Line",
      liquidity: "média"
    },
    subscribers: 156,
    maxSubscribers: 200,
    price: 179.90,
    createdAt: "2023-02-20",
    totalTips: 892
  },
  {
    id: 6,
    name: "Basquete Asiático Pro",
    tipster: "Liu Chang",
    avatar: "LC",
    isPremium: false,
    description: "KBL, CBA e B-League com handicaps asiáticos e totais",
    metrics: {
      '7d': { roi: 19.8, profitUnits: 34.7, mdd: -9.2, avgOdds: 1.91, volumeUnits: 175, rating: 4.5 },
      'MTD': { roi: 17.3, profitUnits: 72.4, mdd: -14.6, avgOdds: 1.93, volumeUnits: 419, rating: 4.5 },
      '30d': { roi: 15.7, profitUnits: 112.8, mdd: -21.3, avgOdds: 1.94, volumeUnits: 719, rating: 4.4 },
      '180d': { roi: 13.4, profitUnits: 389.2, mdd: -35.7, avgOdds: 1.96, volumeUnits: 2904, rating: 4.4 },
      'YTD': { roi: 14.8, profitUnits: 723.4, mdd: -48.2, avgOdds: 1.95, volumeUnits: 4889, rating: 4.4 },
      'all': { roi: 12.6, profitUnits: 1456.7, mdd: -67.8, avgOdds: 1.97, volumeUnits: 11563, rating: 4.3 }
    },
    tags: {
      sport: "Basquete",
      bookmaker: "Bet365",
      method: "Model",
      market: "Handicap Asiático",
      liquidity: "baixa"
    },
    subscribers: 89,
    maxSubscribers: 150,
    price: 99.90,
    createdAt: "2023-04-05",
    totalTips: 2876
  },
  {
    id: 7,
    name: "Soccer Chasing System",
    tipster: "João Silva",
    avatar: "JS",
    isPremium: false,
    description: "Sistema progressivo em cartões e escanteios com gestão de banca",
    metrics: {
      '7d': { roi: 14.2, profitUnits: 28.4, mdd: -18.7, avgOdds: 2.32, volumeUnits: 200, rating: 4.2 },
      'MTD': { roi: 12.8, profitUnits: 56.3, mdd: -27.4, avgOdds: 2.35, volumeUnits: 440, rating: 4.2 },
      '30d': { roi: 11.3, profitUnits: 87.2, mdd: -38.2, avgOdds: 2.37, volumeUnits: 772, rating: 4.1 },
      '180d': { roi: 9.7, profitUnits: 312.4, mdd: -56.8, avgOdds: 2.40, volumeUnits: 3220, rating: 4.1 },
      'YTD': { roi: 10.8, profitUnits: 578.3, mdd: -74.3, avgOdds: 2.39, volumeUnits: 5354, rating: 4.1 },
      'all': { roi: 8.9, profitUnits: 1234.5, mdd: -98.7, avgOdds: 2.42, volumeUnits: 13867, rating: 4.0 }
    },
    tags: {
      sport: "Futebol",
      bookmaker: "Betano",
      method: "Chasing",
      market: "Over/Under",
      liquidity: "alta"
    },
    subscribers: 312,
    maxSubscribers: 400,
    price: 79.90,
    createdAt: "2022-11-15",
    totalTips: 4512
  },
  {
    id: 8,
    name: "Multi-Esportes Value",
    tipster: "Ana Santos",
    avatar: "AS",
    isPremium: true,
    description: "Expected Value positivo em diversos esportes e mercados",
    metrics: {
      '7d': { roi: 26.7, profitUnits: 53.4, mdd: -11.2, avgOdds: 2.67, volumeUnits: 200, rating: 4.9 },
      'MTD': { roi: 24.3, profitUnits: 112.6, mdd: -17.8, avgOdds: 2.71, volumeUnits: 463, rating: 4.9 },
      '30d': { roi: 22.3, profitUnits: 178.4, mdd: -25.3, avgOdds: 2.74, volumeUnits: 800, rating: 4.8 },
      '180d': { roi: 19.8, profitUnits: 612.7, mdd: -41.2, avgOdds: 2.77, volumeUnits: 3094, rating: 4.8 },
      'YTD': { roi: 21.4, profitUnits: 1156.8, mdd: -58.7, avgOdds: 2.76, volumeUnits: 5404, rating: 4.8 },
      'all': { roi: 18.7, profitUnits: 2389.4, mdd: -82.3, avgOdds: 2.79, volumeUnits: 12773, rating: 4.7 }
    },
    tags: {
      sport: "Multi",
      bookmaker: "Multi",
      method: "Value Betting",
      market: "1X2",
      liquidity: "média"
    },
    subscribers: 189,
    maxSubscribers: 250,
    price: 169.90,
    createdAt: "2022-08-10",
    totalTips: 3789
  },
  {
    id: 9,
    name: "eSports Rising Stars",
    tipster: "Kevin Park",
    avatar: "KP",
    isPremium: false,
    description: "CS:GO, LoL e Valorant com foco em mercados de handicap",
    metrics: {
      '7d': { roi: 37.8, profitUnits: 64.3, mdd: -14.5, avgOdds: 2.23, volumeUnits: 170, rating: 4.7 },
      'MTD': { roi: 34.2, profitUnits: 128.7, mdd: -22.3, avgOdds: 2.26, volumeUnits: 376, rating: 4.7 },
      '30d': { roi: 31.5, profitUnits: 189.4, mdd: -31.7, avgOdds: 2.28, volumeUnits: 601, rating: 4.6 },
      '180d': { roi: 28.3, profitUnits: 623.8, mdd: -47.2, avgOdds: 2.31, volumeUnits: 2204, rating: 4.6 },
      'YTD': { roi: 30.1, profitUnits: 1167.3, mdd: -63.8, avgOdds: 2.30, volumeUnits: 3879, rating: 4.6 },
      'all': { roi: 26.4, profitUnits: 2234.7, mdd: -85.6, avgOdds: 2.33, volumeUnits: 8461, rating: 4.5 }
    },
    tags: {
      sport: "eSports",
      bookmaker: "Pinnacle",
      method: "Model",
      market: "Spread",
      liquidity: "baixa"
    },
    subscribers: 142,
    maxSubscribers: 200,
    price: 119.90,
    createdAt: "2023-05-22",
    totalTips: 2134
  },
  {
    id: 10,
    name: "Baseball Totals AI",
    tipster: "David Thompson",
    avatar: "DT",
    isPremium: true,
    description: "MLB totals via machine learning com 70%+ de acerto",
    metrics: {
      '7d': { roi: 21.3, profitUnits: 42.6, mdd: -10.8, avgOdds: 1.89, volumeUnits: 200, rating: 4.8 },
      'MTD': { roi: 19.7, profitUnits: 88.7, mdd: -16.2, avgOdds: 1.91, volumeUnits: 450, rating: 4.8 },
      '30d': { roi: 18.2, profitUnits: 145.6, mdd: -23.7, avgOdds: 1.92, volumeUnits: 800, rating: 4.7 },
      '180d': { roi: 16.4, profitUnits: 492.3, mdd: -37.4, avgOdds: 1.94, volumeUnits: 3001, rating: 4.7 },
      'YTD': { roi: 17.8, profitUnits: 923.7, mdd: -51.2, avgOdds: 1.93, volumeUnits: 5189, rating: 4.7 },
      'all': { roi: 15.3, profitUnits: 1876.4, mdd: -72.8, avgOdds: 1.95, volumeUnits: 12259, rating: 4.6 }
    },
    tags: {
      sport: "Baseball",
      bookmaker: "Bet365",
      method: "Model",
      market: "Over/Under",
      liquidity: "alta"
    },
    subscribers: 176,
    maxSubscribers: 200,
    price: 189.90,
    createdAt: "2022-07-18",
    totalTips: 3654
  },
  {
    id: 11,
    name: "Cartões Vermelhos Pro",
    tipster: "Felipe Oliveira",
    avatar: "FO",
    isPremium: false,
    description: "Especialista em cartões vermelhos nas principais ligas com odds altas",
    metrics: {
      '7d': { roi: 45.6, profitUnits: 68.4, mdd: -22.3, avgOdds: 4.85, volumeUnits: 150, rating: 4.4 },
      'MTD': { roi: 41.2, profitUnits: 144.2, mdd: -34.7, avgOdds: 4.92, volumeUnits: 350, rating: 4.4 },
      '30d': { roi: 37.8, profitUnits: 227.3, mdd: -48.2, avgOdds: 4.95, volumeUnits: 601, rating: 4.3 },
      '180d': { roi: 34.2, profitUnits: 752.4, mdd: -71.6, avgOdds: 4.98, volumeUnits: 2200, rating: 4.3 },
      'YTD': { roi: 36.1, profitUnits: 1407.9, mdd: -93.4, avgOdds: 4.97, volumeUnits: 3900, rating: 4.3 },
      'all': { roi: 31.7, profitUnits: 2684.5, mdd: -127.8, avgOdds: 5.02, volumeUnits: 8467, rating: 4.2 }
    },
    tags: {
      sport: "Futebol",
      bookmaker: "SportingBet",
      method: "Comp",
      market: "Over/Under",
      liquidity: "baixa"
    },
    subscribers: 67,
    maxSubscribers: 100,
    price: 89.90,
    createdAt: "2023-06-30",
    totalTips: 1567
  },
  {
    id: 12,
    name: "NBA Live Betting",
    tipster: "Marcus Lee",
    avatar: "ML",
    isPremium: true,
    description: "Apostas ao vivo NBA com algoritmo de momentum e análise em tempo real",
    metrics: {
      '7d': { roi: 29.4, profitUnits: 58.8, mdd: -13.7, avgOdds: 2.12, volumeUnits: 200, rating: 5.0 },
      'MTD': { roi: 26.8, profitUnits: 120.6, mdd: -20.4, avgOdds: 2.15, volumeUnits: 450, rating: 5.0 },
      '30d': { roi: 24.5, profitUnits: 183.8, mdd: -29.1, avgOdds: 2.17, volumeUnits: 750, rating: 4.9 },
      '180d': { roi: 21.7, profitUnits: 607.6, mdd: -44.8, avgOdds: 2.20, volumeUnits: 2800, rating: 4.9 },
      'YTD': { roi: 23.2, profitUnits: 1137.4, mdd: -59.3, avgOdds: 2.19, volumeUnits: 4903, rating: 4.9 },
      'all': { roi: 20.1, profitUnits: 2214.8, mdd: -81.7, avgOdds: 2.22, volumeUnits: 11024, rating: 4.8 }
    },
    tags: {
      sport: "NBA",
      bookmaker: "Betfair",
      method: "Model",
      market: "Spread",
      liquidity: "alta"
    },
    subscribers: 198,
    maxSubscribers: 200,
    price: 249.90,
    createdAt: "2022-12-01",
    totalTips: 2987
  }
];

// Helper function to get channel by slug
export function getChannelBySlug(slug: string) {
  // Convert slug back to name (reverse the slug transformation)
  // Example: "futebol-europeu-premium" -> "Futebol Europeu Premium"
  const name = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Find channel by name (case insensitive)
  return mockChannels.find(channel => 
    channel.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
}