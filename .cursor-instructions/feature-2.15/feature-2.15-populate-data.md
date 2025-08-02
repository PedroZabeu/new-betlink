# Feature 2.15: Popular Dados no Supabase - CURSOR TASK

## 🎯 Objetivo
Popular as tabelas criadas na Feature 2.14 com os dados mockados existentes.

## 📋 Tarefas para Executar via MCP Supabase

### 1. Popular tabela `channels`
```sql
-- Inserir os 12 canais mockados
INSERT INTO channels (
  name, slug, description, is_premium, avatar,
  subscribers_count, max_subscribers, base_price,
  about_bio, about_methodology, about_specialties, about_experience
) VALUES
  ('Futebol Europeu Premium', 'futebol-europeu-premium', 'Especialista em ligas top 5 europeias com modelo matemático proprietário', true, 'CS', 487, 500, 14990, 
   'Carlos Silva é um dos tipsters mais respeitados do mercado, com anos de experiência em Futebol.',
   'Utilizo Model combinado com análise estatística avançada para identificar value bets em Over/Under.',
   ARRAY['Futebol', 'Over/Under', 'Pinnacle'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('NBA Props Master', 'nba-props-master', 'Player props NBA com análise estatística avançada e alta liquidez', true, 'MJ', 234, 300, 19990,
   'Michael Johnson é um dos tipsters mais respeitados do mercado, com anos de experiência em NBA.',
   'Utilizo Value Betting combinado com análise estatística avançada para identificar value bets em Player Props.',
   ARRAY['NBA', 'Player Props', 'Bet365'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Arbitragem Tênis ATP', 'arbitragem-tenis-atp', 'Oportunidades de arbitragem em ATP e WTA com ROI garantido', false, 'RL', 178, 200, 12990,
   'Roberto Lima é um dos tipsters mais respeitados do mercado, com anos de experiência em Tênis.',
   'Utilizo Arbitragem combinado com análise estatística avançada para identificar value bets em Money Line.',
   ARRAY['Tênis', 'Money Line', 'Multi'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('NFL Underdogs System', 'nfl-underdogs-system', 'Sistema contrarian focado em underdogs NFL com spreads alternativos', true, 'JW', 95, 100, 29990,
   'Jake Williams é um dos tipsters mais respeitados do mercado, com anos de experiência em NFL.',
   'Utilizo Value Betting combinado com análise estatística avançada para identificar value bets em Spread.',
   ARRAY['NFL', 'Spread', 'Pinnacle'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('MMA Insider Tips', 'mma-insider-tips', 'Inside info UFC e Bellator com análise técnica detalhada de lutas', true, 'PC', 156, 200, 17990,
   'Pedro Costa é um dos tipsters mais respeitados do mercado, com anos de experiência em MMA.',
   'Utilizo Insider combinado com análise estatística avançada para identificar value bets em Money Line.',
   ARRAY['MMA', 'Money Line', 'Betfair'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Basquete Asiático Pro', 'basquete-asiatico-pro', 'KBL, CBA e B-League com handicaps asiáticos e totais', false, 'LC', 89, 150, 9990,
   'Liu Chang é um dos tipsters mais respeitados do mercado, com anos de experiência em Basquete.',
   'Utilizo Model combinado com análise estatística avançada para identificar value bets em Handicap Asiático.',
   ARRAY['Basquete', 'Handicap Asiático', 'Bet365'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Soccer Chasing System', 'soccer-chasing-system', 'Sistema progressivo em cartões e escanteios com gestão de banca', false, 'JS', 312, 400, 7990,
   'João Silva é um dos tipsters mais respeitados do mercado, com anos de experiência em Futebol.',
   'Utilizo Chasing combinado com análise estatística avançada para identificar value bets em Over/Under.',
   ARRAY['Futebol', 'Over/Under', 'Betano'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Multi-Esportes Value', 'multi-esportes-value', 'Expected Value positivo em diversos esportes e mercados', true, 'AS', 189, 250, 16990,
   'Ana Santos é um dos tipsters mais respeitados do mercado, com anos de experiência em Multi.',
   'Utilizo Value Betting combinado com análise estatística avançada para identificar value bets em 1X2.',
   ARRAY['Multi', '1X2', 'Multi'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('eSports Rising Stars', 'esports-rising-stars', 'CS:GO, LoL e Valorant com foco em mercados de handicap', false, 'KP', 142, 200, 11990,
   'Kevin Park é um dos tipsters mais respeitados do mercado, com anos de experiência em eSports.',
   'Utilizo Model combinado com análise estatística avançada para identificar value bets em Spread.',
   ARRAY['eSports', 'Spread', 'Pinnacle'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Baseball Totals AI', 'baseball-totals-ai', 'MLB totals via machine learning com 70%+ de acerto', true, 'DT', 176, 200, 18990,
   'David Thompson é um dos tipsters mais respeitados do mercado, com anos de experiência em Baseball.',
   'Utilizo Model combinado com análise estatística avançada para identificar value bets em Over/Under.',
   ARRAY['Baseball', 'Over/Under', 'Bet365'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('Cartões Vermelhos Pro', 'cartoes-vermelhos-pro', 'Especialista em cartões vermelhos nas principais ligas com odds altas', false, 'FO', 67, 100, 8990,
   'Felipe Oliveira é um dos tipsters mais respeitados do mercado, com anos de experiência em Futebol.',
   'Utilizo Comp combinado com análise estatística avançada para identificar value bets em Over/Under.',
   ARRAY['Futebol', 'Over/Under', 'SportingBet'],
   'Mais de 5 anos no mercado de apostas profissionais'),
  
  ('NBA Live Betting', 'nba-live-betting', 'Apostas ao vivo NBA com algoritmo de momentum e análise em tempo real', true, 'ML', 198, 200, 24990,
   'Marcus Lee é um dos tipsters mais respeitados do mercado, com anos de experiência em NBA.',
   'Utilizo Model combinado com análise estatística avançada para identificar value bets em Spread.',
   ARRAY['NBA', 'Spread', 'Betfair'],
   'Mais de 5 anos no mercado de apostas profissionais');
```

### 2. Popular tabela `channel_tags`
```sql
-- Inserir tags para cada canal (assumindo que os IDs dos canais sejam sequenciais 1-12)
INSERT INTO channel_tags (channel_id, sport, bookmaker, method, market, liquidity) VALUES
  (1, 'Futebol', 'Pinnacle', 'Model', 'Over/Under', 'alta'),
  (2, 'NBA', 'Bet365', 'Value Betting', 'Player Props', 'alta'),
  (3, 'Tênis', 'Multi', 'Arbitragem', 'Money Line', 'baixa'),
  (4, 'NFL', 'Pinnacle', 'Value Betting', 'Spread', 'média'),
  (5, 'MMA', 'Betfair', 'Insider', 'Money Line', 'média'),
  (6, 'Basquete', 'Bet365', 'Model', 'Handicap Asiático', 'baixa'),
  (7, 'Futebol', 'Betano', 'Chasing', 'Over/Under', 'alta'),
  (8, 'Multi', 'Multi', 'Value Betting', '1X2', 'média'),
  (9, 'eSports', 'Pinnacle', 'Model', 'Spread', 'baixa'),
  (10, 'Baseball', 'Bet365', 'Model', 'Over/Under', 'alta'),
  (11, 'Futebol', 'SportingBet', 'Comp', 'Over/Under', 'baixa'),
  (12, 'NBA', 'Betfair', 'Model', 'Spread', 'alta');
```

### 3. Popular tabela `channel_metrics`
```sql
-- Inserir métricas para cada canal e período
-- Canal 1 - Futebol Europeu Premium
INSERT INTO channel_metrics (channel_id, time_window, total_tips, roi, profit_units, mdd, avg_odds, volume_units, rating, win_rate, total_bets) VALUES
  (1, '7d', 2847, 23.5, 45.2, -12.3, 2.08, 192, 4.9, 58.5, 42),
  (1, 'MTD', 2847, 19.8, 89.7, -18.4, 2.12, 453, 4.9, 57.2, 98),
  (1, '30d', 2847, 18.5, 127.3, -23.5, 2.15, 687, 4.8, 56.8, 156),
  (1, '180d', 2847, 15.2, 412.8, -45.2, 2.18, 2714, 4.8, 55.9, 892),
  (1, 'YTD', 2847, 16.8, 892.4, -67.3, 2.16, 5312, 4.8, 56.3, 1456),
  (1, 'all', 2847, 14.3, 1843.7, -89.5, 2.20, 12892, 4.7, 55.7, 2847);

-- Canal 2 - NBA Props Master
INSERT INTO channel_metrics (channel_id, time_window, total_tips, roi, profit_units, mdd, avg_odds, volume_units, rating, win_rate, total_bets) VALUES
  (2, '7d', 3156, 31.2, 67.8, -8.9, 1.95, 217, 5.0, 58.5, 42),
  (2, 'MTD', 3156, 28.4, 142.3, -15.2, 1.97, 501, 5.0, 57.2, 98),
  (2, '30d', 3156, 25.7, 198.4, -22.1, 1.98, 772, 4.9, 56.8, 156),
  (2, '180d', 3156, 22.3, 567.2, -38.7, 2.01, 2543, 4.9, 55.9, 892),
  (2, 'YTD', 3156, 24.1, 1123.8, -52.4, 2.00, 4662, 4.9, 56.3, 1456),
  (2, 'all', 3156, 21.8, 2341.5, -71.3, 2.02, 10743, 4.8, 55.7, 3156);

-- Repetir para os outros 10 canais...
-- (Por brevidade, incluí apenas 2 exemplos. Você deve executar para todos os 12 canais)
```

### 4. Popular tabela `subscription_plans`
```sql
-- Planos para Canal 1 (apenas mensal)
INSERT INTO subscription_plans (channel_id, name, duration_days, price, features) VALUES
  (1, 'Mensal', 30, 14990, ARRAY['Todas as tips', 'Suporte no Telegram']);

-- Planos para Canal 2 (mensal + trimestral)
INSERT INTO subscription_plans (channel_id, name, duration_days, price, original_price, discount, is_popular, features) VALUES
  (2, 'Mensal', 30, 19990, NULL, NULL, false, ARRAY['Todas as tips', 'Suporte no Telegram']),
  (2, 'Trimestral', 90, 50990, 59970, 15, true, ARRAY['Todas as tips', 'Suporte prioritário', 'Relatórios mensais']);

-- Planos para Canal 3 (mensal + trimestral + semestral)
INSERT INTO subscription_plans (channel_id, name, duration_days, price, original_price, discount, is_popular, features) VALUES
  (3, 'Mensal', 30, 12990, NULL, NULL, false, ARRAY['Todas as tips', 'Suporte no Telegram']),
  (3, 'Trimestral', 90, 25490, 29970, 15, false, ARRAY['Todas as tips', 'Suporte prioritário']),
  (3, 'Semestral', 180, 47990, 59940, 20, true, ARRAY['Todas as tips', 'Suporte VIP', 'Análises exclusivas']);

-- Canal 4 (todos os planos incluindo temporada)
INSERT INTO subscription_plans (channel_id, name, duration_days, price, original_price, discount, is_popular, features) VALUES
  (4, 'Mensal', 30, 29990, NULL, NULL, false, ARRAY['Todas as tips', 'Suporte no Telegram']),
  (4, 'Trimestral', 90, 76490, 89970, 15, false, ARRAY['Todas as tips', 'Suporte prioritário']),
  (4, 'Semestral', 180, 143990, 179940, 20, false, ARRAY['Todas as tips', 'Suporte VIP']),
  (4, 'Temporada', 300, 194990, 299900, 35, true, ARRAY['Todas as tips', 'Suporte VIP 24/7', 'Grupo exclusivo', 'Mentoria mensal']);

-- Continuar com o padrão para os outros canais...
```

### 5. Verificar dados inseridos
```sql
-- Verificar contagem de registros
SELECT 
  (SELECT COUNT(*) FROM channels) as channels_count,
  (SELECT COUNT(*) FROM channel_tags) as tags_count,
  (SELECT COUNT(*) FROM channel_metrics) as metrics_count,
  (SELECT COUNT(*) FROM subscription_plans) as plans_count;

-- Verificar amostra de dados
SELECT name, slug, is_premium, subscribers_count, max_subscribers 
FROM channels 
LIMIT 5;
```

## 📝 Notas Importantes

1. **Project ID**: Use o projeto `c7c87d83-da72-44cf-967f-f4f0d887cf08`

2. **Ordem de execução**:
   - Primeiro inserir `channels` (tabela principal)
   - Depois `channel_tags`, `channel_metrics` e `subscription_plans` (dependem de channel_id)

3. **IDs dos canais**:
   - Assumindo que os IDs serão sequenciais (1-12)
   - Se não forem, você precisará capturar os IDs após inserir channels

4. **Validações**:
   - Verificar se todas as tabelas foram populadas corretamente
   - Confirmar que foreign keys estão corretas
   - Testar se não há erros de constraint

5. **Reportar para Claude**:
   - Criar arquivo `.claude-instructions/feature-2.15-mcp-status.md`
   - Incluir contagem de registros inseridos
   - Mencionar qualquer erro encontrado

## 🎯 Resultado Esperado

Após executar todos os comandos:
- 12 canais na tabela `channels`
- 12 registros em `channel_tags`
- 72 registros em `channel_metrics` (6 períodos × 12 canais)
- ~30 registros em `subscription_plans` (varia por canal)

Boa sorte! 🚀