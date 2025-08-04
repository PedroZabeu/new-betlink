# Feature 2.19: Gráfico de Performance Real dos Canais

## 📋 Contexto
Com a Feature 2.18 implementada (tabela tips e métricas dinâmicas), agora precisamos visualizar esses dados de forma gráfica. Os usuários querem ver a evolução do desempenho dos canais ao longo do tempo, identificar tendências e tomar decisões baseadas em dados visuais.

## 🎯 Objetivo
1. Criar gráfico de linha temporal interativo
2. Mostrar evolução de ROI e Profit ao longo do tempo
3. Permitir análise de diferentes períodos
4. Manter performance < 100ms de renderização
5. Funcionar perfeitamente em mobile e desktop

## 🛠️ Stack Técnica
- **Gráficos**: Recharts (já instalado no projeto)
- **Dados**: Queries agregadas da tabela tips (quando disponível)
- **Cache**: React Query com 5 minutos de stale time
- **Responsividade**: Container queries + Tailwind
- **Export**: html2canvas para salvar como imagem

## 🚀 Estratégia de Execução Paralela

### PARTE A: Implementar AGORA (Não depende da Feature 2.18)
**Tempo estimado: 5 horas**

Estas tarefas podem ser implementadas imediatamente usando dados mockados:

1. **Componente de Gráfico Base** (2h)
2. **Controles Interativos** (1.5h)
3. **Integração Visual na UI** (1h)
4. **Setup de Cache e Estados** (30min)

### PARTE B: Implementar APÓS Feature 2.18
**Tempo estimado: 2.5 horas**

Estas tarefas dependem da tabela tips e dados reais:

1. **Queries SQL de Agregação** (1.5h)
2. **Integração com Dados Reais** (30min)
3. **Testes E2E Completos** (30min)

## 📊 Escopo Detalhado

### PARTE A: Desenvolvimento Independente (5h)

#### Fase A1: Componente Base do Gráfico (2h)

##### Tarefa A1.1: Criar PerformanceChart.tsx (45min)
- [ ] Criar `components/features/channels/PerformanceChart.tsx`
- [ ] Setup Recharts com LineChart responsivo
- [ ] Configurar eixos X (tempo) e Y duplo (ROI % e Profit units)
- [ ] Adicionar grid e labels formatados
- [ ] Implementar com dados mockados

```tsx
// components/features/channels/PerformanceChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { logger } from '@/lib/utils/logger';

interface PerformanceChartProps {
  channelId: number;
  period?: '7d' | '30d' | '3m' | '6m' | 'all';
  metric?: 'roi' | 'profit' | 'both';
  height?: number;
}

export function PerformanceChart({ 
  channelId, 
  period = '30d', 
  metric = 'both',
  height = 300 
}: PerformanceChartProps) {
  // TODO: Substituir por useChannelPerformance após Feature 2.18
  const { data, isLoading } = useMockPerformanceData(channelId, period);
  
  logger.info('PerformanceChart rendered', { channelId, period, metric });
  
  if (isLoading) return <ChartSkeleton height={height} />;
  if (!data?.length) return <EmptyChart message="Sem dados para exibir" />;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => format(new Date(value), 'dd/MM')}
        />
        {/* Configuração dos eixos e linhas */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

##### Tarefa A1.2: Dados Mockados Realistas (30min)
- [ ] Criar `lib/mocks/performance-data.ts`
- [ ] Gerar 180 dias de dados fictícios
- [ ] Padrões realistas (winning/losing streaks)
- [ ] Hook temporário `useMockPerformanceData`

```tsx
// lib/mocks/performance-data.ts
export const generateMockData = (days: number) => {
  const data = [];
  let cumulativeProfit = 0;
  let totalStake = 0;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simular apostas do dia (0-5 apostas)
    const dailyTips = Math.floor(Math.random() * 6);
    const dailyStake = dailyTips * 10;
    const dailyProfit = (Math.random() - 0.45) * dailyStake; // 45% loss rate
    
    cumulativeProfit += dailyProfit;
    totalStake += dailyStake;
    
    data.push({
      date: date.toISOString().split('T')[0],
      roi_cumulative: totalStake > 0 ? (cumulativeProfit / totalStake * 100).toFixed(2) : 0,
      profit_cumulative: cumulativeProfit.toFixed(2),
      tips_count: dailyTips,
      wins: Math.floor(dailyTips * 0.55),
      losses: Math.ceil(dailyTips * 0.45)
    });
  }
  
  return data;
};
```

##### Tarefa A1.3: Tooltip Customizado (30min)
- [ ] Criar componente CustomTooltip
- [ ] Mostrar data, ROI, Profit, Tips do dia
- [ ] Styling com Card do shadcn
- [ ] Cores indicativas (verde/vermelho)

##### Tarefa A1.4: Estados e Animações (15min)
- [ ] ChartSkeleton com shimmer effect
- [ ] EmptyChart com ilustração SVG
- [ ] ErrorBoundary com fallback
- [ ] Animação de entrada (fade in)

#### Fase A2: Controles Interativos (1.5h)

##### Tarefa A2.1: Seletor de Período (30min)
- [ ] Criar `PeriodSelector.tsx`
- [ ] Tabs com opções: 7d, 30d, 3m, 6m, All
- [ ] Persistir escolha no localStorage
- [ ] Atualização instantânea do gráfico

```tsx
// components/features/channels/PeriodSelector.tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const periods = [
  { value: '7d', label: '7 dias', days: 7 },
  { value: '30d', label: '30 dias', days: 30 },
  { value: '3m', label: '3 meses', days: 90 },
  { value: '6m', label: '6 meses', days: 180 },
  { value: 'all', label: 'Tudo', days: 365 }
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="grid w-full grid-cols-5">
        {periods.map(period => (
          <TabsTrigger key={period.value} value={period.value}>
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

##### Tarefa A2.2: Toggle de Métricas (30min)
- [ ] RadioGroup para ROI / Profit / Ambos
- [ ] Ícones descritivos (TrendingUp, DollarSign)
- [ ] Animação smooth ao trocar
- [ ] Mobile-friendly

##### Tarefa A2.3: Controles de Ação (30min)
- [ ] Botão Export PNG (com html2canvas)
- [ ] Botão Fullscreen (mobile)
- [ ] Botão Reset Zoom
- [ ] Info tooltip sobre métricas

```tsx
// components/features/channels/ChartControls.tsx
import { Button } from '@/components/ui/button';
import { Download, Maximize2, RotateCcw, Info } from 'lucide-react';
import html2canvas from 'html2canvas';

export function ChartControls({ chartRef, onReset }: ChartControlsProps) {
  const handleExport = async () => {
    if (!chartRef.current) return;
    
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `performance-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    logger.info('Chart exported', { timestamp: Date.now() });
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleExport}>
        <Download className="h-4 w-4" />
      </Button>
      {/* Outros botões */}
    </div>
  );
}
```

#### Fase A3: Integração na UI (1h)

##### Tarefa A3.1: Tab na Página de Detalhes (30min)
- [ ] Adicionar tab "Performance" em `app/canais/[id]/page.tsx`
- [ ] Lazy loading com Suspense
- [ ] Badge "NEW" temporário
- [ ] Posicionar após "Informações"

```tsx
// app/canais/[id]/page.tsx - Adicionar tab
<Tabs defaultValue="info" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="info">Informações</TabsTrigger>
    <TabsTrigger value="performance" className="relative">
      Performance
      <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 animate-pulse bg-green-500" />
    </TabsTrigger>
    <TabsTrigger value="reviews">Avaliações</TabsTrigger>
  </TabsList>
  
  <TabsContent value="performance" className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Performance do Canal</CardTitle>
        <CardDescription>
          Acompanhe a evolução das métricas ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartSkeleton />}>
          <PerformanceChart channelId={channel.id} />
        </Suspense>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

##### Tarefa A3.2: Preview na Listagem (20min)
- [ ] Card colapsável em ChannelCard
- [ ] Gráfico mini (150px height)
- [ ] Botão "Ver Performance"
- [ ] Animação de expand/collapse

##### Tarefa A3.3: Mobile Optimizations (10min)
- [ ] Touch gestures para zoom
- [ ] Swipe entre períodos
- [ ] Bottom sheet para controles
- [ ] Landscape mode support

#### Fase A4: Setup de Cache e Performance (30min)

##### Tarefa A4.1: React Query Setup (15min)
- [ ] Criar hook `useChannelPerformance`
- [ ] StaleTime: 5 minutos
- [ ] Cache no sessionStorage
- [ ] Prefetch em hover

```tsx
// lib/hooks/useChannelPerformance.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useChannelPerformance(channelId: number, period: string) {
  return useQuery({
    queryKey: ['channel-performance', channelId, period],
    queryFn: async () => {
      // TODO: Substituir por query real após Feature 2.18
      logger.info('Fetching performance data', { channelId, period });
      return generateMockData(getPeriodDays(period));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function usePrefetchPerformance() {
  const queryClient = useQueryClient();
  
  return (channelId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['channel-performance', channelId, '30d'],
      queryFn: () => generateMockData(30),
    });
  };
}
```

##### Tarefa A4.2: Otimizações (15min)
- [ ] Memoização do componente
- [ ] Throttle de re-renders
- [ ] Data decimation para > 365 pontos
- [ ] Virtual scrolling se necessário

### PARTE B: Desenvolvimento Dependente (2.5h)

#### Fase B1: Queries SQL de Agregação (1.5h)

##### Tarefa B1.1: Function Timeline (45min)
- [ ] Criar function `get_channel_performance_timeline`
- [ ] Parâmetros: channel_id, period, aggregation
- [ ] Cálculo cumulativo de ROI e Profit
- [ ] **Executar via Supabase MCP**

```sql
CREATE OR REPLACE FUNCTION get_channel_performance_timeline(
  p_channel_id INTEGER,
  p_period TEXT DEFAULT '30d',
  p_aggregation TEXT DEFAULT 'daily'
) RETURNS TABLE (
  date DATE,
  roi_cumulative NUMERIC,
  profit_cumulative NUMERIC,
  tips_count INTEGER,
  wins INTEGER,
  losses INTEGER
) AS $$
DECLARE
  v_start_date TIMESTAMPTZ;
  v_interval TEXT;
BEGIN
  -- Calcular data inicial baseada no período
  v_start_date := CASE p_period
    WHEN '7d' THEN NOW() - INTERVAL '7 days'
    WHEN '30d' THEN NOW() - INTERVAL '30 days'
    WHEN '3m' THEN NOW() - INTERVAL '3 months'
    WHEN '6m' THEN NOW() - INTERVAL '6 months'
    ELSE '2020-01-01'::TIMESTAMPTZ
  END;
  
  -- Determinar intervalo de agregação
  v_interval := CASE p_aggregation
    WHEN 'daily' THEN '1 day'
    WHEN 'weekly' THEN '1 week'
    ELSE '1 day'
  END;
  
  RETURN QUERY
  WITH daily_stats AS (
    SELECT 
      DATE_TRUNC(p_aggregation, event_date)::DATE as day,
      SUM(stake) as daily_stake,
      SUM(profit_loss) as daily_profit,
      COUNT(*) as daily_tips,
      COUNT(*) FILTER (WHERE status = 'win') as daily_wins,
      COUNT(*) FILTER (WHERE status = 'loss') as daily_losses
    FROM tips
    WHERE channel_id = p_channel_id
      AND event_date >= v_start_date
      AND status IN ('win', 'loss')
    GROUP BY DATE_TRUNC(p_aggregation, event_date)
  ),
  cumulative AS (
    SELECT 
      day,
      SUM(daily_profit) OVER (ORDER BY day) as profit_cumulative,
      SUM(daily_stake) OVER (ORDER BY day) as stake_cumulative,
      SUM(daily_tips) OVER (ORDER BY day) as tips_cumulative,
      daily_wins,
      daily_losses
    FROM daily_stats
  )
  SELECT 
    day as date,
    ROUND((profit_cumulative / NULLIF(stake_cumulative, 0)) * 100, 2) as roi_cumulative,
    ROUND(profit_cumulative, 2) as profit_cumulative,
    tips_cumulative::INTEGER as tips_count,
    daily_wins::INTEGER as wins,
    daily_losses::INTEGER as losses
  FROM cumulative
  ORDER BY day;
END;
$$ LANGUAGE plpgsql;
```

##### Tarefa B1.2: Function de Estatísticas (30min)
- [ ] Criar function `get_channel_statistics`
- [ ] Calcular best_day, worst_day, max_drawdown
- [ ] Sharpe ratio e volatilidade
- [ ] **Executar via Supabase MCP**

##### Tarefa B1.3: Índices de Otimização (15min)
- [ ] Criar índice `(channel_id, event_date, status)`
- [ ] Analisar EXPLAIN ANALYZE
- [ ] Ajustar se > 100ms
- [ ] **Executar via Supabase MCP**

#### Fase B2: Integração com Dados Reais (30min)

##### Tarefa B2.1: Substituir Mocks (15min)
- [ ] Atualizar `useChannelPerformance` para usar Supabase
- [ ] Remover imports de mocks
- [ ] Ajustar tipos se necessário
- [ ] Testar com dados reais

```tsx
// lib/hooks/useChannelPerformance.ts - Versão final
export function useChannelPerformance(channelId: number, period: string) {
  return useQuery({
    queryKey: ['channel-performance', channelId, period],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_channel_performance_timeline', {
          p_channel_id: channelId,
          p_period: period,
          p_aggregation: period === 'all' ? 'weekly' : 'daily'
        });
      
      if (error) {
        logger.error('Failed to fetch performance', error, { channelId, period });
        throw error;
      }
      
      logger.info('Performance data fetched', { channelId, period, count: data?.length });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

##### Tarefa B2.2: Validação de Dados (15min)
- [ ] Verificar cálculos de ROI
- [ ] Confirmar profit cumulativo
- [ ] Validar contagem de tips
- [ ] Comparar com channel_metrics

#### Fase B3: Testes E2E (30min)

##### Tarefa B3.1: Testes com Playwright MCP (20min)
- [ ] Navegar para canal com tips
- [ ] Clicar na tab Performance
- [ ] Verificar gráfico renderizado
- [ ] Testar troca de período
- [ ] Testar export
- [ ] Capturar screenshots

```javascript
// Teste E2E com Playwright MCP
await browser_navigate({ url: 'http://localhost:3000/canais/1' });
await browser_click({ element: 'Tab Performance', ref: 'tab-performance' });
await browser_wait_for({ text: 'Performance do Canal' });
await browser_snapshot(); // Verificar gráfico inicial

// Testar períodos
await browser_click({ element: '7 dias', ref: 'period-7d' });
await browser_wait_for({ time: 1 });
await browser_snapshot(); // Verificar mudança

// Testar export
await browser_click({ element: 'Download', ref: 'btn-export' });
// Verificar se download iniciou

// Mobile
await browser_resize({ width: 375, height: 667 });
await browser_snapshot(); // Verificar responsividade
```

##### Tarefa B3.2: Validação Visual (10min)
- [ ] Screenshots desktop/tablet/mobile
- [ ] Verificar responsividade
- [ ] Confirmar acessibilidade
- [ ] Documentar com imagens

## ⚠️ Guardrails

### NUNCA Modificar
- ❌ Tabela tips (estrutura da Feature 2.18)
- ❌ Functions de cálculo base da 2.18
- ❌ Layout principal das páginas
- ❌ Sistema de autenticação
- ❌ Componentes UI existentes (exceto para adicionar features)

### SEMPRE Manter
- ✅ Performance < 100ms para renderização
- ✅ Responsividade mobile-first
- ✅ Acessibilidade WCAG AA
- ✅ Cores e tema do design system
- ✅ Logs estruturados com contexto
- ✅ Error boundaries em componentes críticos

### SEMPRE Usar
- ✅ **Recharts** para gráficos (não adicionar Chart.js ou D3)
- ✅ **React Query** para cache de dados
- ✅ **Supabase MCP** para todas as queries SQL
- ✅ **Playwright MCP** para testes E2E
- ✅ **Logger centralizado** (nunca console.log direto)

### Padrões de Código
- ✅ TypeScript strict mode
- ✅ Componentes com loading/error states
- ✅ Hooks customizados para lógica reutilizável
- ✅ Memoização onde apropriado
- ✅ Comentários apenas se extremamente necessário

## 🧪 Plano de Testes

### Testes Unitários (Manual)
1. **Componente PerformanceChart**
   - Renderiza com dados válidos
   - Mostra skeleton durante loading
   - Mostra empty state sem dados
   - Responde a mudanças de período

2. **Controles Interativos**
   - Period selector atualiza gráfico
   - Toggle de métricas funciona
   - Export gera PNG válido
   - Fullscreen ativa em mobile

3. **Responsividade**
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667
   - Landscape: 667x375

### Testes de Integração
1. **Com Dados Mockados (Parte A)**
   ```typescript
   // Verificar que mock data é exibido
   const chart = render(<PerformanceChart channelId={1} />);
   expect(chart.getByTestId('line-roi')).toBeInTheDocument();
   expect(chart.getByTestId('line-profit')).toBeInTheDocument();
   ```

2. **Com Dados Reais (Parte B)**
   ```sql
   -- Verificar que function retorna dados
   SELECT COUNT(*) FROM get_channel_performance_timeline(1, '30d', 'daily');
   -- Deve retornar ~30 linhas
   ```

### Testes E2E com Playwright MCP
```javascript
// Fluxo completo
const testPerformanceChart = async () => {
  // 1. Navegar
  await browser_navigate({ url: 'http://localhost:3000/canais' });
  
  // 2. Selecionar canal
  await browser_click({ element: 'Canal 1', ref: 'channel-1' });
  
  // 3. Abrir performance
  await browser_click({ element: 'Performance', ref: 'tab-performance' });
  
  // 4. Verificar gráfico
  await browser_wait_for({ text: 'Performance do Canal' });
  const snapshot = await browser_snapshot();
  
  // 5. Interagir
  await browser_click({ element: '7 dias', ref: 'period-7d' });
  await browser_wait_for({ time: 1 });
  
  // 6. Export
  await browser_click({ element: 'Export', ref: 'btn-export' });
  
  // 7. Mobile
  await browser_resize({ width: 375, height: 667 });
  await browser_snapshot();
  
  return { success: true, snapshots: 2 };
};
```

### Checklist de Validação
- [ ] Gráfico renderiza em < 100ms
- [ ] Dados corretos para cada período
- [ ] Tooltips mostram valores precisos
- [ ] Export gera imagem válida
- [ ] Mobile gestures funcionam
- [ ] Sem memory leaks
- [ ] Acessível via teclado
- [ ] Cores respeitam tema dark/light

## 📚 Documentação Final

### Documentos a Criar

#### 1. Progress Document
**Path**: `/docs/features/progress/feature-2.19-progress.md`

Conteúdo:
- Status de cada tarefa (checkbox)
- Tempo real vs estimado
- Problemas encontrados
- Soluções aplicadas
- Screenshots dos resultados

#### 2. Handover Document
**Path**: `/docs/features/handover/feature-2.19-handover.md`

Conteúdo:
```markdown
# Feature 2.19 - Handover

## Componentes Criados
- `components/features/channels/PerformanceChart.tsx`
- `components/features/channels/PeriodSelector.tsx`
- `components/features/channels/ChartControls.tsx`
- `lib/hooks/useChannelPerformance.ts`

## Functions SQL
- `get_channel_performance_timeline(channel_id, period, aggregation)`
- `get_channel_statistics(channel_id, start_date, end_date)`

## Modificações
- `app/canais/[id]/page.tsx` - Adicionada tab Performance
- `components/features/channels/ChannelCard.tsx` - Preview opcional

## Como Usar
1. Importar PerformanceChart
2. Passar channelId como prop
3. Opcionalmente configurar period e height

## Customização
- Cores: Editar em PerformanceChart linha 45-50
- Períodos: Adicionar em PeriodSelector.tsx
- Métricas: Expandir em useChannelPerformance

## Troubleshooting
- Se gráfico não aparece: Verificar se canal tem tips
- Se export falha: Verificar html2canvas instalado
- Se performance lenta: Verificar índices no banco
```

#### 3. Test Guide
**Path**: `/docs/features/testing/feature-2.19-test.md`

Conteúdo:
- Passo a passo para teste manual
- Comandos Playwright MCP
- Queries SQL de validação
- Screenshots esperados
- Casos edge

### Git Commit Final
```bash
git add .
git commit -m "Complete Feature 2.19: Gráfico de Performance Real

- Implementado gráfico interativo com Recharts
- Controles de período e métricas
- Export como PNG
- Integração na página de detalhes
- Preview na listagem (opcional)
- Otimizado para mobile
- Testes E2E com Playwright MCP

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

## 📈 Métricas de Sucesso

### Funcionalidade
- [ ] Gráfico renderiza com dados (mock ou real)
- [ ] Todos os períodos funcionam
- [ ] Toggle de métricas operacional
- [ ] Export PNG funciona
- [ ] Mobile gestures implementados

### Performance
- [ ] Renderização inicial < 100ms
- [ ] Troca de período < 50ms
- [ ] Animações em 60fps
- [ ] Bundle size < 50KB adicional
- [ ] Cache hit rate > 80%

### UX
- [ ] Zero layout shift
- [ ] Loading states suaves
- [ ] Tooltips informativos
- [ ] Responsivo em todos devices
- [ ] Acessível via teclado

### Qualidade
- [ ] Zero erros no console
- [ ] Logs estruturados com contexto
- [ ] Error boundaries funcionando
- [ ] TypeScript sem any
- [ ] Código documentado onde necessário

## ⏱️ Estimativas Totais
- **Parte A (Independente)**: 5 horas
- **Parte B (Dependente)**: 2.5 horas
- **Total**: 7.5 horas
- **Complexidade**: Alta
- **Risco**: Médio (performance com muitos dados)

## 🚀 Como Começar

### Se Feature 2.18 NÃO está pronta:
1. Implementar toda Parte A com dados mockados
2. Testar UI/UX completamente
3. Fazer code review
4. Aguardar 2.18 para Parte B

### Se Feature 2.18 ESTÁ pronta:
1. Implementar Parte A e B sequencialmente
2. Substituir mocks por dados reais imediatamente
3. Testar end-to-end
4. Fazer commit único

## 🎯 Resultado Esperado

### Para Usuários
- Visualização clara da evolução do canal
- Identificação de tendências e padrões
- Tomada de decisão informada
- Compartilhamento de resultados (export)
- Maior confiança na plataforma

### Para o Negócio
- Aumento de transparência
- Diferencial competitivo
- Redução de churn
- Aumento de conversão
- Dados para marketing

---

*Criado em: 04/08/2025*
*Feature anterior: 2.18 - Sistema de Métricas Dinâmicas*
*Próxima feature: 2.20 - Histórico de Tips Públicas*
*Executor: Claude + Supabase MCP + Playwright MCP*