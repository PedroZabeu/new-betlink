# Feature 2.15: Investigar Sincronização 75% - CURSOR TASK

## 🎯 Objetivo
Investigar por que a sincronização está em 75% e não 100%, identificar os 3 canais com "0 Differences" mas 0% sync.

## 📋 Tarefas de Investigação

### 1. Verificar Canais no Banco
```sql
-- Listar todos os canais com seus slugs
SELECT id, name, slug, is_premium, base_price 
FROM channels 
ORDER BY id;

-- Comparar com os slugs esperados dos mocks:
-- futebol-europeu-premium
-- nba-props-master
-- arbitragem-tenis-atp
-- nfl-underdogs-system
-- mma-insider-tips
-- basquete-asiatico-pro
-- soccer-chasing-system
-- multi-esportes-value
-- esports-rising-stars
-- baseball-totals-ai
-- cartoes-vermelhos-pro
-- nba-live-betting
```

### 2. Identificar Canais Faltantes
```sql
-- Verificar se todos os 12 canais existem
SELECT COUNT(*) as total_channels FROM channels;

-- Buscar especificamente os canais problemáticos
SELECT * FROM channels 
WHERE slug IN (
  'arbitragem-tenis-atp',
  'basquete-asiatico-pro', 
  'cartoes-vermelhos-pro'
);
```

### 3. Analisar Estrutura de Dados
```sql
-- Ver estrutura completa de um canal
SELECT 
  c.*,
  ct.sport, ct.bookmaker, ct.method, ct.market, ct.liquidity,
  COUNT(DISTINCT cm.id) as metrics_count,
  COUNT(DISTINCT sp.id) as plans_count
FROM channels c
LEFT JOIN channel_tags ct ON c.id = ct.channel_id
LEFT JOIN channel_metrics cm ON c.id = cm.channel_id
LEFT JOIN subscription_plans sp ON c.id = sp.channel_id
WHERE c.id = 1
GROUP BY c.id, ct.sport, ct.bookmaker, ct.method, ct.market, ct.liquidity;
```

### 4. Comparar Campos Mock vs DB

**Campos para verificar:**
```
Mock TypeScript          →  Supabase DB
-----------------------------------------
name                     →  name
description              →  description  
isPremium               →  is_premium
avatar                  →  avatar
subscribers             →  subscribers_count
maxSubscribers          →  max_subscribers
price (149.90)          →  base_price (14990)
createdAt               →  created_at
totalTips               →  (não existe direto - está em metrics?)
tipster                 →  (não existe - relação channel_tipsters)
```

### 5. Verificar Dados de Tags
```sql
-- Verificar se todas as tags foram inseridas
SELECT 
  c.name,
  ct.sport,
  ct.bookmaker,
  ct.method,
  ct.market,
  ct.liquidity
FROM channels c
LEFT JOIN channel_tags ct ON c.id = ct.channel_id
ORDER BY c.id;
```

### 6. Analisar Métricas
```sql
-- Ver se todas as métricas foram inseridas corretamente
SELECT 
  c.name,
  cm.time_window,
  cm.roi,
  cm.profit_units,
  cm.avg_odds
FROM channels c
JOIN channel_metrics cm ON c.id = cm.channel_id
WHERE cm.time_window = '7d'
ORDER BY c.id;
```

## 📝 Documentar Achados

Criar arquivo `.claude-instructions/feature-2.15-sync-findings.md` com:

### 1. Lista de Problemas Encontrados
```markdown
## Problemas de Sincronização

### Canais Não Encontrados
- [ ] Canal X: slug esperado vs slug no banco
- [ ] Canal Y: motivo
- [ ] Canal Z: motivo

### Diferenças de Campos
- [ ] Campo `tipster`: não existe no banco (usar channel_tipsters)
- [ ] Campo `totalTips`: não existe (calcular de metrics?)
- [ ] Campo `price`: converter para centavos
- [ ] etc...

### Slugs Incorretos
- Mock: "NFL Underdogs System" → slug esperado: "nfl-underdogs-system"
- Banco: slug real é "___________"
```

### 2. Dados Completos dos 3 Canais Problemáticos
```markdown
## Canais com 0% Sync

### Canal: Arbitragem Tênis ATP
- Status no banco: [existe/não existe]
- ID: ___
- Slug no banco: ___
- Motivo do 0%: ___

### Canal: Basquete Asiático Pro
- Status no banco: [existe/não existe]
- ID: ___
- Slug no banco: ___
- Motivo do 0%: ___

### Canal: Cartões Vermelhos Pro
- Status no banco: [existe/não existe]
- ID: ___
- Slug no banco: ___
- Motivo do 0%: ___
```

### 3. Mapeamento Completo Mock → DB
```markdown
## Mapeamento de Campos

| Mock Field | DB Field | Tipo | Conversão Necessária |
|------------|----------|------|---------------------|
| name | name | string | Não |
| isPremium | is_premium | boolean | Não |
| price | base_price | number | × 100 (reais → centavos) |
| tipster | ??? | string | Não existe diretamente |
| ... | ... | ... | ... |
```

### 4. SQL para Corrigir (se necessário)
```sql
-- Exemplo: Se slugs estiverem errados
UPDATE channels 
SET slug = 'slug-correto' 
WHERE name = 'Nome do Canal';

-- Exemplo: Se faltar campo tipster
ALTER TABLE channels 
ADD COLUMN tipster_name VARCHAR(255);

UPDATE channels 
SET tipster_name = 'Carlos Silva' 
WHERE id = 1;
```

## 🎯 Resultado Esperado

Após investigação, reportar:
1. **Causa exata do 75%** (quais campos não batem)
2. **Por que 3 canais têm 0% sync** (não existem? slugs errados?)
3. **Lista de ajustes necessários** para chegar a 100%
4. **Decisão**: Ajustar código ou aceitar diferenças?

## 📍 Notas

- Project ID: `c7c87d83-da72-44cf-967f-f4f0d887cf08`
- Foco nos 3 canais problemáticos primeiro
- Documentar TUDO que encontrar
- Se precisar fazer correções no banco, documentar antes

Boa investigação! 🕵️