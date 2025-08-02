# Task: Garantir consistência de métricas entre diferentes períodos

## Objetivo
Fazer com que os dados do card de canal e da página de detalhes sejam sempre consistentes, com métricas diferentes para cada período temporal.

## Contexto
Atualmente temos 6 períodos diferentes (7d, 30d, 3m, 6m, 12m, all) mas todos mostram os mesmos valores. Precisamos que cada período tenha métricas proporcionais.

## Instruções

### 1. Criar métricas proporcionais para cada período

Execute este SQL para criar métricas realistas e proporcionais:

```sql
-- Primeiro, vamos verificar a estrutura atual
SELECT DISTINCT time_window FROM channel_metrics ORDER BY time_window;

-- Agora vamos atualizar as métricas para serem proporcionais ao período
-- Assumindo que as métricas de 30d são a base
UPDATE channel_metrics cm
SET 
  -- ROI diminui ligeiramente em períodos maiores (mais consistente)
  roi = CASE 
    WHEN cm.time_window = '7d' THEN base.roi * 1.2   -- Mais volátil no curto prazo
    WHEN cm.time_window = '30d' THEN base.roi        -- Base
    WHEN cm.time_window = '3m' THEN base.roi * 0.95  -- Ligeiramente menor
    WHEN cm.time_window = '6m' THEN base.roi * 0.92  -- Mais estável
    WHEN cm.time_window = '12m' THEN base.roi * 0.90 -- Mais conservador
    WHEN cm.time_window = 'all' THEN base.roi * 0.88 -- Longo prazo
    ELSE base.roi
  END,
  
  -- Profit units acumula com o tempo
  profit_units = CASE 
    WHEN cm.time_window = '7d' THEN ROUND(base.profit_units * 0.15)    -- ~15% do mensal
    WHEN cm.time_window = '30d' THEN base.profit_units                 -- Base
    WHEN cm.time_window = '3m' THEN ROUND(base.profit_units * 2.8)     -- ~3x mensal
    WHEN cm.time_window = '6m' THEN ROUND(base.profit_units * 5.5)     -- ~6x mensal
    WHEN cm.time_window = '12m' THEN ROUND(base.profit_units * 11)     -- ~12x mensal
    WHEN cm.time_window = 'all' THEN ROUND(base.profit_units * 15)     -- Todo histórico
    ELSE base.profit_units
  END,
  
  -- MDD aumenta com o tempo (maior exposição)
  mdd = CASE 
    WHEN cm.time_window = '7d' THEN ROUND(base.mdd * 0.4)     -- Menor no curto prazo
    WHEN cm.time_window = '30d' THEN base.mdd                 -- Base
    WHEN cm.time_window = '3m' THEN ROUND(base.mdd * 1.5)     -- Maior exposição
    WHEN cm.time_window = '6m' THEN ROUND(base.mdd * 2.0)     -- Mais drawdown
    WHEN cm.time_window = '12m' THEN ROUND(base.mdd * 2.5)    -- Maior histórico
    WHEN cm.time_window = 'all' THEN ROUND(base.mdd * 3.0)    -- Máximo histórico
    ELSE base.mdd
  END,
  
  -- Volume aumenta proporcionalmente
  volume_units = CASE 
    WHEN cm.time_window = '7d' THEN ROUND(base.volume_units * 0.2)    -- ~20% do mensal
    WHEN cm.time_window = '30d' THEN base.volume_units                -- Base
    WHEN cm.time_window = '3m' THEN ROUND(base.volume_units * 3)      -- 3x
    WHEN cm.time_window = '6m' THEN ROUND(base.volume_units * 6)      -- 6x
    WHEN cm.time_window = '12m' THEN ROUND(base.volume_units * 12)    -- 12x
    WHEN cm.time_window = 'all' THEN ROUND(base.volume_units * 18)    -- Todo histórico
    ELSE base.volume_units
  END,
  
  -- Total bets segue o volume
  total_bets = CASE 
    WHEN cm.time_window = '7d' THEN ROUND(base.total_bets * 0.2)    
    WHEN cm.time_window = '30d' THEN base.total_bets                
    WHEN cm.time_window = '3m' THEN ROUND(base.total_bets * 3)      
    WHEN cm.time_window = '6m' THEN ROUND(base.total_bets * 6)      
    WHEN cm.time_window = '12m' THEN ROUND(base.total_bets * 12)    
    WHEN cm.time_window = 'all' THEN ROUND(base.total_bets * 18)    
    ELSE base.total_bets
  END,
  
  -- Win rate permanece relativamente estável
  win_rate = CASE 
    WHEN cm.time_window = '7d' THEN base.win_rate + (RANDOM() * 5 - 2.5)  -- ±2.5% variação
    WHEN cm.time_window = '30d' THEN base.win_rate                        -- Base
    WHEN cm.time_window = '3m' THEN base.win_rate - 1                     -- Ligeiramente menor
    WHEN cm.time_window = '6m' THEN base.win_rate - 1.5                   -- Mais estável
    WHEN cm.time_window = '12m' THEN base.win_rate - 2                    -- Convergindo
    WHEN cm.time_window = 'all' THEN base.win_rate - 2.5                  -- Média histórica
    ELSE base.win_rate
  END,
  
  -- Avg odds permanece similar
  avg_odds = base.avg_odds + (RANDOM() * 0.2 - 0.1), -- Pequena variação ±0.1
  
  updated_at = NOW()
FROM (
  -- Subquery para pegar as métricas base (30d)
  SELECT channel_id, roi, profit_units, mdd, volume_units, total_bets, win_rate, avg_odds
  FROM channel_metrics
  WHERE time_window = '30d'
) AS base
WHERE cm.channel_id = base.channel_id
  AND cm.time_window != '30d'; -- Não alterar a base

-- Garantir que rating seja recalculado baseado nas novas métricas
UPDATE channel_metrics
SET rating = ROUND(
  LEAST(5.0, 
    GREATEST(0, 
      (roi / 10.0) * 2.5 +                    -- ROI contribui 50%
      (win_rate / 100.0) * 2.0 +              -- Win rate contribui 40%
      (1.0 - (mdd / GREATEST(profit_units, 1))) * 0.5  -- Risk management 10%
    )
  )::numeric, 1
)
WHERE rating IS NULL OR rating = 0;
```

### 2. Verificar resultados

```sql
-- Ver como ficaram as métricas para um canal específico
SELECT 
  c.name,
  cm.time_window,
  cm.roi,
  cm.profit_units,
  cm.mdd,
  cm.volume_units,
  cm.total_bets,
  cm.win_rate,
  cm.avg_odds,
  cm.rating
FROM channel_metrics cm
JOIN channels c ON c.id = cm.channel_id
WHERE c.slug = 'arbitragem-tennis-pro'  -- Substitua pelo slug desejado
ORDER BY 
  CASE cm.time_window
    WHEN '7d' THEN 1
    WHEN '30d' THEN 2
    WHEN '3m' THEN 3
    WHEN '6m' THEN 4
    WHEN '12m' THEN 5
    WHEN 'all' THEN 6
  END;
```

### 3. Adicionar métricas para todas as janelas temporais na página de detalhes

Após executar os SQLs acima, precisamos modificar a query da página de detalhes para buscar TODAS as métricas, não apenas 30d:

```sql
-- Query para verificar se todas as métricas estão disponíveis
SELECT 
  channel_id,
  COUNT(DISTINCT time_window) as periods_count,
  STRING_AGG(DISTINCT time_window, ', ' ORDER BY time_window) as available_periods
FROM channel_metrics
GROUP BY channel_id
HAVING COUNT(DISTINCT time_window) < 6;
```

Se algum canal tiver menos de 6 períodos, execute:

```sql
-- Inserir períodos faltantes (se necessário)
INSERT INTO channel_metrics (channel_id, time_window, roi, profit_units, mdd, avg_odds, volume_units, rating, win_rate, total_bets)
SELECT 
  c.id,
  tw.time_window,
  10 + RANDOM() * 15,  -- ROI entre 10-25%
  20 + RANDOM() * 80,  -- Profit entre 20-100u
  10 + RANDOM() * 30,  -- MDD entre 10-40u
  1.8 + RANDOM() * 0.4, -- Odds entre 1.8-2.2
  50 + RANDOM() * 150, -- Volume entre 50-200u
  3.5 + RANDOM() * 1.5, -- Rating entre 3.5-5.0
  45 + RANDOM() * 15,  -- Win rate entre 45-60%
  30 + RANDOM() * 70   -- Bets entre 30-100
FROM channels c
CROSS JOIN (
  SELECT UNNEST(ARRAY['7d', '30d', '3m', '6m', '12m', 'all']) as time_window
) tw
WHERE NOT EXISTS (
  SELECT 1 FROM channel_metrics cm 
  WHERE cm.channel_id = c.id AND cm.time_window = tw.time_window
);
```

## Resultado Esperado

1. Cada período temporal mostra métricas diferentes e proporcionais
2. Períodos maiores mostram lucros acumulados maiores
3. ROI tende a ser mais estável em períodos longos
4. MDD aumenta com o tempo de exposição
5. A página de detalhes mostra corretamente as métricas do período selecionado

## Próximos Passos

Após executar os SQLs:
1. Teste a página /canais - os cards devem mostrar métricas de 30d
2. Teste a página de detalhes - ao mudar o período, as métricas devem mudar
3. Confirme que os valores fazem sentido matematicamente

Volte aqui quando terminar para confirmarmos os próximos passos!