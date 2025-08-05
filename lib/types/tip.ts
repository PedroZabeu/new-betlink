/**
 * @feature: Tips & Metrics System
 * @guardrail: Core types for tips system - DO NOT MODIFY after feature complete
 * @created: Feature 2.18
 */

export type TipStatus = 'pending' | 'green' | 'half_green' | 'red' | 'half_red' | 'void' | 'cancelled';

export interface Tip {
  id: string;
  channel_id: number;
  created_at: string;
  updated_at: string;
  
  // Tipster input fields
  description: string;
  event_date: string;
  odds: number;
  stake: number; // 1-10 units
  
  // Result fields (updated after event)
  status: TipStatus;
  profit_loss: number;
  partial_percentage?: number; // For half bets (default 100)
}

export interface TipWithChannel extends Tip {
  channel: {
    id: number;
    name: string;
    tipster_id: string;
  };
}

export interface TipMetrics {
  total_tips: number;
  pending_tips: number;
  won_tips: number;
  lost_tips: number;
  void_tips: number;
  total_stake: number;
  total_profit: number;
  roi: number;
  win_rate: number;
  avg_odds: number;
}

export interface ChannelMetricsLive {
  channel_id: number;
  time_window: string;
  start_date: string;
  end_date: string;
  roi: number;
  win_rate: number;
  profit_units: number;
  total_stakes: number;
  avg_odds: number;
  total_tips: number;
  calculated_at: string;
}

export interface TimeWindowMetrics {
  time_window: '7d' | '30d' | '3m' | '6m' | '12m' | 'ytd' | 'all';
  metrics: TipMetrics;
  calculated_at: string;
}

export interface ChannelLiveMetrics {
  channel_id: number;
  time_windows: TimeWindowMetrics[];
  has_tips: boolean;
  last_tip_date?: string;
}

// Helper functions
export function calculateProfitLoss(odds: number, stake: number, status: TipStatus): number {
  switch (status) {
    case 'win':
      return (odds - 1) * stake; // Profit only (stake is returned separately)
    case 'loss':
      return -stake;
    case 'void':
    case 'pending':
    default:
      return 0;
  }
}

export function getStatusColor(status: TipStatus): string {
  switch (status) {
    case 'green':
    case 'half_green':
      return 'text-green-600';
    case 'red':
    case 'half_red':
      return 'text-red-600';
    case 'void':
    case 'cancelled':
      return 'text-gray-500';
    case 'pending':
    default:
      return 'text-blue-600';
  }
}

export function getStatusBadgeVariant(status: TipStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'green':
    case 'half_green':
      return 'default';
    case 'red':
    case 'half_red':
      return 'destructive';
    case 'void':
    case 'cancelled':
      return 'secondary';
    case 'pending':
    default:
      return 'outline';
  }
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function formatStake(stake: number): string {
  return `${stake}u`;
}

export function formatProfitLoss(profitLoss: number): string {
  const sign = profitLoss > 0 ? '+' : '';
  return `${sign}${profitLoss.toFixed(2)}u`;
}