# 🚨 Handover CRÍTICO: Feature 2.19 → 2.20 (LEIA TUDO!)

## 📅 Informações do Handover
- **Data**: 05/08/2025
- **Feature Concluída**: 2.19 - Gráfico de Performance 
- **Próxima Feature**: 2.20 - Histórico de Tips (SEGURANÇA CRÍTICA!)
- **Tempo Total 2.19**: 10h (economia de 1.5h)
- **Complexidade 2.20**: ALTA - Proteção do modelo de negócio

## 🔴 ERROS FATAIS DA 2.19 - NÃO REPETIR!

### 1. ❌ Inconsistência entre Listagem e Detalhes
**O que aconteceu**: 
```
Canal: Soccer Chasing System
Listagem: ROI +48.09%, Lucro +123.6u (ERRADO - view SQL antiga)
Detalhes: ROI +60.45%, Lucro +61.66u (CERTO - hook novo)
```

**POR QUÊ**: Criamos novo sistema mas NÃO migramos a listagem!

**LIÇÃO PARA 2.20**: 
- Se criar novo sistema de tips, migre TODOS os lugares
- Teste listagem E detalhes
- Não deixe partes usando código antigo

### 2. ❌ Múltiplas Queries Desnecessárias
**O que fizemos errado**:
```typescript
// Component A
const { data } = useQuery(['tips']);

// Component B (mesma página!)
const { data } = useQuery(['tips']); // Query REPETIDA!
```

**SOLUÇÃO PARA 2.20**:
```typescript
// Um hook, múltiplos componentes
const { data } = useResolvedTipsHistory(channelId, filters);
// React Query compartilha o cache automaticamente!
```

### 3. ❌ Nomenclatura Desatualizada
**Problema**: Código esperava `win/loss`, banco usa `green/red`

**SEMPRE USE**:
- ✅ `green`, `half_green`, `red`, `half_red`, `void`, `cancelled`
- ❌ NUNCA `win`, `loss`

### 4. ❌ Debug Components Esquecidos
**Criamos**: `/app/test-chart`, `/app/test-query`
**Problema**: Deixamos no código, faziam queries extras

**REGRA**: Remova TODOS os componentes de debug antes do commit!

## 🎁 O QUE VOCÊ GANHA DA 2.19 (REUTILIZE!)

### 1. Hook Padrão ✅
```typescript
// Copie este padrão para criar useResolvedTipsHistory
import { useQuery } from '@tanstack/react-query';

export function useResolvedTipsHistory(channelId: number, filters: any) {
  return useQuery({
    queryKey: ['resolved-tips', channelId, filters],
    queryFn: async () => {
      // SUA QUERY AQUI - COM WHERE SEGURO!
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
```

### 2. Period Helpers ✅
```typescript
import { getStartDateForPeriod, getPeriodLabel } from '@/lib/utils/metrics-calculator';

// Já calcula datas para: 7d, 30d, 3m, 6m, ytd, 12m, all
const startDate = getStartDateForPeriod('30d');
```

### 3. Period Selector ✅
```typescript
import { PeriodSelector } from '@/components/features/channels/period-selector';

// Adapte para filtrar histórico
<PeriodSelector value={period} onChange={setPeriod} />
```

### 4. Tipos Corretos ✅
```typescript
import { Tip, TipStatus } from '@/lib/types/tip';
// TipStatus = 'pending' | 'green' | 'half_green' | 'red' | 'half_red' | 'void' | 'cancelled'
```

## 🔒 SEGURANÇA DA 2.20 - PRIORIDADE MÁXIMA!

### REGRAS INVIOLÁVEIS:
```sql
-- SEMPRE no backend (NUNCA confie só no frontend)
WHERE status != 'pending'
  AND status IN ('green', 'half_green', 'red', 'half_red', 'void', 'cancelled')
  AND event_date < NOW() - INTERVAL '3 hours'
```

### NUNCA FAÇA:
- ❌ Mostrar tips com status 'pending'
- ❌ Mostrar tips futuras  
- ❌ Mostrar tips < 3 horas
- ❌ Incluir 'pending' nos filtros
- ❌ Confiar apenas no frontend

### SEMPRE FAÇA:
- ✅ WHERE obrigatório no backend
- ✅ RLS policies como segunda camada
- ✅ Validação no frontend como terceira
- ✅ Truncar descrições recentes
- ✅ Testar como não-assinante

## 🛡️ O QUE NÃO PODE MEXER

### 1. useUnifiedChannelMetrics 🚫
- NÃO modifique as fórmulas
- NÃO mude o retorno
- PODE usar como referência

### 2. Tabela tips 🚫
- NÃO altere estrutura
- NÃO mude trigger
- PODE adicionar índices
- PODE criar functions

### 3. QueryProvider 🚫
- NÃO remova de layout.tsx
- NÃO mude configurações
- Já está funcionando!

## ⚠️ O QUE PODE MEXER COM CUIDADO

### 1. MetricsCard ⚠️
- Outros lugares usam
- Pode adicionar items
- NÃO mude props

### 2. PeriodSelector ⚠️
- Pode customizar períodos
- Pode mudar visual
- MANTENHA onChange

## 📋 CHECKLIST PARA COMEÇAR 2.20

### 1. Estude os Erros (30min)
- [ ] Leia TODO este handover
- [ ] Entenda a inconsistência da listagem
- [ ] Veja `/docs/features/handover/feature-2.19-debug-handover.md`

### 2. Teste o Sistema Atual (15min)
```bash
npm run dev
# Acesse http://localhost:3000/canais/1
# Verifique: gráfico aparece? períodos funcionam?
```

### 3. Planeje Segurança PRIMEIRO (45min)
- [ ] Escreva testes de segurança
- [ ] Liste todas as proteções necessárias
- [ ] Defina queries seguras

### 4. Implemente em Camadas
```
1. Mock SEGURO (sem pending)
   ↓
2. DataTable com filtros (sem opção pending)
   ↓
3. Backend com WHERE obrigatório
   ↓
4. RLS policies
   ↓
5. Testes como não-assinante
```

## 🎯 DEFINIÇÃO DE SUCESSO PARA 2.20

### Segurança ✅
- [ ] ZERO tips pendentes expostas
- [ ] 100% tips com 3+ horas delay
- [ ] Descrições truncadas < 7 dias
- [ ] Testes passando como não-assinante

### Consistência ✅
- [ ] Mesmos dados em TODAS as páginas
- [ ] Sem queries duplicadas
- [ ] Cache funcionando

### Performance ✅
- [ ] Query < 50ms
- [ ] Render < 100ms
- [ ] Export < 500ms

## 📁 ARQUIVOS ESSENCIAIS

### Para Estudar:
```
/lib/types/tip.ts                           # Tipos corretos
/lib/hooks/useUnifiedChannelMetrics.ts      # Padrão de hook
/lib/utils/metrics-calculator.ts            # Funções úteis
/guides/metrics-system-architecture.md      # Como funciona
```

### Para Referência:
```
/components/features/channels/performance-chart.tsx   # UI complexa
/components/features/channels/period-selector.tsx     # Filtros
/docs/features/planning/feature-2.20-tips-history.md  # Planning
```

### Problemas Conhecidos:
```
/docs/features/handover/feature-2.19-debug-handover.md
```

## 💡 DICAS FINAIS

### 1. Aprenda com 2.19
- Falhou na consistência por não migrar tudo
- Você pode falhar na segurança se não filtrar

### 2. Use o que Existe
- React Query configurado
- Tipos TypeScript prontos
- Period selector adaptável

### 3. Segurança em Camadas
```
Backend → RLS → Frontend → UI
  ↓        ↓       ↓       ↓
WHERE   Policy  Validate  Lock
```

### 4. Teste, Teste, Teste
- Como não-assinante
- Com dados reais
- Export CSV
- Performance

## 🚀 RESUMO EXECUTIVO

**2.19 entregou**: Sistema de métricas unificado funcionando

**2.19 falhou**: Listagem ainda usa sistema antigo

**2.20 crítico**: NUNCA expor tips pendentes

**Maior risco**: Vazar dados = modelo de negócio morre

**Sua missão**: Implementar com MÁXIMA segurança

---

*Feature 2.19: ✅ Completa (com issue conhecida)*  
*Feature 2.20: 🔴 CRÍTICA - Segurança é prioridade!*

**BOA SORTE! E lembre-se: "No pending tips for non-subscribers!"**