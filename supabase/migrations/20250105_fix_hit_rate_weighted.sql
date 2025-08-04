-- Corrigir cálculo de Hit Rate para usar média ponderada pelo stake
-- Hit Rate ponderado considera o peso de cada aposta (stake) ao invés de contar igualmente

DROP VIEW IF EXISTS channel_metrics_live CASCADE;

CREATE VIEW channel_metrics_live AS
SELECT 
  c.id AS channel_id,
  c.tipster_name AS tipster_id,
  
  -- Contagens gerais
  COUNT(t.id) AS total_tips,
  COUNT(t.id) FILTER (WHERE t.status IN ('green', 'half_green')) AS winning_tips,
  COUNT(t.id) FILTER (WHERE t.status IN ('red', 'half_red')) AS losing_tips,
  COUNT(t.id) FILTER (WHERE t.status = 'void') AS void_tips,
  COUNT(t.id) FILTER (WHERE t.status = 'cancelled') AS cancelled_tips,
  
  -- Informações do canal
  c.subscribers_count AS active_subscribers,
  
  -- ODDS MÉDIA PONDERADA
  COALESCE(
    ROUND(
      SUM(t.odds * t.stake) FILTER (WHERE t.status IN ('green', 'half_green', 'red', 'half_red')) / 
      NULLIF(SUM(t.stake) FILTER (WHERE t.status IN ('green', 'half_green', 'red', 'half_red')), 0),
      2
    ), 0
  ) AS avg_odd,
  
  CASE
    WHEN c.is_active THEN 'active'
    ELSE 'inactive'
  END AS status,
  MAX(t.event_date) AS last_tip_at,
  
  -- LUCRO por período
  COALESCE(
    SUM(t.profit_loss) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '7 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS profit_7d,
  
  COALESCE(
    SUM(t.profit_loss) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '30 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS profit_30d,
  
  COALESCE(
    SUM(t.profit_loss) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '365 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS profit_12m,
  
  COALESCE(
    SUM(t.profit_loss) FILTER (
      WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS profit_all_time,
  
  -- ROI por período
  ROUND(
    CASE 
      WHEN SUM(t.stake) FILTER (
        WHERE t.event_date >= CURRENT_DATE - INTERVAL '7 days'
        AND t.status IN ('green', 'half_green', 'red', 'half_red')
      ) > 0
      THEN (
        SUM(t.profit_loss) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '7 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        ) / 
        SUM(t.stake) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '7 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        )
      ) * 100
      ELSE 0
    END, 2
  ) AS roi_7d,
  
  ROUND(
    CASE 
      WHEN SUM(t.stake) FILTER (
        WHERE t.event_date >= CURRENT_DATE - INTERVAL '30 days'
        AND t.status IN ('green', 'half_green', 'red', 'half_red')
      ) > 0
      THEN (
        SUM(t.profit_loss) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '30 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        ) / 
        SUM(t.stake) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '30 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        )
      ) * 100
      ELSE 0
    END, 2
  ) AS roi_30d,
  
  ROUND(
    CASE 
      WHEN SUM(t.stake) FILTER (
        WHERE t.event_date >= CURRENT_DATE - INTERVAL '365 days'
        AND t.status IN ('green', 'half_green', 'red', 'half_red')
      ) > 0
      THEN (
        SUM(t.profit_loss) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '365 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        ) / 
        SUM(t.stake) FILTER (
          WHERE t.event_date >= CURRENT_DATE - INTERVAL '365 days'
          AND t.status IN ('green', 'half_green', 'red', 'half_red')
        )
      ) * 100
      ELSE 0
    END, 2
  ) AS roi_12m,
  
  ROUND(
    CASE 
      WHEN SUM(t.stake) FILTER (
        WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
      ) > 0
      THEN (
        SUM(t.profit_loss) FILTER (
          WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
        ) / 
        SUM(t.stake) FILTER (
          WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
        )
      ) * 100
      ELSE 0
    END, 2
  ) AS roi_all_time,
  
  -- VOLUME (stake total apostado)
  COALESCE(
    SUM(t.stake) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '7 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS volume_7d,
  
  COALESCE(
    SUM(t.stake) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '30 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS volume_30d,
  
  COALESCE(
    SUM(t.stake) FILTER (
      WHERE t.event_date >= CURRENT_DATE - INTERVAL '365 days'
      AND t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS volume_12m,
  
  COALESCE(
    SUM(t.stake) FILTER (
      WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
    ), 0
  ) AS volume_all_time,
  
  -- HIT RATE PONDERADO (corrigido)
  -- Fórmula: SUM(stake das vitórias) / SUM(stake total) * 100
  ROUND(
    SUM(t.stake) FILTER (
      WHERE t.status IN ('green', 'half_green')
      AND t.event_date >= CURRENT_DATE - INTERVAL '7 days'
    )::NUMERIC * 100.0 / 
    NULLIF(
      SUM(t.stake) FILTER (
        WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
        AND t.event_date >= CURRENT_DATE - INTERVAL '7 days'
      ), 0
    ), 2
  ) AS hit_rate_7d,
  
  ROUND(
    SUM(t.stake) FILTER (
      WHERE t.status IN ('green', 'half_green')
      AND t.event_date >= CURRENT_DATE - INTERVAL '30 days'
    )::NUMERIC * 100.0 / 
    NULLIF(
      SUM(t.stake) FILTER (
        WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
        AND t.event_date >= CURRENT_DATE - INTERVAL '30 days'
      ), 0
    ), 2
  ) AS hit_rate_30d,
  
  ROUND(
    SUM(t.stake) FILTER (
      WHERE t.status IN ('green', 'half_green')
      AND t.event_date >= CURRENT_DATE - INTERVAL '365 days'
    )::NUMERIC * 100.0 / 
    NULLIF(
      SUM(t.stake) FILTER (
        WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
        AND t.event_date >= CURRENT_DATE - INTERVAL '365 days'
      ), 0
    ), 2
  ) AS hit_rate_12m,
  
  ROUND(
    SUM(t.stake) FILTER (
      WHERE t.status IN ('green', 'half_green')
    )::NUMERIC * 100.0 / 
    NULLIF(
      SUM(t.stake) FILTER (
        WHERE t.status IN ('green', 'half_green', 'red', 'half_red')
      ), 0
    ), 2
  ) AS hit_rate_all_time,
  
  -- MDD (Maximum Drawdown)
  COALESCE(
    calculate_channel_mdd(
      c.id, 
      (CURRENT_DATE - INTERVAL '7 days')::TIMESTAMPTZ,
      CURRENT_DATE::TIMESTAMPTZ
    ), 0
  ) AS mdd_7d,
  
  COALESCE(
    calculate_channel_mdd(
      c.id,
      (CURRENT_DATE - INTERVAL '30 days')::TIMESTAMPTZ,
      CURRENT_DATE::TIMESTAMPTZ
    ), 0
  ) AS mdd_30d,
  
  COALESCE(
    calculate_channel_mdd(
      c.id,
      (CURRENT_DATE - INTERVAL '365 days')::TIMESTAMPTZ,
      CURRENT_DATE::TIMESTAMPTZ
    ), 0
  ) AS mdd_12m,
  
  COALESCE(
    calculate_channel_mdd(
      c.id,
      '1900-01-01'::TIMESTAMPTZ,
      CURRENT_DATE::TIMESTAMPTZ
    ), 0
  ) AS mdd_all_time

FROM channels c
LEFT JOIN tips t ON c.id = t.channel_id
GROUP BY c.id, c.tipster_name, c.is_active, c.subscribers_count;

-- Adicionar comentários explicativos
COMMENT ON VIEW channel_metrics_live IS 'View com métricas em tempo real. Usa médias ponderadas pelo stake para odds e hit rate.';
COMMENT ON COLUMN channel_metrics_live.avg_odd IS 'Média ponderada das odds. Fórmula: SUM(odds × stake) / SUM(stake)';
COMMENT ON COLUMN channel_metrics_live.hit_rate_30d IS 'Taxa de acerto ponderada. Fórmula: SUM(stake vitórias) / SUM(stake total) × 100';