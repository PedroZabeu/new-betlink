# 📊 Guia Completo: Sistema de Métricas Unificado

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura no Supabase](#arquitetura-no-supabase)
3. [Sistema de Cálculo Frontend](#sistema-de-cálculo-frontend)
4. [Fluxo de Dados](#fluxo-de-dados)
5. [Componentes e Integração](#componentes-e-integração)
6. [Problemas Conhecidos](#problemas-conhecidos)
7. [Como Adicionar Novas Métricas](#como-adicionar-novas-métricas)

## 🎯 Visão Geral

O sistema de métricas do BetLink é baseado em um princípio fundamental: **fonte única de verdade**. Todos os cálculos de métricas (ROI, lucro, MDD, etc.) são feitos no frontend usando o hook `useUnifiedChannelMetrics`.

### Princípios Fundamentais
1. **Cálculos no Frontend**: Todas as métricas são calculadas em tempo real
2. **Dados Brutos do Supabase**: O banco apenas armazena tips individuais
3. **Cache Inteligente**: React Query gerencia cache e sincronização
4. **Fórmulas Validadas**: Todos os cálculos foram validados com análise em R

## 🗄️ Arquitetura no Supabase

### Tabela Principal: `tips`
```sql
CREATE TABLE tips (
  id UUID PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Dados da Aposta
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  odds DECIMAL(5,2) NOT NULL,
  stake DECIMAL(10,2) NOT NULL,
  
  -- Resultado (nomenclatura Green/Red)
  status tip_status NOT NULL,
  profit_loss DECIMAL(10,2),
  partial_percentage DECIMAL(5,2) DEFAULT 100
);

-- Enum de status
CREATE TYPE tip_status AS ENUM (
  'pending',
  'green',        -- Vitória completa
  'half_green',   -- Vitória parcial
  'red',          -- Derrota completa
  'half_red',     -- Derrota parcial
  'void',         -- Anulada
  'cancelled'     -- Cancelada
);
```

### Trigger Automático: `calculate_profit_loss`
```sql
-- Calcula profit_loss automaticamente baseado no status
CREATE TRIGGER calculate_profit_loss_trigger
  BEFORE INSERT OR UPDATE OF status, odds, stake, partial_percentage
  ON tips
  FOR EACH ROW
  EXECUTE FUNCTION calculate_tip_profit_loss();
```

**Fórmulas do Trigger:**
- `green`: profit = stake × (odds - 1)
- `half_green`: profit = (stake × partial_percentage/100) × (odds - 1)
- `red`: profit = -stake
- `half_red`: profit = -(stake × partial_percentage/100)
- `void/cancelled`: profit = 0

### Views Deprecadas ⚠️
```sql
-- ATENÇÃO: Estas views NÃO são mais a fonte de verdade
-- channel_metrics - Desatualizada, não usar
-- channel_metrics_live - Pode ter divergências
```

## 🧮 Sistema de Cálculo Frontend

### 1. Hook Principal: `useUnifiedChannelMetrics`
```typescript
// lib/hooks/useUnifiedChannelMetrics.ts

export function useUnifiedChannelMetrics(
  channelId: number,
  period: '7d' | '30d' | '3m' | '6m' | '12m' | 'ytd' | 'all' = '30d'
) {
  // 1. Busca tips do Supabase
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .eq('channel_id', channelId)
    .gte('event_date', startDate)
    .in('status', ['green', 'half_green', 'red', 'half_red'])
    .order('event_date', { ascending: true });
  
  // 2. Calcula métricas agregadas
  const summary = calculateSummaryMetrics(tips);
  
  // 3. Calcula dados para gráfico
  const timeline = calculateTimelineMetrics(tips);
  
  return { summary, timeline, tips };
}
```

### 2. Funções de Cálculo: `metrics-calculator.ts`

#### calculateSummaryMetrics
```typescript
export function calculateSummaryMetrics(tips: Tip[]) {
  let totalStake = 0;
  let totalProfit = 0;
  let winningStake = 0;
  let sumOddsStake = 0;
  
  // Calcula agregados
  tips.forEach(tip => {
    totalStake += tip.stake;
    totalProfit += tip.profit_loss;
    sumOddsStake += tip.odds * tip.stake;
    
    if (['green', 'half_green'].includes(tip.status)) {
      winningStake += tip.stake;
    }
  });
  
  // Calcula MDD (Maximum Drawdown)
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
```

#### calculateTimelineMetrics
```typescript
export function calculateTimelineMetrics(tips: Tip[]) {
  // Agrupa tips por dia
  const dailyGroups = groupByDay(tips);
  
  let cumulativeStake = 0;
  let cumulativeProfit = 0;
  
  // Calcula evolução acumulada
  return dailyGroups.map(([date, dayTips]) => {
    const dayStake = sum(dayTips, 'stake');
    const dayProfit = sum(dayTips, 'profit_loss');
    
    cumulativeStake += dayStake;
    cumulativeProfit += dayProfit;
    
    return {
      date,
      cumulativeROI: cumulativeStake > 0 ? (cumulativeProfit / cumulativeStake) * 100 : 0,
      cumulativeProfit,
      dailyTips: dayTips.length,
      dailyProfit,
      dailyROI: dayStake > 0 ? (dayProfit / dayStake) * 100 : 0
    };
  });
}
```

## 🔄 Fluxo de Dados

### 1. Página de Detalhes do Canal ✅
```
[Página] app/canais/[slug]/page.tsx
    ↓
[Wrapper] ChannelMetricsSection
    ↓
[Hook] useUnifiedChannelMetrics(channelId, period)
    ↓
[Supabase] SELECT * FROM tips WHERE channel_id = ?
    ↓
[Cálculo] calculateSummaryMetrics + calculateTimelineMetrics
    ↓
[Cache] React Query (5min stale, 10min cache)
    ↓
[Componentes]
    ├── MetricsCard (exibe summary)
    └── PerformanceChart (exibe timeline)
```

### 2. Listagem de Canais ❌ (Problema Atual)
```
[Página] app/canais/page.tsx
    ↓
[Query] getChannels() 
    ↓
[Supabase] SELECT com JOIN em channel_metrics (DESATUALIZADA!)
    ↓
[Card] ChannelCard mostra dados incorretos
```

## 🧩 Componentes e Integração

### MetricsCard
```typescript
// components/channels/detail/metrics-card.tsx

export default function MetricsCard({ channelId, period = '30d' }) {
  // Usa o hook unificado
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period);
  
  if (!data) return <EmptyState />;
  
  const { summary } = data;
  
  // Apenas exibe os dados (não calcula nada!)
  return (
    <Card>
      <MetricItem label="ROI" value={`${summary.roi.toFixed(2)}%`} />
      <MetricItem label="Lucro" value={`${summary.profit.toFixed(2)}u`} />
      <MetricItem label="Max Drawdown" value={`-${summary.maxDrawdown.toFixed(2)}u`} />
      {/* ... */}
    </Card>
  );
}
```

### PerformanceChart
```typescript
// components/features/channels/performance-chart.tsx

export function PerformanceChart({ channelId, period }) {
  // Mesmo hook, mesmos dados
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period);
  
  if (!data) return <EmptyState />;
  
  const { timeline, summary } = data;
  
  // Renderiza gráfico estilo stock market
  return (
    <AreaChart data={timeline}>
      {/* Configuração do Recharts */}
    </AreaChart>
  );
}
```

### PeriodSelector
```typescript
// components/features/channels/period-selector.tsx

export function PeriodSelector({ value, onChange }) {
  const periods = ['7d', '30d', '3m', '6m', 'ytd', '12m', 'all'];
  
  return (
    <div className="flex gap-1">
      {periods.map(period => (
        <button onClick={() => onChange(period)}>
          {getPeriodLabel(period)}
        </button>
      ))}
    </div>
  );
}
```

## ⚠️ Problemas Conhecidos

### 1. Inconsistência na Listagem
**Problema**: Cards na listagem mostram valores diferentes da página de detalhes

**Causa**: Listagem usa view SQL desatualizada (`channel_metrics`)

**Solução Proposta**:
```typescript
// Em channel-card.tsx - FAZER ISSO!
const { data } = useUnifiedChannelMetrics(channel.id, '30d');
// Usar data.summary ao invés de channel.metrics
```

### 2. Performance na Listagem
**Problema**: Fazer uma query por canal pode ser lento

**Soluções**:
1. Criar endpoint batch: `/api/channels/metrics?ids=1,2,3`
2. Usar React Query com `staleTime` maior
3. Implementar virtualização na lista

## 🚀 Como Adicionar Novas Métricas

### 1. Adicionar Cálculo no `calculateSummaryMetrics`
```typescript
// lib/utils/metrics-calculator.ts

export function calculateSummaryMetrics(tips: Tip[]) {
  // ... cálculos existentes ...
  
  // Nova métrica exemplo: Streak atual
  let currentStreak = 0;
  let tempStreak = 0;
  
  tips.reverse().forEach(tip => {
    if (['green', 'half_green'].includes(tip.status)) {
      tempStreak++;
      currentStreak = tempStreak;
    } else if (['red', 'half_red'].includes(tip.status)) {
      tempStreak = 0;
    }
  });
  
  return {
    // ... métricas existentes ...
    currentStreak // Nova métrica
  };
}
```

### 2. Exibir no MetricsCard
```typescript
// Em metrics-card.tsx
const metricItems = [
  // ... items existentes ...
  {
    label: 'Streak Atual',
    value: summary.currentStreak.toString(),
    icon: Fire,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];
```

## 📈 Métricas Disponíveis

### Summary (Agregadas)
- **ROI**: (Lucro / Stake Total) × 100
- **Profit**: Soma de todos profit_loss
- **Hit Rate**: (Stake vencedor / Stake total) × 100
- **Avg Odds**: Média ponderada por stake
- **Max Drawdown**: Maior queda desde um pico
- **Total Tips**: Contagem de apostas
- **Total Stake**: Soma de todas as unidades

### Timeline (Por dia)
- **Cumulative ROI**: ROI acumulado até o dia
- **Cumulative Profit**: Lucro acumulado
- **Daily Tips**: Apostas do dia
- **Daily Profit**: Lucro do dia
- **Daily ROI**: ROI apenas do dia

## 🔧 Configuração do React Query

```typescript
// components/providers/query-provider.tsx

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minuto
      refetchOnWindowFocus: false,  // Não recarregar ao focar
    },
  },
});
```

### Cache Keys
```typescript
// Hook usa chaves específicas para cache
const QUERY_KEY = ['channel', 'metrics', channelId, period];
```

## 🎯 Checklist de Validação

Ao modificar o sistema de métricas, sempre verifique:

- [ ] Fórmulas matemáticas corretas (validar com R)
- [ ] Tolerância < 0.01 entre componentes
- [ ] Cache funcionando corretamente
- [ ] Performance < 100ms
- [ ] Edge cases tratados (divisão por zero, arrays vazios)
- [ ] Tipos TypeScript atualizados
- [ ] Nomenclatura Green/Red consistente

---

**Última atualização**: 05/08/2025 - Feature 2.19