// Tipos para o novo sistema de status de tips

export type TipStatus = 
  | 'pending'     // Aguardando resultado
  | 'green'       // Vitória completa (antigo: won)
  | 'half_green'  // Vitória parcial (ex: Asian Handicap)
  | 'void'        // Anulada pelo bookmaker
  | 'cancelled'   // Cancelada pelo tipster
  | 'red'         // Derrota completa (antigo: lost)
  | 'half_red';   // Derrota parcial

export interface TipProfitCalculation {
  status: TipStatus;
  stake: number;
  odds: number;
  partialPercentage?: number; // Para half green/red (default: 100)
  profitLoss: number;
}

// Função helper para calcular profit/loss
export function calculateTipProfit(tip: Omit<TipProfitCalculation, 'profitLoss'>): number {
  const { status, stake, odds, partialPercentage = 100 } = tip;
  
  switch (status) {
    case 'green':
      // Vitória completa: stake * (odds - 1)
      return stake * (odds - 1);
      
    case 'half_green':
      // Vitória parcial: parte do stake ganha
      return (stake * (partialPercentage / 100)) * (odds - 1);
      
    case 'red':
      // Derrota completa: perde todo stake
      return -stake;
      
    case 'half_red':
      // Derrota parcial: perde parte do stake
      return -(stake * (partialPercentage / 100));
      
    case 'void':
    case 'cancelled':
      // Anulada: stake devolvido
      return 0;
      
    case 'pending':
      // Pendente: sem cálculo ainda
      return 0;
      
    default:
      console.warn(`Status desconhecido: ${status}`);
      return 0;
  }
}

// Mapear status antigo para novo (para migração)
export function mapLegacyStatus(oldStatus: string): TipStatus {
  const mapping: Record<string, TipStatus> = {
    'won': 'green',
    'lost': 'red',
    'void': 'void',
    'partial': 'half_green',
    'pending': 'pending'
  };
  
  return mapping[oldStatus] || 'pending';
}

// Cores para UI
export const statusColors: Record<TipStatus, { bg: string; text: string }> = {
  'pending': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'green': { bg: 'bg-green-100', text: 'text-green-700' },
  'half_green': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'void': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'cancelled': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'red': { bg: 'bg-red-100', text: 'text-red-700' },
  'half_red': { bg: 'bg-rose-100', text: 'text-rose-700' }
};

// Labels para UI
export const statusLabels: Record<TipStatus, string> = {
  'pending': 'Pendente',
  'green': 'Green',
  'half_green': 'Half Green',
  'void': 'Anulada',
  'cancelled': 'Cancelada',
  'red': 'Red',
  'half_red': 'Half Red'
};

// Exemplos de cálculo para documentação
export const profitExamples = {
  green: {
    description: 'Aposta vencedora completa',
    example: 'Stake: 10u, Odds: 2.00 → Lucro: +10u'
  },
  half_green: {
    description: 'Asian Handicap -0.25, vitória por 1 gol',
    example: 'Stake: 10u, Odds: 2.00 → 50% green: +5u'
  },
  red: {
    description: 'Aposta perdida',
    example: 'Stake: 10u → Prejuízo: -10u'
  },
  half_red: {
    description: 'Asian Handicap +0.25, derrota por 1 gol',
    example: 'Stake: 10u → 50% red: -5u'
  },
  void: {
    description: 'Jogo cancelado ou jogador não participou',
    example: 'Stake: 10u → Devolvido: 0u'
  }
};