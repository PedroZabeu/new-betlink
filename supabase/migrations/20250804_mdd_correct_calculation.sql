-- Função CORRETA para calcular o Maximum Drawdown (MDD)
-- MDD = maior diferença entre um pico e o vale subsequente

CREATE OR REPLACE FUNCTION calculate_channel_mdd(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  v_mdd NUMERIC := 0;
  v_peak NUMERIC := 0;
  v_running_balance NUMERIC := 0;
  v_current_dd NUMERIC;
  tip_record RECORD;
BEGIN
  -- Percorrer todas as tips ordenadas cronologicamente
  FOR tip_record IN 
    SELECT 
      event_date,
      profit_loss 
    FROM tips 
    WHERE channel_id = p_channel_id
      AND event_date BETWEEN p_start_date AND p_end_date
      AND status IN ('won', 'lost')
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
  -- Representa a maior queda (em unidades) desde um pico
  RETURN ROUND(v_mdd::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- Função auxiliar para debug: retorna histórico de drawdowns
CREATE OR REPLACE FUNCTION debug_channel_drawdowns(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS TABLE(
  event_date TIMESTAMPTZ,
  profit_loss NUMERIC,
  running_balance NUMERIC,
  peak NUMERIC,
  drawdown NUMERIC
) AS $$
DECLARE
  v_peak NUMERIC := 0;
  v_running_balance NUMERIC := 0;
BEGIN
  FOR event_date, profit_loss IN 
    SELECT t.event_date, t.profit_loss
    FROM tips t
    WHERE t.channel_id = p_channel_id
      AND t.event_date BETWEEN p_start_date AND p_end_date
      AND t.status IN ('won', 'lost')
    ORDER BY t.event_date, t.id
  LOOP
    -- Atualizar saldo
    v_running_balance := v_running_balance + profit_loss;
    
    -- Atualizar pico se necessário
    IF v_running_balance > v_peak THEN
      v_peak := v_running_balance;
    END IF;
    
    -- Retornar linha com cálculos
    running_balance := v_running_balance;
    peak := v_peak;
    drawdown := v_peak - v_running_balance;
    
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso para validação
-- SELECT * FROM debug_channel_drawdowns(1, NOW() - INTERVAL '30 days', NOW());

-- Teste com exemplo do usuário
-- Simulando: +5, -6 (chega a -1), +2 (chega a +1), -3 (chega a -2), +7.5 (chega a 5.5)
-- Pico em +5, vale em -2, DD = 7
-- Novo pico em 5.5

-- Criar dados de teste para validar
DO $$
DECLARE
  v_channel_id INTEGER := 999; -- Canal de teste
  v_base_date TIMESTAMPTZ := NOW() - INTERVAL '10 days';
BEGIN
  -- Limpar tips antigas de teste
  DELETE FROM tips WHERE channel_id = v_channel_id;
  
  -- Inserir sequência de teste
  INSERT INTO tips (channel_id, description, event_date, odds, stake, status, profit_loss) VALUES
    (v_channel_id, 'Test 1', v_base_date + INTERVAL '1 day', 2.0, 5, 'won', 5),      -- Saldo: +5 (pico)
    (v_channel_id, 'Test 2', v_base_date + INTERVAL '2 days', 2.0, 6, 'lost', -6),    -- Saldo: -1
    (v_channel_id, 'Test 3', v_base_date + INTERVAL '3 days', 2.0, 2, 'won', 2),      -- Saldo: +1
    (v_channel_id, 'Test 4', v_base_date + INTERVAL '4 days', 2.0, 3, 'lost', -3),    -- Saldo: -2 (vale)
    (v_channel_id, 'Test 5', v_base_date + INTERVAL '5 days', 2.5, 5, 'won', 7.5);    -- Saldo: +5.5 (novo pico)
  
  -- Verificar MDD (deve ser 7)
  RAISE NOTICE 'MDD Calculado: %', calculate_channel_mdd(v_channel_id, v_base_date, NOW());
  
  -- Limpar após teste
  DELETE FROM tips WHERE channel_id = v_channel_id;
END $$;