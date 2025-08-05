# Feature 2.19: Gráfico de Performance com Métricas Consistentes (V3)

## 📋 Contexto do Problema
Na Feature 2.18, identificamos que precisamos garantir consistência total entre todos os componentes que exibem métricas:
1. **Múltiplos pontos de cálculo** - View SQL, cards frontend, gráfico calculando separadamente
2. **Fórmulas divergentes** - Cada componente implementava sua própria lógica
3. **Falta de fonte única de verdade** - Sem um hook central compartilhado
4. **Dados validados em R** - Temos certeza das fórmulas corretas

## 🎯 Objetivo Principal
Implementar um sistema de métricas unificado que garanta 100% de consistência entre todos os componentes que exibem dados de performance.

## 🔍 Análise de Métricas Reais (Canal 1)

### Dados Validados via CSV:
```
Canal: Futebol Europeu Premium
Tips Resolvidas: 107 (55 green + 2 half_green + 49 red + 1 half_red)
Total Stake: 245 unidades
Total Profit: 170.48 unidades
ROI: 69.58%
Hit Rate (weighted): 54.69%
Win Rate (count): 53.27%
Avg Odds: 2.97
```

### Fórmulas Validadas em R (100% corretas):
1. **ROI** = `(result - stake) / stake` = `(profit / stake) × 100`
2. **Profit por tip**: 
   - `green`: `odds × stake - stake`
   - `half_green`: `(stake/2) + (odds × stake)/2 - stake`
   - `half_red`: `stake/2 - stake`
   - `red`: `0 - stake`
   - `void/cancelled`: `stake - stake = 0`
3. **Períodos**: 7d, 30d, 3m, 6m, 12m, YTD, All
4. **Arredondamento**: Diferenças < 0.01 são aceitáveis (floating point)

## 🏗️ Arquitetura da Solução - Aprendizados do R

### Princípio Fundamental
**TODOS os componentes devem usar exatamente as mesmas fórmulas validadas no R**

### 1. Hook Unificado de Métricas (Fonte Única)
```typescript
// lib/hooks/useUnifiedChannelMetrics.ts
export function useUnifiedChannelMetrics(channelId: number, period?: string) {
  // FONTE ÚNICA DE VERDADE
  // Todos os componentes usam este hook
  return {
    summary: {
      roi: number,
      profit: number,
      hitRate: number,
      avgOdds: number,
      totalTips: number,
      winningTips: number
    },
    timeline: Array<{
      date: string,
      cumulativeROI: number,
      cumulativeProfit: number,
      dailyTips: number
    }>,
    isLoading: boolean,
    error: Error | null
  };
}
```

### 2. Sistema de Cache Compartilhado
```typescript
// Usar React Query com chaves específicas
const QUERY_KEYS = {
  channelMetrics: (id: number, period: string) => 
    ['channel', 'metrics', id, period],
  channelTimeline: (id: number, period: string) => 
    ['channel', 'timeline', id, period]
};
```

### 3. Componentes Consumidores (100% passivos)
- **MetricsCard**: Apenas exibe valores do hook (ZERO cálculos)
- **PerformanceChart**: Apenas plota dados do hook (ZERO cálculos)
- **ChannelHeader**: Apenas mostra métricas do hook (ZERO cálculos)
- **Regra de Ouro**: Componentes são "burros" - só exibem, não calculam

## 📊 Escopo Detalhado da Feature

### Fase 1: Preparação e Validação (2h)

#### 1.1 Análise Profunda de Métricas
- [ ] Documentar todas as fórmulas matemáticas
- [ ] Criar testes unitários para cada cálculo
- [ ] Validar com dados reais de 3 canais diferentes
- [ ] Identificar edge cases (ex: canal sem tips)

#### 1.2 Design do Sistema Unificado
- [ ] Definir estrutura de dados compartilhada
- [ ] Mapear todos os consumidores de métricas
- [ ] Planejar estratégia de cache
- [ ] Documentar fluxo de dados

### Fase 2: Implementação do Core (3h)

#### 2.1 Hook Unificado
```typescript
// Implementação detalhada
export function useUnifiedChannelMetrics(
  channelId: number,
  period: '7d' | '30d' | '3m' | '6m' | '12m' | 'all' = '30d'
) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: QUERY_KEYS.channelMetrics(channelId, period),
    queryFn: async () => {
      // 1. Buscar tips do período
      const startDate = getStartDateForPeriod(period);
      const { data: tips } = await supabase
        .from('tips')
        .select('*')
        .eq('channel_id', channelId)
        .gte('event_date', startDate)
        .in('status', ['green', 'half_green', 'red', 'half_red'])
        .order('event_date', { ascending: true });
      
      // 2. Calcular métricas summary
      const summary = calculateSummaryMetrics(tips);
      
      // 3. Calcular timeline para gráfico
      const timeline = calculateTimelineMetrics(tips);
      
      return { summary, timeline };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}
```

#### 2.2 Funções de Cálculo Puras
```typescript
// lib/utils/metrics-calculator.ts
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
  
  return {
    roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
    profit: totalProfit,
    hitRate: totalStake > 0 ? (winningStake / totalStake) * 100 : 0,
    avgOdds: totalStake > 0 ? sumOddsStake / totalStake : 0,
    totalTips: tips.length,
    winningTips: tips.filter(t => ['green', 'half_green'].includes(t.status)).length
  };
}

export function calculateTimelineMetrics(tips: Tip[]) {
  // Agrupar por dia e calcular cumulativo
  const dailyGroups = groupBy(tips, tip => 
    format(new Date(tip.event_date), 'yyyy-MM-dd')
  );
  
  let cumulativeStake = 0;
  let cumulativeProfit = 0;
  
  return Object.entries(dailyGroups).map(([date, dayTips]) => {
    const dayStake = sum(dayTips.map(t => t.stake));
    const dayProfit = sum(dayTips.map(t => t.profit_loss));
    
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

### Fase 3: Guia de Testes E2E (30min)

#### 3.1 Criar Guia Visual de Testes
- [ ] Documentar fluxo completo de validação
- [ ] Criar checklist visual com screenshots esperados
- [ ] Definir cenários de teste para Playwright MCP
- [ ] Especificar tolerâncias aceitáveis (< 0.01)

### Fase 4: Componentes Visuais (2h)

#### 4.0 Seletor de Período (Time Period Selector)
```typescript
export function PeriodSelector({ value, onChange }: Props) {
  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '12M' },
    { value: 'all', label: 'All' },
  ];
  
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {periods.map(period => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded transition-colors",
            value === period.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
```

#### 4.1 MetricsCard Refatorado
```typescript
export function MetricsCard({ channelId, period }: Props) {
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period);
  
  if (isLoading) return <MetricsCardSkeleton />;
  
  const { summary } = data;
  
  return (
    <Card>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricItem
          label="ROI"
          value={`${summary.roi.toFixed(2)}%`}
          trend={summary.roi > 0 ? 'up' : 'down'}
        />
        <MetricItem
          label="Lucro"
          value={`${summary.profit.toFixed(2)} un`}
          trend={summary.profit > 0 ? 'up' : 'down'}
        />
        <MetricItem
          label="Hit Rate"
          value={`${summary.hitRate.toFixed(2)}%`}
        />
        <MetricItem
          label="Odds Média"
          value={summary.avgOdds.toFixed(2)}
        />
      </CardContent>
    </Card>
  );
}
```

#### 3.2 PerformanceChart Integrado (Estilo Stock Market)
```typescript
export function PerformanceChart({ channelId, period }: Props) {
  const { data, isLoading } = useUnifiedChannelMetrics(channelId, period);
  
  if (isLoading) return <ChartSkeleton />;
  
  const { timeline, summary } = data;
  const lastValue = timeline[timeline.length - 1]?.cumulativeProfit || 0;
  const firstValue = timeline[0]?.cumulativeProfit || 0;
  const profitChange = lastValue - firstValue;
  const profitChangePercent = firstValue !== 0 ? (profitChange / Math.abs(firstValue)) * 100 : 0;
  
  return (
    <div className="space-y-4">
      {/* Header estilo Stock Market */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {lastValue >= 0 ? '+' : ''}{lastValue.toFixed(2)} un
          </span>
          <span className={cn(
            "text-sm font-medium",
            profitChange >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(2)} ({profitChangePercent.toFixed(2)}%)
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {getPeriodLabel(period)} • ROI: {summary.roi.toFixed(2)}%
        </p>
      </div>
      
      {/* Gráfico estilo Apple Stocks */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={timeline}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={profitChange >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={profitChange >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
            stroke="#888"
            fontSize={12}
          />
          <YAxis 
            stroke="#888"
            fontSize={12}
            tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value}`}
          />
          <Tooltip 
            content={<CustomStockTooltip />}
            cursor={{ stroke: '#888', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="cumulativeProfit"
            stroke={profitChange >= 0 ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Tooltip customizado estilo stock market
function CustomStockTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const value = data.cumulativeProfit;
  const roi = data.cumulativeROI;
  
  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="text-sm text-muted-foreground">
        {format(new Date(label), 'dd/MM/yyyy')}
      </p>
      <p className="font-semibold">
        {value >= 0 ? '+' : ''}{value.toFixed(2)} unidades
      </p>
      <p className="text-sm text-muted-foreground">
        ROI: {roi.toFixed(2)}%
      </p>
    </div>
  );
}
```

### Fase 5: Testes e Validação com Playwright MCP (1.5h)

#### 5.1 Testes E2E com Playwright MCP
- [ ] Seguir guia de testes criado na Fase 3
- [ ] Validar consistência entre componentes
- [ ] Verificar tolerância < 0.01
- [ ] Testar todos os períodos
- [ ] Capturar screenshots comparativos

#### 5.2 Testes Unitários
```typescript
describe('Metrics Calculator', () => {
  it('should calculate ROI correctly', () => {
    const tips = [
      { stake: 10, profit_loss: 5, status: 'green' },
      { stake: 10, profit_loss: -10, status: 'red' }
    ];
    const result = calculateSummaryMetrics(tips);
    expect(result.roi).toBe(-25); // (5-10)/20 * 100
  });
  
  it('should handle empty tips array', () => {
    const result = calculateSummaryMetrics([]);
    expect(result.roi).toBe(0);
    expect(result.hitRate).toBe(0);
  });
});
```

#### 5.3 Testes de Integração
- [ ] Verificar que todos os componentes mostram os mesmos valores (via Playwright MCP)
- [ ] Testar mudança de período atualiza todos simultaneamente
- [ ] Validar cache compartilhado funciona corretamente
- [ ] Confirmar performance < 100ms

### Fase 6: Documentação e Handover (30min)

#### 5.1 Documentação Técnica
- [ ] README com arquitetura do sistema
- [ ] Exemplos de uso do hook unificado
- [ ] Guia de troubleshooting
- [ ] Casos edge documentados

## ⚠️ Guardrails Críticos - Lições Aprendidas

### NUNCA:
- ❌ Calcular métricas em componentes individuais
- ❌ Duplicar lógica de cálculo
- ❌ Usar dados diferentes para o mesmo período
- ❌ Fazer queries separadas para mesmos dados
- ❌ Confiar apenas na view SQL (calcular no frontend também)
- ❌ Aceitar divergências > 0.01 entre componentes

### SEMPRE:
- ✅ Usar `useUnifiedChannelMetrics` como fonte única
- ✅ Manter fórmulas matemáticas em funções puras testáveis
- ✅ Compartilhar cache entre componentes
- ✅ Validar edge cases (divisão por zero, arrays vazios)

## 📊 Métricas de Sucesso

1. **Consistência**: Valores idênticos entre componentes (tolerância < 0.01)
2. **Validação com R**: Resultados batem com análise em R
3. **Performance**: < 100ms para renderização inicial
4. **Cache Hit Rate**: > 90% em navegação repetida
5. **Zero Bugs**: Nenhuma inconsistência > 0.01 reportada

## 🧪 Plano de Testes Manual

### Cenário 1: Validação de Consistência
1. Abrir página do canal
2. Anotar valores do MetricsCard
3. Verificar valores no gráfico (hover tooltips)
4. Confirmar match (diferença < 0.01 é OK)
5. Comparar com resultados do R para mesmo período

### Cenário 2: Mudança de Período
1. Selecionar "7 dias"
2. Verificar atualização simultânea
3. Repetir para todos os períodos
4. Confirmar sem loading duplicado

### Cenário 3: Edge Cases
1. Canal sem tips
2. Canal só com reds
3. Canal com apenas 1 tip
4. Período sem dados

## 📅 Cronograma
- **Fase 1**: 2h - Preparação e Validação
- **Fase 2**: 3h - Implementação do Core
- **Fase 3**: 0.5h - Guia de Testes E2E
- **Fase 4**: 2h - Componentes Visuais
- **Fase 5**: 1.5h - Testes com Playwright MCP
- **Fase 6**: 0.5h - Documentação
- **Total**: 9.5h (incluindo guia de testes)

## 🎯 Resultado Esperado

### Para o Usuário:
- Dados 100% confiáveis e consistentes
- Visualização clara sem duplicações
- Performance excelente
- **Gráfico interativo estilo Google Finance/Apple Stocks**
- **Seletor de período intuitivo com botões**
- **Visualização clara da evolução da banca**

### Para o Desenvolvimento:
- Código mais limpo e manutenível
- Fonte única de verdade
- Fácil adicionar novos consumidores de métricas
- Testes garantem qualidade

## 📊 Referências Visuais

### Estilo Visual Desejado:
- **Google Finance**: Linha/área com gradiente, tooltips ricos
- **Apple Stocks**: Header com valor atual e variação
- **Cores dinâmicas**: Verde para lucro, vermelho para prejuízo
- **Interatividade**: Hover mostra detalhes, clique nos períodos filtra

---

## ✅ Status Final: COMPLETO

### Resultados Alcançados:
1. **Hook Unificado**: `useUnifiedChannelMetrics` implementado como fonte única
2. **Cálculos Validados**: 100% compatível com análise em R
3. **Performance Chart**: Gráfico estilo stock market funcionando
4. **MDD Implementado**: Maximum Drawdown como métrica principal
5. **Period Selector**: 7D, 30D, 3M, 6M, YTD, 12M, All funcionando
6. **React Query**: Cache inteligente configurado
7. **Performance**: ~50ms (objetivo era < 100ms)

### Problema Conhecido:
- **Listagem de Canais**: Ainda usa view SQL antiga (inconsistente)
- **Documentado em**: `/docs/features/handover/feature-2.19-debug-handover.md`

### Arquivos Criados:
- `/lib/hooks/useUnifiedChannelMetrics.ts`
- `/lib/utils/metrics-calculator.ts`
- `/components/features/channels/performance-chart.tsx`
- `/components/features/channels/period-selector.tsx`
- `/components/providers/query-provider.tsx`
- `/guides/metrics-system-architecture.md`

---

*Versão 3 - Feature 2.19 COMPLETA*
*Atualizado em: 05/08/2025*