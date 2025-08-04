# Feature 2.20: Histórico de Tips Resolvidas (Proteção do Modelo de Negócio)

## 📋 Contexto
Com a Feature 2.18 implementada (tabela tips com 250+ registros) e 2.19 planejada (gráficos), agora precisamos mostrar o histórico de apostas JÁ RESOLVIDAS de cada canal. Isso traz transparência sem comprometer o modelo de negócio, pois tips pendentes/futuras permanecem exclusivas para assinantes.

## 🎯 Objetivo
1. Exibir histórico de tips RESOLVIDAS (win/loss/void)
2. NUNCA mostrar tips pendentes ou futuras
3. Permitir análise de performance histórica
4. Proteger valor dos assinantes pagos
5. Performance < 50ms para listagem paginada

## ⚠️ REGRA DE NEGÓCIO CRÍTICA
```sql
-- SEMPRE aplicar este filtro no backend
WHERE status IN ('win', 'loss', 'void')
  AND event_date < NOW() - INTERVAL '3 hours'
  AND status != 'pending'
```

**NUNCA expor tips com status 'pending' para não-assinantes!**

## 🛠️ Stack Técnica
- **Tabela**: DataTable com Tanstack Table
- **Dados**: Query paginada com filtro obrigatório
- **Cache**: React Query com 5 min stale time
- **Filtros**: URL state para compartilhamento
- **Export**: CSV apenas de tips resolvidas
- **Segurança**: RLS + filtros backend

## 🚀 Estratégia de Execução Paralela

### PARTE A: Implementar AGORA (Independente da 2.18)
**Tempo estimado: 5 horas**

1. **Componente DataTable** (2h)
2. **Sistema de Filtros** (1h)
3. **Integração na UI** (1h)
4. **Export e Proteções** (1h)

### PARTE B: Implementar APÓS Feature 2.18
**Tempo estimado: 2 horas**

1. **Queries Seguras** (1h)
2. **Integração Real** (30min)
3. **Testes E2E** (30min)

## 📊 Escopo Detalhado

### PARTE A: Desenvolvimento Independente (5h)

#### Fase A1: Componente DataTable Seguro (2h)

##### Tarefa A1.1: Setup TipsHistoryTable (45min)
- [ ] Criar `components/features/channels/TipsHistoryTable.tsx`
- [ ] Configurar Tanstack Table com TypeScript
- [ ] Colunas: Data, Aposta (truncada), Odds, Stake, Resultado, P/L
- [ ] Badge indicando "Histórico Público"
- [ ] Implementar com dados mockados RESOLVIDOS

```tsx
// components/features/channels/TipsHistoryTable.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lock } from 'lucide-react';
import { logger } from '@/lib/utils/logger';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResolvedTip {
  id: number;
  event_date: string;
  description: string;
  odds: number;
  stake: number;
  status: 'win' | 'loss' | 'void'; // NUNCA 'pending'
  profit_loss: number;
  days_old: number;
}

const columns: ColumnDef<ResolvedTip>[] = [
  {
    accessorKey: 'event_date',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('event_date');
      const daysOld = row.original.days_old;
      
      return (
        <div className="font-medium">
          {format(new Date(date), 'dd/MM/yy HH:mm', { locale: ptBR })}
          {daysOld < 1 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Recente
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Aposta',
    cell: ({ row }) => {
      const description = row.getValue<string>('description');
      const daysOld = row.original.days_old;
      const isSubscriber = false; // TODO: check subscription
      
      // Proteção: truncar descrições muito recentes para não-assinantes
      const displayText = !isSubscriber && daysOld < 7
        ? description.substring(0, 40) + '...'
        : description;
      
      return (
        <div className="max-w-[300px] truncate" title={isSubscriber ? description : 'Assine para ver completo'}>
          {displayText}
          {!isSubscriber && daysOld < 7 && (
            <Lock className="inline ml-1 h-3 w-3 text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'odds',
    header: 'Odds',
    cell: ({ row }) => (
      <div className="text-center font-mono">
        {row.getValue<number>('odds').toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'stake',
    header: 'Stake',
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue<number>('stake')}u
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Resultado',
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      const variants = {
        win: 'success',
        loss: 'destructive',
        void: 'secondary'
      } as const;
      
      const labels = {
        win: 'Ganhou',
        loss: 'Perdeu',
        void: 'Anulada'
      };
      
      return (
        <Badge variant={variants[status as keyof typeof variants]}>
          {labels[status as keyof typeof labels]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'profit_loss',
    header: 'P/L',
    cell: ({ row }) => {
      const value = row.getValue<number>('profit_loss');
      const isPositive = value > 0;
      
      return (
        <div className={`text-right font-medium ${isPositive ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
          {isPositive ? '+' : ''}{value.toFixed(2)}u
        </div>
      );
    },
  },
];

export function TipsHistoryTable({ 
  channelId,
  isSubscriber = false 
}: { 
  channelId: number;
  isSubscriber?: boolean;
}) {
  // TODO: Substituir por useResolvedTipsHistory após Feature 2.18
  const { data, isLoading, pendingCount } = useMockResolvedTips(channelId);
  
  const table = useReactTable({
    data: data?.tips || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: 'event_date', desc: true }],
    },
  });
  
  logger.info('TipsHistoryTable rendered', { 
    channelId, 
    resolvedCount: data?.tips?.length,
    pendingCount,
    isSubscriber 
  });
  
  if (isLoading) return <TableSkeleton />;
  
  return (
    <div className="space-y-4">
      {/* Alert de Proteção */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Mostrando apenas apostas finalizadas. 
            {pendingCount > 0 && !isSubscriber && (
              <span className="font-medium ml-1">
                ({pendingCount} tips ao vivo disponíveis para assinantes)
              </span>
            )}
          </span>
          {!isSubscriber && (
            <Badge variant="outline" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Histórico Público
            </Badge>
          )}
        </AlertDescription>
      </Alert>
      
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhuma tip finalizada encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
```

##### Tarefa A1.2: Mock Data Seguro (30min)
- [ ] Criar `lib/mocks/resolved-tips-data.ts`
- [ ] Gerar APENAS tips resolvidas
- [ ] Simular delay de 3+ horas
- [ ] Incluir contador de pendentes (sem mostrar)

```tsx
// lib/mocks/resolved-tips-data.ts
export function generateMockResolvedTips(channelId: number) {
  const tips = [];
  const now = new Date();
  
  // Gerar 100 tips RESOLVIDAS (antigas)
  for (let i = 0; i < 100; i++) {
    // Mínimo 3 horas atrás, máximo 90 dias
    const hoursAgo = Math.floor(Math.random() * (90 * 24 - 3) + 3);
    const eventDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    // APENAS status resolvidos
    const status = faker.helpers.weightedArrayElement([
      { weight: 54, value: 'win' },
      { weight: 44, value: 'loss' },
      { weight: 2, value: 'void' }
    ]);
    
    const odds = faker.number.float({ min: 1.5, max: 3.5, precision: 0.01 });
    const stake = faker.helpers.arrayElement([1, 2, 3, 5, 10]);
    
    let profitLoss = 0;
    if (status === 'win') {
      profitLoss = stake * (odds - 1);
    } else if (status === 'loss') {
      profitLoss = -stake;
    }
    
    tips.push({
      id: i + 1,
      event_date: eventDate.toISOString(),
      description: generateBetDescription(),
      odds,
      stake,
      status, // NUNCA 'pending'
      profit_loss: parseFloat(profitLoss.toFixed(2)),
      days_old: Math.floor(hoursAgo / 24)
    });
  }
  
  // Simular contagem de pendentes (não mostrar detalhes)
  const pendingCount = Math.floor(Math.random() * 5) + 2;
  
  return {
    tips: tips.sort((a, b) => 
      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    ),
    pendingCount // Apenas o número, sem detalhes
  };
}
```

##### Tarefa A1.3: Proteções Visuais (30min)
- [ ] Indicador de conteúdo truncado
- [ ] Tooltips explicativos
- [ ] Badge "Público" vs "Assinante"
- [ ] Blur em descrições muito recentes

##### Tarefa A1.4: Estados e Feedback (15min)
- [ ] Loading com mensagem de segurança
- [ ] Empty state incentivando assinatura
- [ ] Info cards sobre proteção
- [ ] Link para página de assinatura

#### Fase A2: Sistema de Filtros Seguro (1h)

##### Tarefa A2.1: TipsFilters Component (30min)
- [ ] Criar `TipsFilters.tsx`
- [ ] REMOVER opção "Pendente" dos filtros
- [ ] Filtros: Todas, Vitórias, Derrotas, Anuladas
- [ ] Date range picker (apenas datas passadas)

```tsx
// components/features/channels/TipsFilters.tsx
export function TipsFilters({ filters, onFiltersChange }: TipsFiltersProps) {
  const handleStatusChange = (status: string) => {
    // NUNCA permitir filtro por 'pending'
    if (status === 'pending') return;
    
    onFiltersChange({ ...filters, status: status === 'all' ? undefined : status });
    logger.info('Filter changed', { type: 'status', value: status });
  };
  
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
      <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Resultado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="win">Vitórias</SelectItem>
          <SelectItem value="loss">Derrotas</SelectItem>
          <SelectItem value="void">Anuladas</SelectItem>
          {/* NÃO incluir opção 'pending' */}
        </SelectContent>
      </Select>
      
      <DatePickerWithRange
        date={{ from: filters.dateFrom, to: filters.dateTo }}
        onDateChange={handleDateRangeChange}
        maxDate={new Date()} // Não permitir datas futuras
        className="w-[300px]"
      />
      
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Tips ao vivo disponíveis apenas para assinantes</span>
      </div>
    </div>
  );
}
```

##### Tarefa A2.2: Quick Filters Seguros (20min)
- [ ] "Últimos 7 dias finalizados"
- [ ] "Últimos 30 dias finalizados"
- [ ] "Apenas vitórias"
- [ ] Banner CTA para assinatura

##### Tarefa A2.3: URL State (10min)
- [ ] Sincronizar com URL params
- [ ] Validar parâmetros (sem 'pending')
- [ ] Compartilhamento seguro
- [ ] Analytics de compartilhamento

#### Fase A3: Integração na UI (1h)

##### Tarefa A3.1: Tab Histórico Público (30min)
- [ ] Adicionar tab em channel/[id]
- [ ] Ícone de cadeado para não-assinantes
- [ ] Label "Histórico Público"
- [ ] CTA para ver tips ao vivo

```tsx
// app/canais/[id]/page.tsx - Tab com proteção
<Tabs defaultValue="info" className="w-full">
  <TabsList className="grid w-full grid-cols-4">
    <TabsTrigger value="info">Informações</TabsTrigger>
    <TabsTrigger value="performance">Performance</TabsTrigger>
    <TabsTrigger value="history" className="relative">
      <Lock className="h-3 w-3 mr-1" />
      Histórico
      {pendingCount > 0 && (
        <Badge className="absolute -top-1 -right-1 animate-pulse" variant="destructive">
          {pendingCount}
        </Badge>
      )}
    </TabsTrigger>
    <TabsTrigger value="reviews">Avaliações</TabsTrigger>
  </TabsList>
  
  <TabsContent value="history" className="space-y-4">
    {!isSubscriber && (
      <Alert className="border-primary">
        <Lock className="h-4 w-4" />
        <AlertTitle>Histórico Público</AlertTitle>
        <AlertDescription>
          Você está vendo apenas apostas já finalizadas. 
          <Button variant="link" className="px-1" onClick={() => router.push(`/assinar/${channelId}`)}>
            Assine agora
          </Button>
          para acessar {pendingCount} tips ao vivo e análises em tempo real.
        </AlertDescription>
      </Alert>
    )}
    
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Tips Finalizadas</CardTitle>
        <CardDescription>
          Apostas resolvidas dos últimos 90 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TipsFilters filters={filters} onFiltersChange={setFilters} />
        <TipsSummary data={filteredData} isPublic={!isSubscriber} />
        <TipsHistoryTable 
          channelId={channel.id} 
          filters={filters}
          isSubscriber={isSubscriber}
        />
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

##### Tarefa A3.2: Summary Cards com Proteção (20min)
- [ ] Cards mostrando apenas métricas públicas
- [ ] "X tips ao vivo" sem detalhes
- [ ] ROI e Win Rate dos finalizados
- [ ] CTA em cada card

```tsx
// components/features/channels/TipsSummary.tsx
export function TipsSummary({ data, isPublic }: { data: any; isPublic: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className={isPublic ? 'border-dashed' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Tips Finalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.resolvedCount}</div>
          {isPublic && data.pendingCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{data.pendingCount} ao vivo
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Outros cards com indicação de público/privado */}
    </div>
  );
}
```

##### Tarefa A3.3: Mobile Security (10min)
- [ ] Bottom sheet com alerta
- [ ] Touch ID para assinantes
- [ ] Scroll lock em descrições
- [ ] PWA manifest atualizado

#### Fase A4: Export com Proteção (1h)

##### Tarefa A4.1: Export CSV Seguro (30min)
- [ ] Exportar APENAS tips resolvidas
- [ ] Adicionar header com disclaimer
- [ ] Truncar descrições recentes
- [ ] Watermark com data/hora

```tsx
// lib/utils/export-csv-secure.ts
export function exportResolvedTipsToCSV(
  tips: ResolvedTip[], 
  channelName: string,
  isSubscriber: boolean
) {
  // Header com disclaimer
  const disclaimer = [
    `# Histórico Público - ${channelName}`,
    `# Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
    `# Contém apenas apostas finalizadas`,
    isSubscriber ? '' : '# Para tips ao vivo, assine o canal',
    ''
  ].filter(Boolean).join('\n');
  
  const headers = ['Data', 'Descrição', 'Odds', 'Stake', 'Resultado', 'P/L'];
  
  const rows = tips.map(tip => {
    // Proteção de descrição
    const description = !isSubscriber && tip.days_old < 7
      ? tip.description.substring(0, 30) + '...'
      : tip.description;
    
    return [
      format(new Date(tip.event_date), 'dd/MM/yyyy HH:mm'),
      description,
      tip.odds.toFixed(2).replace('.', ','),
      `${tip.stake}u`,
      getStatusLabel(tip.status),
      `${tip.profit_loss.toFixed(2).replace('.', ',')}u`
    ];
  });
  
  const csvContent = [
    disclaimer,
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');
  
  // Download com nome seguro
  const fileName = `historico-publico-${channelName}-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`;
  
  logger.audit('csv_export', 'tips_history', { 
    channelName, 
    count: tips.length,
    isSubscriber 
  });
  
  // ... código de download
}
```

##### Tarefa A4.2: Share Protection (20min)
- [ ] Share link com parâmetro público
- [ ] Meta tags indicando conteúdo parcial
- [ ] Rate limiting no share
- [ ] Track shares para marketing

##### Tarefa A4.3: Print Protection (10min)
- [ ] CSS print com watermark
- [ ] Remover tips muito recentes
- [ ] Footer com disclaimer
- [ ] QR code para assinatura

### PARTE B: Desenvolvimento Dependente (2h)

#### Fase B1: Queries Seguras (1h)

##### Tarefa B1.1: Function com Proteção (30min)
- [ ] Criar `get_resolved_tips_paginated`
- [ ] WHERE obrigatório para status
- [ ] Delay mínimo de 3 horas
- [ ] Count de pendentes separado
- [ ] **Executar via Supabase MCP**

```sql
CREATE OR REPLACE FUNCTION get_resolved_tips_paginated(
  p_channel_id INTEGER,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_status TEXT DEFAULT NULL,
  p_date_from TIMESTAMPTZ DEFAULT NULL,
  p_date_to TIMESTAMPTZ DEFAULT NULL,
  p_min_stake NUMERIC DEFAULT NULL,
  p_order_by TEXT DEFAULT 'event_date',
  p_order_dir TEXT DEFAULT 'DESC',
  p_is_subscriber BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
  tips JSON,
  total_count INTEGER,
  pending_count INTEGER
) AS $$
DECLARE
  v_tips JSON;
  v_total INTEGER;
  v_pending INTEGER;
BEGIN
  -- CRÍTICO: Contar pendentes sem expor
  SELECT COUNT(*)
  INTO v_pending
  FROM tips
  WHERE channel_id = p_channel_id
    AND status = 'pending';
  
  -- CRÍTICO: Filtro de segurança obrigatório
  SELECT COUNT(*)
  INTO v_total
  FROM tips
  WHERE channel_id = p_channel_id
    AND status IN ('win', 'loss', 'void') -- NUNCA 'pending'
    AND event_date < NOW() - INTERVAL '3 hours' -- Delay de proteção
    AND (p_status IS NULL OR status = p_status)
    AND (p_date_from IS NULL OR event_date >= p_date_from)
    AND (p_date_to IS NULL OR event_date <= p_date_to)
    AND (p_min_stake IS NULL OR stake >= p_min_stake);
  
  -- Buscar apenas tips seguras
  SELECT json_agg(
    json_build_object(
      'id', t.id,
      'event_date', t.event_date,
      'description', CASE 
        WHEN NOT p_is_subscriber AND t.event_date > NOW() - INTERVAL '7 days' 
        THEN SUBSTRING(t.description, 1, 40) || '...'
        ELSE t.description
      END,
      'odds', t.odds,
      'stake', t.stake,
      'status', t.status,
      'profit_loss', t.profit_loss,
      'days_old', EXTRACT(DAY FROM NOW() - t.event_date)
    ) ORDER BY t.event_date DESC
  )
  INTO v_tips
  FROM (
    SELECT *
    FROM tips
    WHERE channel_id = p_channel_id
      AND status IN ('win', 'loss', 'void') -- PROTEÇÃO
      AND event_date < NOW() - INTERVAL '3 hours' -- PROTEÇÃO
      AND (p_status IS NULL OR status = p_status)
      AND (p_date_from IS NULL OR event_date >= p_date_from)
      AND (p_date_to IS NULL OR event_date <= p_date_to)
      AND (p_min_stake IS NULL OR stake >= p_min_stake)
    ORDER BY 
      CASE WHEN p_order_dir = 'DESC' THEN event_date END DESC,
      CASE WHEN p_order_dir = 'ASC' THEN event_date END ASC
    LIMIT p_limit
    OFFSET p_offset
  ) t;
  
  RETURN QUERY SELECT v_tips, v_total, v_pending;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant apropriado
GRANT EXECUTE ON FUNCTION get_resolved_tips_paginated TO authenticated;
```

##### Tarefa B1.2: RLS Policy Adicional (20min)
- [ ] Policy para tips table
- [ ] Bloquear SELECT de pending para anon
- [ ] Permitir tudo para subscribers
- [ ] **Executar via Supabase MCP**

```sql
-- RLS para proteção adicional
CREATE POLICY "Public can only see resolved tips"
ON tips FOR SELECT
TO anon
USING (
  status IN ('win', 'loss', 'void')
  AND event_date < NOW() - INTERVAL '3 hours'
);

CREATE POLICY "Authenticated see based on subscription"
ON tips FOR SELECT
TO authenticated
USING (
  CASE
    WHEN EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.user_id = auth.uid()
        AND s.channel_id = tips.channel_id
        AND s.status = 'active'
    ) THEN TRUE -- Assinante vê tudo
    ELSE status IN ('win', 'loss', 'void') 
      AND event_date < NOW() - INTERVAL '3 hours' -- Não-assinante vê só resolvidas
  END
);
```

##### Tarefa B1.3: Índices de Segurança (10min)
- [ ] Índice parcial para resolvidas
- [ ] Índice para query de pendentes
- [ ] Analyze performance
- [ ] **Executar via Supabase MCP**

```sql
-- Índice otimizado para queries públicas
CREATE INDEX idx_tips_resolved 
ON tips(channel_id, event_date DESC) 
WHERE status IN ('win', 'loss', 'void')
  AND event_date < NOW() - INTERVAL '3 hours';

-- Índice para contagem rápida de pendentes
CREATE INDEX idx_tips_pending_count
ON tips(channel_id)
WHERE status = 'pending';
```

#### Fase B2: Integração Segura (30min)

##### Tarefa B2.1: Hook com Proteção (15min)
- [ ] Criar `useResolvedTipsHistory`
- [ ] Passar flag isSubscriber
- [ ] Cache diferente para público/privado
- [ ] Error handling robusto

```tsx
// lib/hooks/useResolvedTipsHistory.ts
export function useResolvedTipsHistory(
  channelId: number,
  filters: TipsFilters,
  page: number = 1,
  pageSize: number = 10
) {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription(channelId);
  
  return useQuery({
    queryKey: ['resolved-tips', channelId, filters, page, pageSize, isSubscriber],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_resolved_tips_paginated', {
          p_channel_id: channelId,
          p_limit: pageSize,
          p_offset: (page - 1) * pageSize,
          p_status: filters.status,
          p_date_from: filters.dateFrom,
          p_date_to: filters.dateTo,
          p_min_stake: filters.minStake,
          p_order_by: filters.orderBy || 'event_date',
          p_order_dir: filters.orderDir || 'DESC',
          p_is_subscriber: isSubscriber
        });
      
      if (error) {
        logger.error('Failed to fetch resolved tips', error, { 
          channelId, 
          filters,
          isSubscriber 
        });
        throw error;
      }
      
      logger.info('Resolved tips fetched', { 
        channelId, 
        resolvedCount: data?.tips?.length,
        pendingCount: data?.pending_count,
        isSubscriber
      });
      
      return {
        tips: data?.tips || [],
        total: data?.total_count || 0,
        pendingCount: data?.pending_count || 0,
        pageCount: Math.ceil((data?.total_count || 0) / pageSize)
      };
    },
    staleTime: isSubscriber ? 2 * 60 * 1000 : 5 * 60 * 1000, // Cache mais longo para público
    keepPreviousData: true,
  });
}
```

##### Tarefa B2.2: Validação de Segurança (15min)
- [ ] Verificar que pending nunca aparece
- [ ] Confirmar delay de 3 horas
- [ ] Testar truncamento de descrições
- [ ] Validar com/sem assinatura

#### Fase B3: Testes E2E de Segurança (30min)

##### Tarefa B3.1: Playwright Security Tests (20min)
- [ ] Testar como não-assinante
- [ ] Verificar ausência de pending
- [ ] Testar delay de 3 horas
- [ ] Verificar truncamento
- [ ] **Executar via Playwright MCP**

```javascript
// Teste E2E de Segurança com Playwright MCP
const testSecureHistory = async () => {
  // Teste como NÃO-assinante
  await browser_navigate({ url: 'http://localhost:3000/canais/1' });
  await browser_click({ element: 'Histórico', ref: 'tab-history' });
  await browser_wait_for({ text: 'Histórico Público' });
  
  // Verificar que NÃO mostra pending
  const snapshot = await browser_snapshot();
  // Assert: não deve conter "Pendente"
  
  // Verificar truncamento
  await browser_click({ element: 'Primeira tip', ref: 'tip-row-1' });
  // Assert: descrição deve ter "..."
  
  // Verificar CTA de assinatura
  await browser_wait_for({ text: 'tips ao vivo disponíveis para assinantes' });
  
  // Export seguro
  await browser_click({ element: 'Exportar CSV', ref: 'btn-export' });
  // Verificar que CSV tem disclaimer
  
  // Teste como assinante (mock login)
  await mockLogin({ subscriber: true });
  await browser_navigate({ url: 'http://localhost:3000/canais/1' });
  await browser_click({ element: 'Histórico', ref: 'tab-history' });
  
  // Verificar acesso completo
  const subscriberSnapshot = await browser_snapshot();
  // Assert: deve ter descrições completas
  
  return { success: true };
};
```

##### Tarefa B3.2: Validação de Performance (10min)
- [ ] Testar com 1000+ tips resolvidas
- [ ] Verificar tempo < 50ms
- [ ] Memory profiling
- [ ] Cache effectiveness

## ⚠️ Guardrails

### NUNCA Fazer
- ❌ Mostrar tips com status 'pending'
- ❌ Mostrar tips futuras
- ❌ Expor tips < 3 horas de idade
- ❌ Permitir filtro por 'pending'
- ❌ Mostrar descrições completas recentes para não-assinantes
- ❌ Cachear dados sensíveis no frontend

### SEMPRE Fazer
- ✅ Aplicar WHERE status IN ('win','loss','void')
- ✅ Aplicar delay de 3+ horas
- ✅ Truncar descrições recentes
- ✅ Mostrar contador de pendentes (sem detalhes)
- ✅ Incluir CTAs para assinatura
- ✅ Logs de auditoria em exports

### Segurança em Camadas
1. **Backend**: Function com WHERE obrigatório
2. **RLS**: Policies bloqueando pending
3. **Frontend**: Validação adicional
4. **UI**: Indicadores visuais de proteção
5. **Export**: Dados sanitizados

## 🧪 Plano de Testes

### Testes de Segurança (CRÍTICO)
1. **Proteção de Pending**
   ```sql
   -- Deve retornar 0
   SELECT COUNT(*) FROM get_resolved_tips_paginated(1, 100, 0)
   WHERE status = 'pending';
   ```

2. **Delay de 3 horas**
   ```sql
   -- Deve retornar 0
   SELECT COUNT(*) FROM get_resolved_tips_paginated(1, 100, 0)
   WHERE event_date > NOW() - INTERVAL '3 hours';
   ```

3. **Truncamento**
   ```typescript
   // Para não-assinante, descrições < 7 dias devem ter '...'
   const tips = await getResolvedTips(channelId, { isSubscriber: false });
   const recentTip = tips.find(t => t.days_old < 7);
   expect(recentTip.description).toContain('...');
   ```

### Testes Funcionais
- [ ] Tabela carrega apenas resolvidas
- [ ] Filtros funcionam (sem pending)
- [ ] Paginação correta
- [ ] Export com disclaimer
- [ ] CTAs visíveis

### Testes de UX
- [ ] Indicadores de conteúdo protegido
- [ ] Mensagens claras sobre assinatura
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Empty states informativos

## 📚 Documentação Final

### Documentos a Criar

#### 1. Security Guide
**Path**: `/docs/security/tips-protection.md`

Documentar:
- Camadas de proteção
- Regras de negócio
- Testes de segurança
- Monitoramento

#### 2. Progress Document
**Path**: `/docs/features/progress/feature-2.20-progress.md`

#### 3. Handover Document
**Path**: `/docs/features/handover/feature-2.20-handover.md`

### Git Commit Final
```bash
git add .
git commit -m "Complete Feature 2.20: Histórico de Tips Resolvidas (Seguro)

- DataTable mostrando APENAS tips resolvidas
- Proteção de tips pendentes/futuras
- Delay de 3 horas para proteção
- Truncamento de descrições recentes
- Export CSV com disclaimer
- CTAs para conversão
- RLS policies de segurança
- Testes de segurança validados

SEGURANÇA: Tips pendentes NUNCA expostas para não-assinantes

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

## 📈 Métricas de Sucesso

### Segurança
- [ ] 0 tips pendentes expostas
- [ ] 100% tips com 3+ horas delay
- [ ] Descrições truncadas < 7 dias
- [ ] RLS policies ativas

### Funcionalidade
- [ ] Tabela mostra resolvidas
- [ ] Filtros funcionando
- [ ] Export seguro
- [ ] CTAs funcionais

### Performance
- [ ] Query < 50ms
- [ ] Render < 100ms
- [ ] Export < 500ms
- [ ] Cache hit > 80%

### Conversão
- [ ] CTAs clicáveis
- [ ] Contador de pendentes visível
- [ ] Links para assinatura
- [ ] Tracking ativo

## ⏱️ Estimativas Totais
- **Parte A**: 5 horas (independente)
- **Parte B**: 2 horas (após 2.18)
- **Total**: 7 horas
- **Complexidade**: Alta (segurança crítica)
- **Risco**: Alto se mal implementado

## 🚀 Como Começar

### Parte A (Agora)
1. Implementar DataTable com mocks RESOLVIDOS
2. Criar filtros SEM opção pending
3. Adicionar todas as proteções visuais
4. Testar UX de não-assinante

### Parte B (Após 2.18)
1. Criar function com WHERE obrigatório
2. Implementar RLS policies
3. Testar segurança extensivamente
4. Validar com Playwright

## 🎯 Resultado Esperado

### Para o Negócio
- **Modelo protegido**: Tips valiosas apenas para pagantes
- **Transparência**: Histórico verificável
- **Conversão**: CTAs estratégicos
- **Confiança**: Sem vazamento de valor

### Para Usuários
- **Free**: Veem performance histórica
- **Pagos**: Acesso total e em tempo real
- **Tipsters**: Credibilidade sem comprometer

---

*Criado em: 04/08/2025*
*Feature anterior: 2.19 - Gráfico de Performance*
*Próxima feature: 2.21 - Sistema de Reviews*
*CRÍTICO: Proteção do modelo de negócio*