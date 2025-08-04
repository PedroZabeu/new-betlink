# Migração para Métricas Live - COMPLETO

## 🎯 Problema Identificado
- Página de listagem (/canais) mostrava métricas dinâmicas da view `channel_metrics_live`
- Página de detalhes (/canais/[slug]) mostrava métricas antigas da tabela `channel_metrics` (hardcoded)
- Inconsistência entre as duas páginas

## ✅ Solução Implementada

### 1. **Atualização da Query de Detalhes**

**Arquivo:** `/lib/supabase/queries/channel-details.ts`

#### Antes:
```typescript
// Buscava da tabela channel_metrics (hardcoded)
.select(`
  *,
  channel_metrics(*),  // ❌ Dados antigos
  ...
`)
```

#### Depois:
```typescript
// Busca da view channel_metrics_live
const { data: liveMetrics } = await supabase
  .from('channel_metrics_live')
  .select('*')
  .eq('channel_id', channel.id)
  .single();

// Transforma para o formato esperado
const periods = [
  { window: '7d', profit: liveMetrics.profit_7d, roi: liveMetrics.roi_7d, ... },
  { window: '30d', profit: liveMetrics.profit_30d, roi: liveMetrics.roi_30d, ... },
  // etc...
];
```

### 2. **Atualização da Função getChannelMetricsByPeriod**

Agora busca da view `channel_metrics_live` e extrai o período específico solicitado.

## 📊 Diferenças Entre as Tabelas

### `channel_metrics` (ANTIGA - Hardcoded)
- 84 registros estáticos
- Dados não atualizados
- Múltiplos registros por canal (um para cada período)
- **PODE SER REMOVIDA** ❌

### `channel_metrics_live` (NOVA - View Dinâmica)
- Calculada em tempo real da tabela `tips`
- Sempre atualizada
- Um registro por canal com todos os períodos
- Usa nomenclatura Green/Red ✅

## 🔍 Validação

### Página de Listagem (/canais)
- ✅ Usando `channel_metrics_live`
- ✅ Filtros funcionando (7d, 30d, 3m, etc)
- ✅ Métricas calculadas corretamente

### Página de Detalhes (/canais/[slug])
- ✅ Agora usando `channel_metrics_live`
- ✅ Mesmos valores da listagem
- ✅ Todos os períodos disponíveis

## 🗑️ Próximo Passo Recomendado

**Remover a tabela `channel_metrics`:**

```sql
-- Backup primeiro (opcional)
CREATE TABLE channel_metrics_backup AS SELECT * FROM channel_metrics;

-- Remover tabela redundante
DROP TABLE channel_metrics CASCADE;
```

## 📝 Resumo das Mudanças

1. **channel-details.ts**:
   - Remove `channel_metrics(*)` do select
   - Adiciona busca separada de `channel_metrics_live`
   - Transforma dados para formato esperado

2. **getChannelMetricsByPeriod**:
   - Busca de `channel_metrics_live` em vez de `channel_metrics`
   - Extrai período específico com switch/case

3. **Consistência**:
   - Ambas as páginas agora usam a mesma fonte de dados
   - Métricas sempre atualizadas e sincronizadas

## ✅ Status

**MIGRAÇÃO COMPLETA!**

- Todas as páginas usando métricas live
- Dados consistentes em todo o sistema
- Pronto para remover tabela antiga

---

**Data:** 05/01/2025
**Implementado por:** Claude + Análise do Cursor