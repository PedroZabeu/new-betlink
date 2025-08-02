# Feature 2.15: Popular Dados + Queries Básicas

## 📋 Visão Geral

**Objetivo**: Popular as tabelas criadas na Feature 2.14 com dados mockados e criar página de comparação visual entre mock e banco.

**Complexidade**: 🟡 Média (3-4 horas)

**Entregáveis**:
1. Dados mockados migrados para Supabase
2. Página `/dev/data-migration` com comparação visual
3. Queries de verificação funcionando
4. 100% de sincronização entre mock e banco

## 🗄️ Dados a Migrar

### De `mock-channels.ts`:
- 12 canais completos
- Métricas por período (6 períodos por canal)
- Tags e categorização
- Informações de assinantes

### De `mock-channel-details.ts`:
- Planos de assinatura dinâmicos
- Informações "about" dos canais

## 📁 Estrutura de Arquivos

```
app/
├── dev/
│   └── data-migration/
│       └── page.tsx           # Página de comparação mock vs banco
│
components/
├── dev/
│   ├── DataComparisonTable.tsx    # Tabela comparativa
│   ├── SyncStatusBadge.tsx        # Badge de status de sincronização
│   └── MigrationProgress.tsx      # Barra de progresso visual
│
lib/
├── supabase/
│   └── queries/
│       ├── channels.ts        # Queries para channels
│       └── migration.ts       # Queries de verificação
└── utils/
    └── data-comparison.ts     # Lógica de comparação
```

## 🎨 Design da Página `/dev/data-migration`

### Layout Visual
```
┌─────────────────────────────────────────────┐
│  📊 Data Migration Status                    │
├─────────────────────────────────────────────┤
│                                             │
│  Overall Sync: [████████████] 100% ✅       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Channels (12/12)                    │   │
│  │ ✅ All channels synced              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Channel Tags (12/12)                │   │
│  │ ✅ All tags synced                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Channel Metrics (72/72)             │   │
│  │ ✅ All metrics synced               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Subscription Plans (30/30)          │   │
│  │ ✅ All plans synced                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  📋 Detailed Comparison                     │
│  ┌─────────────────────────────────────┐   │
│  │ Channel  │ Mock │ DB │ Status       │   │
│  ├──────────┼──────┼────┼──────────────┤   │
│  │ Name     │ ✓    │ ✓  │ ✅ Matched   │   │
│  │ Slug     │ ✓    │ ✓  │ ✅ Matched   │   │
│  │ Price    │ ✓    │ ✓  │ ✅ Matched   │   │
│  │ ...      │      │    │              │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Componentes Principais

1. **MigrationProgress**
   - Barra de progresso animada
   - Porcentagem de sincronização
   - Cores: verde (100%), amarelo (parcial), vermelho (erro)

2. **DataComparisonTable**
   - Comparação lado a lado
   - Destaque de diferenças
   - Filtros por status

3. **SyncStatusBadge**
   - ✅ Synced (verde)
   - ⚠️ Partial (amarelo)
   - ❌ Error (vermelho)
   - 🔄 Syncing (azul animado)

## 🔧 Implementação Step-by-Step

### Fase 1: População de Dados (Cursor via MCP)
1. Executar SQL para popular `channels`
2. Popular `channel_tags` com IDs corretos
3. Popular `channel_metrics` (todos os períodos)
4. Popular `subscription_plans`
5. Verificar integridade dos dados

### Fase 2: Queries de Verificação (Claude)
1. Criar queries para buscar dados
2. Funções de comparação com mock
3. Cálculo de porcentagem de sync
4. Detecção de diferenças

### Fase 3: Interface Visual (Claude)
1. Criar página base
2. Implementar componentes visuais
3. Adicionar animações de loading
4. Polir visual e responsividade

### Fase 4: Testes e Documentação
1. Testar comparação completa
2. Verificar 100% de sincronização
3. Atualizar documentação
4. Commit final

## 🧪 Testes E2E

### Cenários de Teste
1. **Acesso à página**
   - Navegar para `/dev/data-migration`
   - Verificar carregamento sem erros

2. **Status geral**
   - Verificar barra de progresso em 100%
   - Badge geral mostrando ✅

3. **Contagens**
   - 12 channels sincronizados
   - 12 channel tags
   - 72 channel metrics
   - ~30 subscription plans

4. **Comparação detalhada**
   - Expandir detalhes de um canal
   - Verificar todos os campos matched
   - Sem diferenças destacadas

5. **Performance**
   - Página carrega < 2s
   - Sem travamentos na UI

## ⚠️ Pontos de Atenção

1. **IDs Sequenciais**
   - Garantir que channel IDs sejam previsíveis
   - Usar RETURNING id se necessário

2. **Dados Sensíveis**
   - Não expor service key
   - Usar apenas anon key no frontend

3. **Performance**
   - Queries otimizadas com índices
   - Paginação se necessário
   - Loading states apropriados

4. **Precisão**
   - Conversão de preços (centavos)
   - Formatos de data consistentes
   - Arrays e JSONs corretos

## 🎯 Critérios de Sucesso

- [ ] Todas as tabelas populadas via MCP
- [ ] Página `/dev/data-migration` funcionando
- [ ] 100% de sincronização mostrada visualmente
- [ ] Sem erros no console
- [ ] Performance < 2s
- [ ] Testes E2E passando

## 🔗 Dependências

- Feature 2.14 completa (tabelas criadas)
- Dados mockados em `/lib/data/`
- Supabase client configurado
- MCP Supabase funcionando

## 📝 Notas de Implementação

### Queries Exemplo

```typescript
// lib/supabase/queries/channels.ts
export async function getAllChannels() {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_tags(*),
      channel_metrics(*),
      subscription_plans(*)
    `)
    .order('id');
    
  return { data, error };
}

// lib/utils/data-comparison.ts
export function compareChannelData(mockChannel: any, dbChannel: any) {
  const differences = [];
  
  // Comparar campos principais
  if (mockChannel.name !== dbChannel.name) {
    differences.push({ field: 'name', mock: mockChannel.name, db: dbChannel.name });
  }
  
  // ... outros campos
  
  return {
    isFullySync: differences.length === 0,
    differences,
    syncPercentage: ((totalFields - differences.length) / totalFields) * 100
  };
}
```

### Conversões Importantes

1. **Preços**: Mock em reais (149.90) → DB em centavos (14990)
2. **Slugs**: Gerar a partir do nome
3. **Arrays**: Specialties como ARRAY no PostgreSQL
4. **Booleanos**: is_premium, is_active