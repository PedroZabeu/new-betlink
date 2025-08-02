# Feature 2.16: Migrar Listagem de Canais

## 📋 Visão Geral

**Objetivo**: Substituir dados mockados por dados reais do Supabase na página /canais, mantendo toda funcionalidade existente.

**Complexidade**: 🟢 Baixa (2-3 horas)

**Entregáveis**:
1. Página /canais usando 100% dados do Supabase
2. Badge "Live Data 🔴" indicando fonte real
3. Filtros e ordenação funcionando com banco
4. Zero regressões visuais ou funcionais

## 🎯 Escopo Detalhado

### O que MUDA
- Fonte de dados: mock → Supabase
- Queries: TypeScript arrays → SQL queries
- Badge visual indicando dados reais

### O que NÃO MUDA
- Layout e design dos cards
- Lógica de filtros (apenas a fonte)
- Sistema de ordenação
- Componentes visuais
- URLs e rotas

## 🔧 Arquitetura Técnica

### Arquivos a Modificar
```
app/canais/
├── page.tsx                    # Server Component principal
└── canais-client.tsx          # Client Component (filtros)

lib/supabase/queries/
├── channels.ts                # Adicionar novas queries
└── channels-client.ts         # Queries client-side

components/features/channels/
└── channel-list.tsx          # Adicionar badge "Live Data"
```

### Queries Necessárias

1. **getChannelsWithDetails()** - Query principal (ATUALIZADA com descobertas do Cursor)
```typescript
export async function getChannelsWithDetails() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_tags!inner(*),
      channel_metrics!inner(*),
      subscription_plans!inner(*)
    `)
    .eq('is_active', true)
    .eq('channel_metrics.time_window', '30d') // Descoberta: usar '30d' não 'MONTH'
    .order('created_at', { ascending: false });
    
  return { data, error };
}
// NOTA: Removido JOIN com channel_tipsters (tabela vazia)
// NOTA: Removido avatar_url (campo não existe em profiles)
```

2. **getChannelsByFilters()** - Query com filtros
```typescript
export async function getChannelsByFilters(filters: ChannelFilters) {
  let query = supabase
    .from('channels')
    .select('...')
    .eq('is_active', true);
    
  // Aplicar filtros dinamicamente
  if (filters.sport) {
    query = query.eq('channel_tags.sport', filters.sport);
  }
  
  if (filters.priceRange) {
    query = query.gte('base_price', filters.priceRange.min)
                 .lte('base_price', filters.priceRange.max);
  }
  
  // ... outros filtros
  
  return await query;
}
```

## 📊 Mapeamento de Dados

### Mock → Database

| Campo Mock | Campo DB | Transformação |
|------------|----------|---------------|
| `channel.name` | `channels.name` | Direto |
| `channel.slug` | `channels.slug` | Direto |
| `channel.price` | `channels.base_price` | Dividir por 100 |
| `channel.sport` | `channel_tags.sport` | Via join |
| `channel.roi` | `channel_metrics.roi` | Filtrar por time_window='30d' |
| `channel.tipster` | N/A | Tabela vazia - usar placeholder |
| `channel.subscribers` | `channels.current_subscribers` | Direto |
| `channel.maxSubscribers` | `channels.max_subscribers` | Direto |

### Períodos de Métricas (ATUALIZADO)
- Mock usa strings: "7d", "30d", "6m"
- DB usa MESMAS strings: "7d", "30d", "6m", "ytd", "total"
- Não precisa conversão! ✅

## 🎨 UI Updates

### Badge "Live Data"
```tsx
// No header do ChannelList
<div className="flex items-center gap-2">
  <h2>Canais Disponíveis</h2>
  <Badge variant="destructive" className="animate-pulse">
    <Circle className="h-2 w-2 fill-current" />
    <span className="ml-1">Live Data</span>
  </Badge>
</div>
```

### Loading States
- Skeleton cards durante carregamento
- Mensagem se nenhum canal encontrado
- Tratamento de erros com retry

## 🔄 Fluxo de Implementação

### Fase 1: Setup Queries (30 min)
1. Criar `getChannelsWithDetails()` com todos os joins
2. Testar query no Supabase Dashboard
3. Adicionar tipos TypeScript
4. Implementar tratamento de erros

### Fase 2: Integração Server Component (45 min)
1. Modificar `app/canais/page.tsx`
2. Remover importação de mock
3. Usar nova query do Supabase
4. Passar dados para Client Component

### Fase 3: Adaptação Client Component (45 min)
1. Ajustar tipos de dados recebidos
2. Adaptar lógica de filtros
3. Manter estado e interatividade
4. Testar todos os filtros

### Fase 4: Polish e Testes (30 min)
1. Adicionar badge "Live Data"
2. Implementar loading states
3. Testar edge cases
4. Verificar performance

## 🧪 Critérios de Teste

### Funcionalidades
- [ ] Página carrega sem erros
- [ ] 12 canais aparecem corretamente
- [ ] Badge "Live Data" visível e pulsando
- [ ] Todos os filtros funcionam
- [ ] Ordenação mantida
- [ ] Cards com dados corretos

### Performance
- [ ] Tempo de carregamento < 2s
- [ ] Sem flickering na UI
- [ ] Queries otimizadas

### Regressões
- [ ] Layout idêntico ao anterior
- [ ] Responsividade mantida
- [ ] Interações preservadas
- [ ] URLs funcionando

## ⚠️ Pontos de Atenção (ATUALIZADOS)

### 1. Joins Simplificados
- Channel → Tags → Metrics → Plans
- Remover join com Tipsters (tabela vazia)
- Query otimizada testada: 39.96ms ✅

### 2. Conversão de Dados
- Preços: centavos → reais (÷ 100)
- Períodos: Não precisa! DB usa mesmas strings
- Time window: Sempre filtrar por '30d'

### 3. Filtros Client-Side vs Server-Side
- Filtros básicos: server-side (SQL)
- Filtros complexos: considerar client-side
- Balance entre performance e UX

### 4. Dados Faltantes
- **Tipster name**: Usar placeholder "Tipster Pro" por enquanto
- **Avatar**: Sem campo avatar_url, usar ícone padrão
- Solução futura: Popular channel_tipsters

## 🚫 O que NÃO fazer

1. **NÃO modificar** estrutura das tabelas
2. **NÃO adicionar** novas colunas
3. **NÃO implementar** escrita (apenas leitura)
4. **NÃO quebrar** funcionalidades existentes
5. **NÃO mudar** design ou layout

## 📝 Notas de Implementação

### Tipos TypeScript
```typescript
// Tipo para o retorno do Supabase
interface ChannelWithDetails {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  // ... outros campos
  channel_tags: ChannelTag;
  channel_metrics: ChannelMetric[];
  subscription_plans: SubscriptionPlan[];
  channel_tipsters: {
    profiles: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
  }[];
}

// Converter para formato esperado pelo frontend
function transformChannelData(dbChannel: ChannelWithDetails): Channel {
  return {
    id: dbChannel.id.toString(),
    name: dbChannel.name,
    price: dbChannel.base_price / 100,
    // ... outras transformações
  };
}
```

### Error Handling
```typescript
try {
  const { data, error } = await getChannelsWithDetails();
  
  if (error) {
    console.error('Failed to fetch channels:', error);
    // Mostrar UI de erro
    return <ChannelsError />;
  }
  
  if (!data || data.length === 0) {
    // Mostrar estado vazio
    return <NoChannelsFound />;
  }
  
  // Processar e exibir dados
} catch (error) {
  // Fallback para erro crítico
  return <CriticalError />;
}
```

## 🎯 Definition of Done

- [ ] Queries Supabase implementadas e testadas
- [ ] Página /canais usando dados reais
- [ ] Badge "Live Data" visível
- [ ] Todos os filtros funcionando
- [ ] Sem regressões visuais
- [ ] Performance < 2s
- [ ] Código commitado
- [ ] Documentação atualizada