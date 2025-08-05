import { Tip } from '@/lib/types/tip';
import { format, subDays, subMonths, startOfYear } from 'date-fns';

/**
 * Calcula métricas agregadas de um conjunto de tips
 * Baseado nas fórmulas validadas em R
 */
export function calculateSummaryMetrics(tips: Tip[]) {
  let totalStake = 0;
  let totalProfit = 0;
  let winningStake = 0;
  let sumOddsStake = 0;
  
  tips.forEach(tip => {
    totalStake += tip.stake;
    totalProfit += tip.profit_loss;
    sumOddsStake += tip.odds * tip.stake;
    
    if (['green', 'half_green'].includes(tip.status)) {
      winningStake += tip.stake;
    }
  });
  
  // Calcular MDD (Maximum Drawdown)
  let runningBalance = 0;
  let peak = 0;
  let maxDrawdown = 0;
  
  tips.forEach(tip => {
    runningBalance += tip.profit_loss;
    if (runningBalance > peak) {
      peak = runningBalance;
    }
    const currentDrawdown = peak - runningBalance;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }
  });
  
  return {
    roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
    profit: totalProfit,
    hitRate: totalStake > 0 ? (winningStake / totalStake) * 100 : 0,
    avgOdds: totalStake > 0 ? sumOddsStake / totalStake : 0,
    totalTips: tips.length,
    winningTips: tips.filter(t => ['green', 'half_green'].includes(t.status)).length,
    totalStake,
    maxDrawdown
  };
}

/**
 * Calcula métricas acumuladas ao longo do tempo para o gráfico
 */
export function calculateTimelineMetrics(tips: Tip[]) {
  // Ordenar tips por data
  const sortedTips = [...tips].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
  
  // Agrupar por dia
  const dailyGroups = new Map<string, Tip[]>();
  
  sortedTips.forEach(tip => {
    const date = format(new Date(tip.event_date), 'yyyy-MM-dd');
    if (!dailyGroups.has(date)) {
      dailyGroups.set(date, []);
    }
    dailyGroups.get(date)!.push(tip);
  });
  
  // Calcular métricas acumuladas
  let cumulativeStake = 0;
  let cumulativeProfit = 0;
  const timeline: Array<{
    date: string;
    cumulativeROI: number;
    cumulativeProfit: number;
    dailyTips: number;
    dailyProfit: number;
    dailyROI: number;
  }> = [];
  
  Array.from(dailyGroups.entries()).forEach(([date, dayTips]) => {
    const stakeForDay = dayTips.reduce((sum, tip) => sum + tip.stake, 0);
    const profitForDay = dayTips.reduce((sum, tip) => sum + tip.profit_loss, 0);
    
    cumulativeStake += stakeForDay;
    cumulativeProfit += profitForDay;
    
    timeline.push({
      date,
      cumulativeROI: cumulativeStake > 0 ? (cumulativeProfit / cumulativeStake) * 100 : 0,
      cumulativeProfit,
      dailyTips: dayTips.length,
      dailyProfit: profitForDay,
      dailyROI: stakeForDay > 0 ? (profitForDay / stakeForDay) * 100 : 0
    });
  });
  
  return timeline;
}

/**
 * Retorna a data de início baseada no período selecionado
 */
export function getStartDateForPeriod(period: string): string {
  const today = new Date();
  
  let startDate: string;
  
  switch (period) {
    case '7d':
      startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      break;
    case '30d':
      startDate = format(subDays(today, 30), 'yyyy-MM-dd');
      break;
    case '3m':
      startDate = format(subMonths(today, 3), 'yyyy-MM-dd');
      break;
    case '6m':
      startDate = format(subMonths(today, 6), 'yyyy-MM-dd');
      break;
    case '12m':
      startDate = format(subMonths(today, 12), 'yyyy-MM-dd');
      break;
    case 'ytd':
      startDate = format(startOfYear(today), 'yyyy-MM-dd');
      break;
    case 'all':
      startDate = '2000-01-01'; // Data bem antiga para pegar tudo
      break;
    default:
      startDate = format(subDays(today, 30), 'yyyy-MM-dd');
  }
  
  return startDate;
}

/**
 * Retorna o label amigável para o período
 */
export function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '3m': 'Últimos 3 meses',
    '6m': 'Últimos 6 meses',
    '12m': 'Últimos 12 meses',
    'ytd': 'Ano atual',
    'all': 'Todo período'
  };
  
  return labels[period] || labels['30d'];
}