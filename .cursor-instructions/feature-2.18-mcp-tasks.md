# Feature 2.18: Tarefas MCP para Cursor Executar

## 🎯 Objetivo
Executar operações no Supabase via MCP para criar o sistema de métricas dinâmicas, já que Claude não tem permissões diretas.

## ⚠️ IMPORTANTE
- Execute cada tarefa em sequência
- Documente TODOS os resultados em `.claude-instructions/feature-2.18-results.md`
- Se houver erro, copie a mensagem completa
- Use o project_id: `bqfqrzllxmzpgtowahja`

## 📋 TAREFA 1: Criar Tabela Tips e RLS

### 1.1 Criar a tabela tips
Execute via MCP Supabase:

```sql
-- Feature 2.18: Criar tabela tips para métricas dinâmicas

-- Criar tabela tips
CREATE TABLE IF NOT EXISTS tips (
  -- Sistema
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Do Tipster (o que ele envia)
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  odds DECIMAL(5,2) NOT NULL CHECK (odds > 1),
  stake DECIMAL(10,2) NOT NULL CHECK (stake > 0),
  
  -- Resultado (atualizado depois)
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'win', 'loss', 'void')),
  profit_loss DECIMAL(10,2)
);

-- Criar índices para performance
CREATE INDEX idx_tips_channel_date ON tips(channel_id, event_date DESC);
CREATE INDEX idx_tips_status ON tips(status);
CREATE INDEX idx_tips_created ON tips(created_at DESC);
```

**Comando MCP**: `mcp__supabase__execute_sql`

### 1.2 Aplicar RLS Policies
Execute cada policy separadamente:

```sql
-- Policy 1: Enable RLS
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
```

```sql
-- Policy 2: SELECT público
CREATE POLICY "Tips são públicas para canais ativos" ON tips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channels c 
      WHERE c.id = tips.channel_id 
      AND c.status = 'active'
    )
  );
```

```sql
-- Policy 3: INSERT tipsters
CREATE POLICY "Tipsters podem inserir tips em seus canais" ON tips
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  );
```

```sql
-- Policy 4: UPDATE tipsters
CREATE POLICY "Tipsters podem atualizar suas tips" ON tips
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  );
```

### 1.3 Verificar tabela criada
```sql
SELECT 
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'tips' 
GROUP BY table_name;
```

**Documentar**: ✅ ou ❌ para cada etapa

## 📋 TAREFA 2: Criar Functions SQL de Cálculo

### 2.1 Function para converter time windows
```sql
CREATE OR REPLACE FUNCTION get_date_range(time_window TEXT)
RETURNS TABLE(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE time_window
      WHEN '7d' THEN NOW() - INTERVAL '7 days'
      WHEN '30d' THEN NOW() - INTERVAL '30 days'
      WHEN '3m' THEN NOW() - INTERVAL '3 months'
      WHEN '6m' THEN NOW() - INTERVAL '6 months'
      WHEN '12m' THEN NOW() - INTERVAL '12 months'
      WHEN 'ytd' THEN date_trunc('year', NOW())
      WHEN 'all' THEN TIMESTAMPTZ '2020-01-01'
      ELSE NOW() - INTERVAL '30 days'
    END as start_date,
    NOW() as end_date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 2.2 Function calculate_channel_roi
```sql
CREATE OR REPLACE FUNCTION calculate_channel_roi(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  v_total_stake NUMERIC;
  v_total_profit NUMERIC;
BEGIN
  SELECT 
    COALESCE(SUM(stake), 0),
    COALESCE(SUM(profit_loss), 0)
  INTO v_total_stake, v_total_profit
  FROM tips
  WHERE channel_id = p_channel_id
    AND event_date BETWEEN p_start_date AND p_end_date
    AND status IN ('win', 'loss');
  
  IF v_total_stake = 0 THEN RETURN 0; END IF;
  
  RETURN ROUND((v_total_profit / v_total_stake) * 100, 2);
END;
$$ LANGUAGE plpgsql;
```

### 2.3 Function calculate_win_rate
```sql
CREATE OR REPLACE FUNCTION calculate_win_rate(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  v_wins INTEGER;
  v_total INTEGER;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE status = 'win'),
    COUNT(*) FILTER (WHERE status IN ('win', 'loss'))
  INTO v_wins, v_total
  FROM tips
  WHERE channel_id = p_channel_id
    AND event_date BETWEEN p_start_date AND p_end_date;
  
  IF v_total = 0 THEN RETURN 0; END IF;
  
  RETURN ROUND((v_wins::NUMERIC / v_total) * 100, 1);
END;
$$ LANGUAGE plpgsql;
```

### 2.4 Functions auxiliares
```sql
-- Profit Units
CREATE OR REPLACE FUNCTION calculate_profit_units(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(profit_loss) 
     FROM tips 
     WHERE channel_id = p_channel_id
       AND event_date BETWEEN p_start_date AND p_end_date
       AND status IN ('win', 'loss')),
    0
  );
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Total Stakes
CREATE OR REPLACE FUNCTION calculate_total_stakes(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(stake) 
     FROM tips 
     WHERE channel_id = p_channel_id
       AND event_date BETWEEN p_start_date AND p_end_date
       AND status IN ('win', 'loss')),
    0
  );
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Average Odds
CREATE OR REPLACE FUNCTION calculate_avg_odds(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (SELECT ROUND(AVG(odds)::NUMERIC, 2)
     FROM tips 
     WHERE channel_id = p_channel_id
       AND event_date BETWEEN p_start_date AND p_end_date
       AND status IN ('win', 'loss')),
    0
  );
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Count Tips
CREATE OR REPLACE FUNCTION count_total_tips(
  p_channel_id INTEGER,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT COUNT(*) 
     FROM tips 
     WHERE channel_id = p_channel_id
       AND event_date BETWEEN p_start_date AND p_end_date
       AND status IN ('win', 'loss')),
    0
  );
END;
$$ LANGUAGE plpgsql;
```

### 2.5 Testar uma function
```sql
-- Teste simples
SELECT get_date_range('30d');
```

## 📋 TAREFA 3: Inserir Tips de Teste

### 3.1 Inserir 10 tips de teste para validação inicial
```sql
-- Inserir tips de teste para o canal 1 (Arbitragem Tennis Pro)
INSERT INTO tips (channel_id, description, event_date, odds, stake, status, profit_loss)
VALUES 
  (1, 'Nadal vs Djokovic - Total Games Over 38.5', NOW() - INTERVAL '5 days', 1.85, 3, 'win', (1.85-1)*3),
  (1, 'Alcaraz vs Sinner - Set 1 Over 9.5 games', NOW() - INTERVAL '4 days', 1.75, 2, 'loss', -2),
  (1, 'Federer vs Murray - Tie-break em qualquer set', NOW() - INTERVAL '3 days', 2.10, 2, 'win', (2.10-1)*2),
  (1, 'Medvedev -1.5 sets vs Rublev', NOW() - INTERVAL '2 days', 1.95, 3, 'win', (1.95-1)*3),
  (1, 'Tsitsipas vs Zverev - Total Aces Over 14.5', NOW() - INTERVAL '1 day', 1.80, 2, 'loss', -2);
```

### 3.2 Verificar inserção
```sql
SELECT 
  channel_id,
  COUNT(*) as total_tips,
  COUNT(*) FILTER (WHERE status = 'win') as wins,
  COUNT(*) FILTER (WHERE status = 'loss') as losses,
  SUM(profit_loss) as total_profit
FROM tips 
WHERE channel_id = 1
GROUP BY channel_id;
```

### 3.3 Testar cálculo de ROI
```sql
-- Testar ROI para canal 1 nos últimos 30 dias
SELECT 
  calculate_channel_roi(1, NOW() - INTERVAL '30 days', NOW()) as roi,
  calculate_win_rate(1, NOW() - INTERVAL '30 days', NOW()) as win_rate,
  calculate_profit_units(1, NOW() - INTERVAL '30 days', NOW()) as profit,
  count_total_tips(1, NOW() - INTERVAL '30 days', NOW()) as total_tips;
```

## 📋 TAREFA 4: Popular com Dados Realistas

### 4.1 Gerar tips para todos os canais
```sql
-- Script para gerar tips variadas
DO $$
DECLARE
  v_channel RECORD;
  v_date TIMESTAMPTZ;
  v_odds DECIMAL;
  v_stake DECIMAL;
  v_status VARCHAR(20);
  v_profit DECIMAL;
  i INTEGER;
BEGIN
  -- Para cada canal ativo
  FOR v_channel IN 
    SELECT id, name FROM channels WHERE status = 'active' LIMIT 10
  LOOP
    -- Gerar 40-50 tips por canal
    FOR i IN 1..45 LOOP
      -- Data aleatória nos últimos 6 meses
      v_date := NOW() - (random() * INTERVAL '180 days');
      
      -- Odds entre 1.5 e 3.0
      v_odds := 1.5 + (random() * 1.5);
      
      -- Stake entre 1 e 5
      v_stake := 1 + floor(random() * 5);
      
      -- Status: 54% win, 44% loss, 2% void
      IF random() < 0.54 THEN
        v_status := 'win';
        v_profit := (v_odds - 1) * v_stake;
      ELSIF random() < 0.98 THEN
        v_status := 'loss';
        v_profit := -v_stake;
      ELSE
        v_status := 'void';
        v_profit := 0;
      END IF;
      
      -- Inserir tip
      INSERT INTO tips (
        channel_id, 
        description, 
        event_date, 
        odds, 
        stake, 
        status, 
        profit_loss
      ) VALUES (
        v_channel.id,
        'Aposta ' || v_channel.name || ' #' || i,
        v_date,
        ROUND(v_odds::NUMERIC, 2),
        v_stake,
        v_status,
        ROUND(v_profit::NUMERIC, 2)
      );
    END LOOP;
  END LOOP;
END $$;
```

### 4.2 Verificar total de tips inseridas
```sql
SELECT 
  COUNT(*) as total_tips,
  COUNT(DISTINCT channel_id) as channels_with_tips,
  COUNT(*) FILTER (WHERE status = 'win') as total_wins,
  COUNT(*) FILTER (WHERE status = 'loss') as total_losses,
  COUNT(*) FILTER (WHERE status = 'void') as total_voids,
  ROUND(COUNT(*) FILTER (WHERE status = 'win')::NUMERIC / 
        NULLIF(COUNT(*) FILTER (WHERE status IN ('win', 'loss')), 0) * 100, 1) as win_rate_pct
FROM tips;
```

## 📋 TAREFA 5: Criar View Materializada para Cache

### 5.1 Criar view materializada
```sql
CREATE MATERIALIZED VIEW channel_metrics_live AS
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
  NOW() as calculated_at
FROM channels c
CROSS JOIN time_windows tw
CROSS JOIN LATERAL get_date_range(tw.time_window) dr
WHERE c.status = 'active';

-- Criar índice
CREATE INDEX idx_channel_metrics_live ON channel_metrics_live(channel_id, time_window);
```

### 5.2 Fazer refresh inicial
```sql
REFRESH MATERIALIZED VIEW channel_metrics_live;
```

### 5.3 Verificar dados na view
```sql
SELECT 
  channel_id,
  time_window,
  roi,
  win_rate,
  profit_units,
  total_tips
FROM channel_metrics_live
WHERE channel_id = 1
ORDER BY time_window;
```

## 📋 TAREFA 6: Validação Final

### 6.1 Comparar métricas calculadas vs hardcoded
```sql
-- Comparação para validar
SELECT 
  cm.channel_id,
  cm.time_window,
  cm.roi as roi_hardcoded,
  cml.roi as roi_calculated,
  ABS(cm.roi - cml.roi) as difference
FROM channel_metrics cm
JOIN channel_metrics_live cml 
  ON cm.channel_id = cml.channel_id 
  AND cm.time_window = cml.time_window
WHERE cm.channel_id IN (1, 2, 3)
  AND cm.time_window = '30d';
```

### 6.2 Performance check
```sql
-- Medir tempo de execução
EXPLAIN ANALYZE
SELECT * FROM channel_metrics_live 
WHERE channel_id = 1 AND time_window = '30d';
```

## 📝 TEMPLATE DE DOCUMENTAÇÃO DOS RESULTADOS

Crie o arquivo `.claude-instructions/feature-2.18-results.md` com este formato:

```markdown
# Resultados da Execução - Feature 2.18

## TAREFA 1: Criar Tabela Tips
- ✅ Tabela criada com sucesso
- ✅ Índices criados
- ✅ RLS policies aplicadas
- Colunas verificadas: 8 colunas

## TAREFA 2: Functions SQL
- ✅ get_date_range criada
- ✅ calculate_channel_roi criada
- ✅ calculate_win_rate criada
- ✅ Functions auxiliares criadas
- Teste de ROI retornou: [valor]

## TAREFA 3: Tips de Teste
- ✅ 5 tips inseridas para canal 1
- ROI calculado: [valor]%
- Win Rate: [valor]%

## TAREFA 4: Popular Dados
- ✅ [X] tips inseridas total
- ✅ [Y] canais com tips
- Win rate geral: [Z]%

## TAREFA 5: View Materializada
- ✅ View criada
- ✅ Refresh executado
- Tempo de query: [X]ms

## TAREFA 6: Validação
- Diferença média entre hardcoded e calculado: [X]%
- Performance: [Y]ms

## Erros Encontrados
[Liste qualquer erro aqui]

## Screenshots/Evidências
[Se conseguir capturar algo relevante]
```

## ⚠️ IMPORTANTE
1. Execute CADA comando separadamente
2. Se der erro, tente alternativas menores
3. Documente TUDO em `.claude-instructions/feature-2.18-results.md`
4. Use `project_id: bqfqrzllxmzpgtowahja` sempre

## 🎯 Após Completar
Quando terminar todas as tarefas:
1. Salve o documento de resultados
2. Informe ao Claude que as tarefas foram executadas
3. Claude continuará com a parte de UI