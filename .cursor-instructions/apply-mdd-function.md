# Aplicar Função de MDD no Supabase

Execute estas queries no Supabase MCP para adicionar o cálculo correto de MDD:

## 1. Criar função calculate_channel_mdd

```sql
CREATE OR REPLACE FUNCTION calculate_channel_mdd(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  v_mdd NUMERIC := 0;
  v_peak NUMERIC := 0;
  v_current_balance NUMERIC := 0;
  v_drawdown NUMERIC;
  tip_record RECORD;
BEGIN
  -- Percorrer todas as tips ordenadas por data
  FOR tip_record IN 
    SELECT profit_loss 
    FROM tips 
    WHERE channel_id = p_channel_id
      AND event_date BETWEEN p_start_date AND p_end_date
      AND status IN ('won', 'lost')
    ORDER BY event_date, id
  LOOP
    -- Atualizar saldo atual
    v_current_balance := v_current_balance + tip_record.profit_loss;
    
    -- Atualizar pico se necessário
    IF v_current_balance > v_peak THEN
      v_peak := v_current_balance;
    END IF;
    
    -- Calcular drawdown atual
    v_drawdown := v_peak - v_current_balance;
    
    -- Atualizar MDD se necessário
    IF v_drawdown > v_mdd THEN
      v_mdd := v_drawdown;
    END IF;
  END LOOP;
  
  -- Retornar MDD como valor positivo (representa a maior queda)
  RETURN ROUND(v_mdd::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;
```

## 2. Recriar a view com MDD

```sql
DROP VIEW IF EXISTS channel_metrics_live;

CREATE VIEW channel_metrics_live AS
WITH time_windows AS (
  SELECT unnest(ARRAY['7d','30d','3m','6m','12m','all']) as time_window
)
SELECT 
  c.id as channel_id,
  tw.time_window,
  dr.start_date,
  dr.end_date,
  calculate_channel_roi(c.id, dr.start_date, dr.end_date) as roi,
  calculate_win_rate(c.id, dr.start_date, dr.end_date) as win_rate,
  calculate_profit_units(c.id, dr.start_date, dr.end_date) as profit_units,
  calculate_total_stakes(c.id, dr.start_date, dr.end_date) as total_stakes,
  calculate_avg_odds(c.id, dr.start_date, dr.end_date) as avg_odds,
  count_total_tips(c.id, dr.start_date, dr.end_date) as total_tips,
  calculate_channel_mdd(c.id, dr.start_date, dr.end_date) as mdd,
  NOW() as calculated_at
FROM channels c
CROSS JOIN time_windows tw
CROSS JOIN LATERAL get_date_range(tw.time_window) dr
WHERE c.is_active;
```

## 3. Testar o MDD

```sql
-- Verificar MDD calculado para canal 1
SELECT 
  channel_id,
  time_window,
  roi,
  profit_units,
  mdd,
  total_tips
FROM channel_metrics_live
WHERE channel_id = 1
ORDER BY time_window;
```

## Documentar Resultados

Salve em `.claude-instructions/mdd-results.md`:

```markdown
# Resultados MDD

## Canal 1 - Futebol Europeu Premium
- MDD 7d: [valor]
- MDD 30d: [valor]
- MDD all time: [valor]

## Validação
- [ ] MDD sempre positivo
- [ ] MDD realista (não é % do lucro)
- [ ] View funcionando
```

Use project_id: `ohnuaxnygsnkupmoimtq`