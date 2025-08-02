# Fase 4 - Etapa 4.2: Dados Dinâmicos - Plano Detalhado

## 📋 Visão Geral da Etapa

**Objetivo**: Implementar cálculos e métricas em tempo real, substituindo todos os valores estáticos por dados dinâmicos do Supabase.

**Duração Estimada**: 8-10 horas
**Features**: 4 (2.17, 2.18, 2.19, 2.20)
**Complexidade**: Média-Alta

## 🎯 Objetivos Específicos

1. **Limpar Tech Debt**: Resolver pendências da Feature 2.15
2. **Métricas Reais**: Sistema completo de cálculo de métricas
3. **Ocupação Dinâmica**: Calcular vagas baseado em assinantes reais
4. **Histórico Completo**: Timeline de tips com resultados

## 📊 Features Detalhadas

### Feature 2.17: Resolver Tech Debt da Feature 2.15
**Complexidade**: 🟢 Baixa (1-2 horas)
**Prioridade**: Alta - Bloqueadora

#### Objetivos:
1. Remover todos console.logs de debug
2. Adicionar React keys faltantes
3. Calcular valores esperados dinamicamente
4. Implementar logger estruturado
5. Refatorar componentes para manutenibilidade

#### Tarefas Técnicas:
```typescript
// 1. Remover console.logs em:
- /app/dev/data-migration/page.tsx
- /lib/mock-data/channels.ts
- /components/dev/data-comparison-table.tsx

// 2. Adicionar keys em loops:
- DataComparisonTable rows
- ComparisonStats items
- Nested arrays em channel_tags

// 3. Calcular expected values:
const expectedValues = {
  channels: mockChannels.length,
  channel_tags: mockChannels.reduce((acc, ch) => acc + ch.tags.length, 0),
  channel_metrics: mockChannels.length * 4, // períodos
  subscription_plans: calculateExpectedPlans(mockChannels)
};

// 4. Implementar logger:
import { logger } from '@/lib/utils/logger';
logger.info('Data migration started', { feature: 'etapa-4.2' });
```

#### Arquivos a Modificar:
- `/app/dev/data-migration/page.tsx`
- `/components/dev/data-comparison-table.tsx`
- `/lib/mock-data/channels.ts`
- `/lib/utils/logger.ts` (verificar se existe)

#### Teste Visual:
- Zero warnings no console
- Performance melhorada
- Código mais limpo e manutenível

---

### Feature 2.18: Sistema de Métricas Real
**Complexidade**: 🟡 Média (2-3 horas)
**Dependências**: Feature 2.17

#### Objetivos:
1. Criar funções SQL para calcular métricas
2. Implementar triggers para atualização automática
3. Views materializadas para performance
4. Dashboard visual mostrando cálculos

#### Schema Necessário:
```sql
-- Function para calcular ROI
CREATE OR REPLACE FUNCTION calculate_channel_roi(
  channel_id UUID,
  period_days INTEGER DEFAULT NULL
) RETURNS NUMERIC AS $$
BEGIN
  -- Lógica de cálculo baseada em tips
  RETURN COALESCE(
    (SELECT SUM(profit) / NULLIF(SUM(stake), 0) * 100
     FROM tips
     WHERE channel_id = $1
     AND ($2 IS NULL OR created_at > NOW() - INTERVAL '$2 days')),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- View materializada para métricas
CREATE MATERIALIZED VIEW channel_metrics_realtime AS
SELECT 
  channel_id,
  calculate_channel_roi(channel_id, 7) as roi_7d,
  calculate_channel_roi(channel_id, 30) as roi_30d,
  calculate_channel_roi(channel_id, 180) as roi_6m,
  calculate_channel_roi(channel_id) as roi_total,
  -- Outras métricas...
FROM channels;

-- Trigger para refresh automático
CREATE OR REPLACE FUNCTION refresh_metrics() RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY channel_metrics_realtime;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Página Visual:
- **Rota**: `/dev/metrics-calculator`
- **Componentes**:
  - MetricsCalculator: Mostra cálculos em tempo real
  - MetricsComparison: Compara mock vs calculado
  - RefreshButton: Força recálculo manual

#### Teste Visual:
- Página mostrando fórmulas e resultados
- Botão para adicionar tip fake e ver mudança
- Comparação antes/depois do cálculo

---

### Feature 2.19: Ocupação e Waitlist Dinâmicos
**Complexidade**: 🟡 Média (2-3 horas)
**Dependências**: Feature 2.18

#### Objetivos:
1. Calcular ocupação real baseada em assinantes
2. Sistema de waitlist funcional
3. Badges dinâmicos na listagem
4. Página de gestão de waitlist

#### Schema Necessário:
```sql
-- Tabela de assinantes
CREATE TABLE IF NOT EXISTS channel_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de waitlist
CREATE TABLE IF NOT EXISTS channel_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  user_id UUID REFERENCES auth.users(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View para ocupação
CREATE VIEW channel_occupancy AS
SELECT 
  c.id,
  c.max_subscribers,
  COUNT(DISTINCT cs.user_id) as current_subscribers,
  c.max_subscribers - COUNT(DISTINCT cs.user_id) as available_spots,
  CASE 
    WHEN COUNT(DISTINCT cs.user_id) >= c.max_subscribers THEN true
    ELSE false
  END as is_full
FROM channels c
LEFT JOIN channel_subscribers cs ON c.id = cs.channel_id AND cs.status = 'active'
GROUP BY c.id, c.max_subscribers;
```

#### Componentes Visuais:
1. **Badge de Ocupação**:
   - "12/50 vagas" (verde)
   - "48/50 vagas" (amarelo)
   - "LOTADO" (vermelho)
   - "3 na fila" (quando lotado)

2. **Página Waitlist** (`/dev/waitlist-manager`):
   - Lista de canais com filas
   - Simulador de entrada/saída
   - Notificações mockadas

#### Teste Visual:
- Badges atualizando em tempo real
- Adicionar/remover assinante e ver mudança
- Sistema de fila funcionando

---

### Feature 2.20: Histórico de Tips
**Complexidade**: 🟢 Baixa-Média (2-3 horas)
**Dependências**: Feature 2.19

#### Objetivos:
1. Criar tabela de tips completa
2. Popular com dados históricos realistas
3. Timeline visual na página de detalhes
4. Cálculos de lucro/prejuízo

#### Schema Necessário:
```sql
-- Tabela de tips
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  tipster_id UUID REFERENCES profiles(id),
  
  -- Dados da aposta
  match TEXT NOT NULL,
  league TEXT NOT NULL,
  pick TEXT NOT NULL,
  odd DECIMAL(10,2) NOT NULL,
  stake INTEGER DEFAULT 10,
  
  -- Resultado
  status TEXT CHECK (status IN ('pending', 'won', 'lost', 'void', 'half_won', 'half_lost')),
  profit DECIMAL(10,2),
  
  -- Timestamps
  match_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_tips_channel_date ON tips(channel_id, match_date DESC);
CREATE INDEX idx_tips_status ON tips(status) WHERE status = 'pending';
```

#### Componentes Visuais:
1. **TipsTimeline**:
   - Lista vertical com datas
   - Cores por resultado (verde/vermelho)
   - Expandir para ver detalhes
   - Filtros por período

2. **TipCard**:
   ```tsx
   <div className="tip-card">
     <div className="match-info">
       <span className="date">02/02 19:00</span>
       <span className="league">Premier League</span>
     </div>
     <div className="pick-info">
       <span className="match">Arsenal vs Chelsea</span>
       <span className="pick">Over 2.5 Gols</span>
     </div>
     <div className="result">
       <Badge variant={status === 'won' ? 'success' : 'destructive'}>
         {status === 'won' ? `+${profit}u` : `${profit}u`}
       </Badge>
     </div>
   </div>
   ```

3. **Integração na Página de Detalhes**:
   - Nova aba "Histórico"
   - Mostrar últimas 20 tips
   - Botão "Carregar mais"
   - Estatísticas resumidas no topo

#### Dados de Teste:
- 50-100 tips por canal
- Distribuição realista de resultados
- Variação de odds e stakes
- Diferentes ligas e mercados

#### Teste Visual:
- Timeline carregando corretamente
- Cálculos de lucro precisos
- Filtros funcionando
- Performance com muitas tips

## 🔄 Fluxo de Desenvolvimento

1. **Feature 2.17** (Tech Debt) → Base limpa
2. **Feature 2.18** (Métricas) → Cálculos funcionando
3. **Feature 2.19** (Ocupação) → Dados dinâmicos
4. **Feature 2.20** (Tips) → Histórico completo

## 📋 Checklist de Conclusão

### Feature 2.17:
- [ ] Zero console.logs no código
- [ ] Todas as keys adicionadas
- [ ] Valores esperados calculados
- [ ] Logger implementado
- [ ] Código refatorado

### Feature 2.18:
- [ ] Functions SQL criadas
- [ ] Views materializadas funcionando
- [ ] Página /dev/metrics-calculator
- [ ] Cálculos em tempo real
- [ ] Testes de atualização

### Feature 2.19:
- [ ] Tabelas de subscribers/waitlist
- [ ] Views de ocupação
- [ ] Badges dinâmicos
- [ ] Página waitlist manager
- [ ] Simulador funcionando

### Feature 2.20:
- [ ] Tabela tips criada
- [ ] Dados históricos populados
- [ ] Timeline implementada
- [ ] Integração na página detalhes
- [ ] Cálculos de P&L corretos

## ⚠️ Pontos de Atenção

1. **Performance**: Views materializadas para queries pesadas
2. **Consistência**: Triggers para manter dados sincronizados
3. **UX**: Loading states durante cálculos
4. **Dados**: Gerar histórico realista e consistente
5. **Testes**: Validar todos os cálculos matemáticos

## 🎯 Critério de Sucesso

- Todos os dados mockados substituídos por cálculos reais
- Performance mantida (queries < 100ms)
- Zero erros no console
- Dados atualizando em tempo real
- Usuário percebe a diferença (badge "Live Data")