-- Função para calcular o Maximum Drawdown (MDD) real baseado no histórico
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
      AND status IN ('win', 'loss')
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

-- Adicionar MDD à view materializada
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