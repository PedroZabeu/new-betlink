# Sistema de Status de Apostas - Green/Red

## Visão Geral
Sistema completo de nomenclatura e cálculo para apostas esportivas, suportando casos excepcionais como Half Green/Red, Void e Cancelled.

## Status Disponíveis

### 1. **Green** (Vitória Completa)
- **Descrição**: Aposta vencedora completa
- **Cálculo**: `profit_loss = stake × (odds - 1)`
- **Exemplo**: Stake 10u, Odds 2.00 → Lucro +10u

### 2. **Half Green** (Vitória Parcial)
- **Descrição**: Asian Handicap ou apostas parcialmente vencedoras
- **Cálculo**: `profit_loss = (stake × partial_percentage/100) × (odds - 1)`
- **Exemplo**: Stake 10u, Odds 2.00, 50% green → Lucro +5u
- **Uso comum**: AH -0.25, vitória por 1 gol

### 3. **Red** (Derrota Completa)
- **Descrição**: Aposta perdida
- **Cálculo**: `profit_loss = -stake`
- **Exemplo**: Stake 10u → Prejuízo -10u

### 4. **Half Red** (Derrota Parcial)
- **Descrição**: Parte do stake é perdida
- **Cálculo**: `profit_loss = -(stake × partial_percentage/100)`
- **Exemplo**: Stake 10u, 50% red → Prejuízo -5u
- **Uso comum**: AH +0.25, derrota por 1 gol

### 5. **Void** (Anulada)
- **Descrição**: Aposta anulada pelo bookmaker
- **Cálculo**: `profit_loss = 0`
- **Exemplo**: Jogo cancelado, jogador não participou
- **Diferença**: Decisão do bookmaker

### 6. **Cancelled** (Cancelada)
- **Descrição**: Aposta cancelada pelo tipster
- **Cálculo**: `profit_loss = 0`
- **Exemplo**: Tip cancelada por lesão de última hora
- **Diferença**: Decisão do tipster

### 7. **Pending** (Pendente)
- **Descrição**: Aguardando resultado
- **Cálculo**: `profit_loss = NULL`
- **Não entra** em cálculos de métricas

## Estrutura do Banco de Dados

### Tabela `tips`
```sql
CREATE TABLE tips (
  id UUID PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id),
  description TEXT,
  event_date TIMESTAMPTZ,
  odds DECIMAL(5,2),
  stake DECIMAL(10,2),
  status tip_status, -- ENUM type
  partial_percentage DECIMAL(5,2) DEFAULT 100,
  profit_loss DECIMAL(10,2), -- Calculado automaticamente
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trigger Automático
O sistema calcula `profit_loss` automaticamente através de trigger quando `status`, `odds`, `stake` ou `partial_percentage` são alterados.

## Cálculo de Métricas

### ROI (Return on Investment)
```sql
ROI = (SUM(profit_loss) / SUM(stake)) × 100
```
- Considera apenas status: green, half_green, red, half_red
- Ignora: void, cancelled, pending

### Hit Rate (Taxa de Acerto)
```sql
Hit Rate = (COUNT(green + half_green) / COUNT(green + half_green + red + half_red)) × 100
```

### Volume (Unidades Apostadas)
```sql
Volume = SUM(stake) WHERE status IN (green, half_green, red, half_red)
```

### MDD (Maximum Drawdown)
Calculado pela função `calculate_channel_mdd()` considerando sequência temporal de profit_loss.

## Exemplos Práticos

### Caso 1: Múltipla com Void Parcial
- **Situação**: Tripla com odds 8.00, uma seleção anulada
- **Tratamento**: 
  1. Recalcular odds sem a seleção void (ex: 8.00 → 4.00)
  2. Aplicar resultado com nova odd
  3. Status final: green/red baseado no resultado

### Caso 2: Asian Handicap -0.5
- **Vitória por 2+ gols**: status = 'green', partial = 100%
- **Vitória por 1 gol**: status = 'green', partial = 100%
- **Empate ou derrota**: status = 'red', partial = 100%

### Caso 3: Asian Handicap -0.25
- **Vitória por 2+ gols**: status = 'green', partial = 100%
- **Vitória por 1 gol**: status = 'half_green', partial = 50%
- **Empate ou derrota**: status = 'red', partial = 100%

## Migração de Dados Antigos

### Mapeamento
- `won` → `green`
- `lost` → `red`
- `void` → `void`
- `partial` → `half_green` (50%)
- `pending` → `pending`

## TypeScript Types

```typescript
export type TipStatus = 
  | 'pending'
  | 'green'
  | 'half_green'
  | 'void'
  | 'cancelled'
  | 'red'
  | 'half_red';

export interface Tip {
  id: string;
  status: TipStatus;
  stake: number;
  odds: number;
  partialPercentage?: number; // Default: 100
  profitLoss: number; // Auto-calculated
}
```

## UI/UX Guidelines

### Cores Recomendadas
- **Green**: `bg-green-100 text-green-700`
- **Half Green**: `bg-emerald-100 text-emerald-700`
- **Red**: `bg-red-100 text-red-700`
- **Half Red**: `bg-rose-100 text-rose-700`
- **Void**: `bg-slate-100 text-slate-700`
- **Cancelled**: `bg-orange-100 text-orange-700`
- **Pending**: `bg-gray-100 text-gray-700`

### Labels em Português
- Manter termos "Green" e "Red" (universais no mercado)
- Void → "Anulada"
- Cancelled → "Cancelada"
- Pending → "Pendente"

## Performance

### Índices Criados
- `idx_tips_status` - Para filtros por status
- `idx_tips_partial` - Para tips com partial_percentage != 100
- `idx_tips_channel_date` - Para queries por canal e período

### View Otimizada
`channel_metrics_live` usa agregações com FILTER para melhor performance em vez de subqueries.

## Validação e Testes

### Testes Realizados ✅
1. Migração de dados antigos
2. Cálculo automático via trigger
3. Todos os tipos de status
4. Partial percentage (25%, 50%, 75%)
5. View de métricas
6. Função MDD

### Resultados dos Testes
| Status | Stake | Odds | Partial | Profit/Loss | ✅ |
|--------|-------|------|---------|-------------|---|
| green | 5 | 1.85 | 100% | +4.25 | ✅ |
| half_green | 4 | 2.10 | 50% | +2.20 | ✅ |
| red | 3 | 1.75 | 100% | -3.00 | ✅ |
| half_red | 6 | 1.95 | 50% | -3.00 | ✅ |
| void | 2 | 2.20 | 100% | 0.00 | ✅ |
| cancelled | 3 | 1.90 | 100% | 0.00 | ✅ |

## Próximos Passos

1. **UI para Tipsters**: Interface para inserir tips com novos status
2. **Relatórios**: Separar void/cancelled nas estatísticas
3. **API**: Endpoints para atualizar status de tips
4. **Notificações**: Alertar usuários sobre void/cancelled

---

**Última atualização**: 05/01/2025
**Status**: ✅ Implementado e Testado