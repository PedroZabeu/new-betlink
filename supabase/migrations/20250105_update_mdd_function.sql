-- Atualizar função MDD para usar nova nomenclatura

CREATE OR REPLACE FUNCTION calculate_channel_mdd(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  v_mdd NUMERIC := 0;
  v_peak NUMERIC := 0;
  v_running_balance NUMERIC := 0;
  v_current_dd NUMERIC := 0;
  tip_record RECORD;
BEGIN
  -- Validar parâmetros
  IF p_channel_id IS NULL OR p_start_date IS NULL OR p_end_date IS NULL THEN
    RETURN 0;
  END IF;

  -- Percorrer todas as tips ordenadas por data
  FOR tip_record IN 
    SELECT 
      event_date,
      profit_loss 
    FROM tips 
    WHERE channel_id = p_channel_id
      AND event_date BETWEEN p_start_date AND p_end_date
      AND status IN ('green', 'half_green', 'red', 'half_red')  -- Nova nomenclatura
    ORDER BY event_date, id
  LOOP
    -- Atualizar saldo acumulado
    v_running_balance := v_running_balance + tip_record.profit_loss;
    
    -- Se encontramos um novo pico, atualizar
    IF v_running_balance > v_peak THEN
      v_peak := v_running_balance;
    END IF;
    
    -- Calcular drawdown atual (diferença do pico até o valor atual)
    v_current_dd := v_peak - v_running_balance;
    
    -- Se este drawdown é maior que o MDD registrado, atualizar
    IF v_current_dd > v_mdd THEN
      v_mdd := v_current_dd;
    END IF;
  END LOOP;
  
  -- Retornar MDD como valor positivo
  RETURN ABS(v_mdd);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_channel_mdd IS 'Calcula o Maximum Drawdown de um canal em um período, considerando nova nomenclatura Green/Red';