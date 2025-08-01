import { ChannelDetail, ChartPoint, Tip, Review, FAQ } from '@/lib/types/channel';
import { mockChannels } from './mock-channels';
import { addDays, format, subDays } from 'date-fns';

// Generate chart data for different periods
function generateChartData(period: string): ChartPoint[] {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '3m' ? 90 : 
               period === '6m' ? 180 : period === '1y' ? 365 : 730;
  
  const data: ChartPoint[] = [];
  let cumulativeProfit = 0;
  
  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayProfit = Math.random() * 10 - 3; // -3 to +7 units per day
    cumulativeProfit += dayProfit;
    
    data.push({
      date,
      value: Math.round(cumulativeProfit * 10) / 10,
      profit: Math.round(dayProfit * 10) / 10
    });
  }
  
  return data;
}

// Generate recent tips
function generateTips(count: number): Tip[] {
  const tips: Tip[] = [];
  const events = [
    'Real Madrid vs Barcelona', 'Man City vs Liverpool', 'Lakers vs Warriors',
    'Juventus vs Milan', 'PSG vs Lyon', 'Chelsea vs Arsenal',
    'Bayern vs Dortmund', 'Celtics vs Heat', 'Inter vs Roma'
  ];
  const markets = ['Over 2.5', 'Under 2.5', 'BTTS', 'Home Win', 'Away Win', 'Draw', 'Player Points O/U'];
  
  for (let i = 0; i < count; i++) {
    const isWin = Math.random() > 0.4;
    const odd = 1.7 + Math.random() * 0.8;
    const stake = Math.floor(Math.random() * 3) + 1;
    
    tips.push({
      id: `tip-${i}`,
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      event: events[Math.floor(Math.random() * events.length)],
      market: markets[Math.floor(Math.random() * markets.length)],
      odd: Math.round(odd * 100) / 100,
      stake,
      status: isWin ? 'win' : 'loss',
      return: isWin ? Math.round(stake * (odd - 1) * 100) / 100 : -stake
    });
  }
  
  return tips;
}

// Generate reviews
function generateReviews(): Review[] {
  return [
    {
      id: 'r1',
      author: 'Pedro Silva',
      avatar: 'PS',
      rating: 5,
      comment: 'Excelente trabalho! ROI consistente e gestão de banca impecável.',
      date: '2024-01-15'
    },
    {
      id: 'r2',
      author: 'Ana Costa',
      avatar: 'AC',
      rating: 4,
      comment: 'Muito bom, mas gostaria de mais tips em jogos menores.',
      date: '2024-01-10'
    },
    {
      id: 'r3',
      author: 'João Santos',
      avatar: 'JS',
      rating: 5,
      comment: 'Melhor tipster que já assinei. Vale cada centavo!',
      date: '2024-01-05'
    }
  ];
}

// Generate FAQs
function generateFAQs(tipsterName: string): FAQ[] {
  return [
    {
      id: 'f1',
      question: 'Qual o horário de envio das tips?',
      answer: `${tipsterName} envia as tips sempre entre 18h e 20h, com pelo menos 2 horas de antecedência do jogo.`
    },
    {
      id: 'f2',
      question: 'Qual gestão de banca recomendada?',
      answer: 'Recomendamos usar entre 1-3% da banca por aposta, seguindo as unidades indicadas.'
    },
    {
      id: 'f3',
      question: 'Posso usar qualquer casa de apostas?',
      answer: 'Sim, mas recomendamos casas com alta liquidez como Bet365 e Pinnacle para melhores odds.'
    }
  ];
}

// Create detailed data for each channel
export function getChannelDetail(slug: string): ChannelDetail | null {
  const channel = mockChannels.find(c => 
    c.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
  
  if (!channel) return null;
  
  // Different plan configurations based on channel
  const planConfigs = {
    1: [ // Only monthly
      { id: 'p1', name: 'Mensal', duration: 30, price: 149.90, features: ['Todas as tips', 'Suporte no Telegram'] }
    ],
    2: [ // Monthly + Quarterly
      { id: 'p1', name: 'Mensal', duration: 30, price: 199.90, features: ['Todas as tips', 'Suporte no Telegram'] },
      { id: 'p2', name: 'Trimestral', duration: 90, price: 509.90, originalPrice: 599.70, discount: 15, isPopular: true, features: ['Todas as tips', 'Suporte prioritário', 'Relatórios mensais'] }
    ],
    3: [ // Monthly + Quarterly + Semi-annual
      { id: 'p1', name: 'Mensal', duration: 30, price: 99.90, features: ['Todas as tips', 'Suporte no Telegram'] },
      { id: 'p2', name: 'Trimestral', duration: 90, price: 254.90, originalPrice: 299.70, discount: 15, features: ['Todas as tips', 'Suporte prioritário'] },
      { id: 'p3', name: 'Semestral', duration: 180, price: 479.90, originalPrice: 599.40, discount: 20, isPopular: true, features: ['Todas as tips', 'Suporte VIP', 'Análises exclusivas'] }
    ],
    4: [ // All plans including season
      { id: 'p1', name: 'Mensal', duration: 30, price: 299.90, features: ['Todas as tips', 'Suporte no Telegram'] },
      { id: 'p2', name: 'Trimestral', duration: 90, price: 764.90, originalPrice: 899.70, discount: 15, features: ['Todas as tips', 'Suporte prioritário'] },
      { id: 'p3', name: 'Semestral', duration: 180, price: 1439.90, originalPrice: 1799.40, discount: 20, features: ['Todas as tips', 'Suporte VIP'] },
      { id: 'p4', name: 'Temporada', duration: 300, price: 1949.90, originalPrice: 2999.00, discount: 35, isPopular: true, features: ['Todas as tips', 'Suporte VIP 24/7', 'Grupo exclusivo', 'Mentoria mensal'] }
    ]
  };
  
  // Select plan config based on channel ID pattern
  const planIndex = ((channel.id - 1) % 4) + 1;
  const subscriptionPlans = planConfigs[planIndex as keyof typeof planConfigs] || planConfigs[1];
  
  // Generate detailed metrics for each period
  const detailedMetrics = {
    '7d': {
      roi: channel.metrics['7d'].roi,
      profit: channel.metrics['7d'].profitUnits,
      winRate: 58.5,
      totalBets: 42,
      avgOdds: channel.metrics['7d'].avgOdds,
      maxDrawdown: channel.metrics['7d'].mdd,
      chartData: generateChartData('7d')
    },
    'MTD': {
      roi: channel.metrics['MTD'].roi,
      profit: channel.metrics['MTD'].profitUnits,
      winRate: 57.2,
      totalBets: 98,
      avgOdds: channel.metrics['MTD'].avgOdds,
      maxDrawdown: channel.metrics['MTD'].mdd,
      chartData: generateChartData('30d')
    },
    '30d': {
      roi: channel.metrics['30d'].roi,
      profit: channel.metrics['30d'].profitUnits,
      winRate: 56.8,
      totalBets: 156,
      avgOdds: channel.metrics['30d'].avgOdds,
      maxDrawdown: channel.metrics['30d'].mdd,
      chartData: generateChartData('30d')
    },
    '180d': {
      roi: channel.metrics['180d'].roi,
      profit: channel.metrics['180d'].profitUnits,
      winRate: 55.9,
      totalBets: 892,
      avgOdds: channel.metrics['180d'].avgOdds,
      maxDrawdown: channel.metrics['180d'].mdd,
      chartData: generateChartData('6m')
    },
    'YTD': {
      roi: channel.metrics['YTD'].roi,
      profit: channel.metrics['YTD'].profitUnits,
      winRate: 56.3,
      totalBets: 1456,
      avgOdds: channel.metrics['YTD'].avgOdds,
      maxDrawdown: channel.metrics['YTD'].mdd,
      chartData: generateChartData('1y')
    },
    'all': {
      roi: channel.metrics['all'].roi,
      profit: channel.metrics['all'].profitUnits,
      winRate: 55.7,
      totalBets: channel.totalTips,
      avgOdds: channel.metrics['all'].avgOdds,
      maxDrawdown: channel.metrics['all'].mdd,
      chartData: generateChartData('all')
    }
  };
  
  return {
    ...channel,
    slug,
    subscriptionPlans,
    detailedMetrics,
    recentTips: generateTips(20),
    about: {
      bio: `${channel.tipster} é um dos tipsters mais respeitados do mercado, com anos de experiência em ${channel.tags.sport}.`,
      methodology: `Utilizo ${channel.tags.method} combinado com análise estatística avançada para identificar value bets em ${channel.tags.market}.`,
      specialties: [channel.tags.sport, channel.tags.market, channel.tags.bookmaker],
      experience: 'Mais de 5 anos no mercado de apostas profissionais'
    },
    reviews: generateReviews(),
    faqs: generateFAQs(channel.tipster)
  };
}

// Get all channel slugs for static generation
export function getAllChannelSlugs(): string[] {
  return mockChannels.map(channel => 
    channel.name.toLowerCase().replace(/\s+/g, '-')
  );
}