import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohnuaxnygsnkupmoimtq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obnVheG55Z3Nua3VwbW9pbXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjgwOTYsImV4cCI6MjA2ODk0NDA5Nn0.xVmTzpmia0mNibzH4xFL6TrkZvYw6-RmttfLjsd-cbE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportTipsToCSV() {
  console.log('Buscando dados de tips...');
  
  // Buscar todas as tips com informações do canal
  const { data: tips, error } = await supabase
    .from('tips')
    .select(`
      *,
      channel:channels(id, name, slug)
    `)
    .order('channel_id', { ascending: true })
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar tips:', error);
    return;
  }

  if (!tips || tips.length === 0) {
    console.log('Nenhuma tip encontrada');
    return;
  }

  console.log(`Encontradas ${tips.length} tips`);

  // Criar conteúdo CSV
  const headers = [
    'tip_id',
    'channel_id',
    'channel_name',
    'channel_slug',
    'created_at',
    'event_date',
    'description',
    'odds',
    'stake',
    'status',
    'profit_loss',
    'partial_percentage'
  ];

  const csvRows = [headers.join(',')];

  tips.forEach(tip => {
    const row = [
      tip.id,
      tip.channel_id,
      tip.channel?.name || '',
      tip.channel?.slug || '',
      tip.created_at,
      tip.event_date,
      `"${tip.description.replace(/"/g, '""')}"`, // Escape quotes
      tip.odds,
      tip.stake,
      tip.status,
      tip.profit_loss || 0,
      tip.partial_percentage || 100
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const filename = `tips_export_${new Date().toISOString().split('T')[0]}.csv`;
  const filepath = join(process.cwd(), 'data', 'exports', filename);

  writeFileSync(filepath, csvContent);
  console.log(`CSV exportado para: ${filepath}`);

  // Também exportar métricas agregadas por canal
  const channelMetrics: Record<number, any> = {};

  tips.forEach(tip => {
    if (!channelMetrics[tip.channel_id]) {
      channelMetrics[tip.channel_id] = {
        channel_id: tip.channel_id,
        channel_name: tip.channel?.name || '',
        total_tips: 0,
        pending_tips: 0,
        green_tips: 0,
        half_green_tips: 0,
        red_tips: 0,
        half_red_tips: 0,
        void_tips: 0,
        cancelled_tips: 0,
        total_stake: 0,
        total_profit: 0,
        winning_stake: 0,
        sum_odds_stake: 0
      };
    }

    const metrics = channelMetrics[tip.channel_id];
    metrics.total_tips++;
    
    // Contagem por status
    switch (tip.status) {
      case 'pending': metrics.pending_tips++; break;
      case 'green': metrics.green_tips++; break;
      case 'half_green': metrics.half_green_tips++; break;
      case 'red': metrics.red_tips++; break;
      case 'half_red': metrics.half_red_tips++; break;
      case 'void': metrics.void_tips++; break;
      case 'cancelled': metrics.cancelled_tips++; break;
    }

    // Apenas tips resolvidas
    if (['green', 'half_green', 'red', 'half_red'].includes(tip.status)) {
      metrics.total_stake += Number(tip.stake);
      metrics.total_profit += Number(tip.profit_loss || 0);
      metrics.sum_odds_stake += Number(tip.odds) * Number(tip.stake);
      
      if (['green', 'half_green'].includes(tip.status)) {
        metrics.winning_stake += Number(tip.stake);
      }
    }
  });

  // Calcular métricas derivadas
  const metricsHeaders = [
    'channel_id',
    'channel_name',
    'total_tips',
    'pending_tips',
    'resolved_tips',
    'green_tips',
    'half_green_tips', 
    'red_tips',
    'half_red_tips',
    'void_tips',
    'cancelled_tips',
    'total_stake',
    'total_profit',
    'roi_percentage',
    'avg_odds_weighted',
    'hit_rate_weighted',
    'win_rate_by_count'
  ];

  const metricsRows = [metricsHeaders.join(',')];

  Object.values(channelMetrics).forEach(metrics => {
    const resolved_tips = metrics.total_tips - metrics.pending_tips - metrics.void_tips - metrics.cancelled_tips;
    const roi = metrics.total_stake > 0 ? (metrics.total_profit / metrics.total_stake * 100).toFixed(2) : '0.00';
    const avg_odds = metrics.total_stake > 0 ? (metrics.sum_odds_stake / metrics.total_stake).toFixed(2) : '0.00';
    const hit_rate_weighted = metrics.total_stake > 0 ? (metrics.winning_stake / metrics.total_stake * 100).toFixed(2) : '0.00';
    const win_rate_count = resolved_tips > 0 ? ((metrics.green_tips + metrics.half_green_tips) / resolved_tips * 100).toFixed(2) : '0.00';

    const row = [
      metrics.channel_id,
      metrics.channel_name,
      metrics.total_tips,
      metrics.pending_tips,
      resolved_tips,
      metrics.green_tips,
      metrics.half_green_tips,
      metrics.red_tips,
      metrics.half_red_tips,
      metrics.void_tips,
      metrics.cancelled_tips,
      metrics.total_stake.toFixed(2),
      metrics.total_profit.toFixed(2),
      roi,
      avg_odds,
      hit_rate_weighted,
      win_rate_count
    ];
    metricsRows.push(row.join(','));
  });

  const metricsContent = metricsRows.join('\n');
  const metricsFilename = `channel_metrics_${new Date().toISOString().split('T')[0]}.csv`;
  const metricsFilepath = join(process.cwd(), 'data', 'exports', metricsFilename);

  writeFileSync(metricsFilepath, metricsContent);
  console.log(`Métricas exportadas para: ${metricsFilepath}`);
}

// Executar
exportTipsToCSV().catch(console.error);