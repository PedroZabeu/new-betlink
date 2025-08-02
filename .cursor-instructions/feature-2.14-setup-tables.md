# Feature 2.14 - Instruções para Setup de Tabelas via MCP Supabase

## 🎯 Objetivo
Criar toda a estrutura de tabelas no Supabase usando o MCP para suportar o sistema de canais de tipsters.

## 📋 Tarefas para Cursor

### 1. Verificar Estado Atual

Primeiro, execute esta query para confirmar que só temos a tabela profiles:

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Esperado**: Apenas a tabela `profiles` deve aparecer.

### 2. Criar as Tabelas (Execute uma por vez)

#### 2.1 Tabela `channels`
```sql
CREATE TABLE channels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_premium BOOLEAN DEFAULT false,
  avatar VARCHAR(10),
  
  -- Limites de assinantes
  subscribers_count INTEGER DEFAULT 0,
  max_subscribers INTEGER NOT NULL,
  
  -- Preço base (centavos)
  base_price INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Dados do canal (sem métricas)
  about_bio TEXT,
  about_methodology TEXT,
  about_specialties TEXT[],
  about_experience VARCHAR(255)
);
```

#### 2.2 Tabela `channel_tipsters`
```sql
CREATE TABLE channel_tipsters (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'tipster',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Adicionar comentário para clareza
COMMENT ON COLUMN channel_tipsters.role IS 'Valores possíveis: owner, tipster, analyst';
```

#### 2.3 Tabela `channel_tags`
```sql
CREATE TABLE channel_tags (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  sport VARCHAR(50),
  bookmaker VARCHAR(50),
  method VARCHAR(50),
  market VARCHAR(50),
  liquidity VARCHAR(20) CHECK (liquidity IN ('alta', 'média', 'baixa')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.4 Tabela `channel_metrics`
```sql
CREATE TABLE channel_metrics (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  time_window VARCHAR(10) NOT NULL CHECK (time_window IN ('7d', '30d', '3m', '6m', '12m', 'all')),
  
  -- Todas as métricas
  total_tips INTEGER DEFAULT 0,
  roi DECIMAL(5,2),
  profit_units DECIMAL(10,2),
  mdd DECIMAL(10,2),
  avg_odds DECIMAL(5,2),
  volume_units INTEGER,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  win_rate DECIMAL(5,2) CHECK (win_rate >= 0 AND win_rate <= 100),
  total_bets INTEGER DEFAULT 0,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, time_window)
);
```

#### 2.5 Tabela `subscription_plans`
```sql
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  price INTEGER NOT NULL CHECK (price > 0), -- em centavos
  original_price INTEGER CHECK (original_price >= price),
  discount INTEGER CHECK (discount >= 0 AND discount <= 100),
  features TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Criar Índices para Performance

```sql
-- Índices para channels
CREATE INDEX idx_channels_slug ON channels(slug);
CREATE INDEX idx_channels_active ON channels(is_active);

-- Índices para channel_tipsters
CREATE INDEX idx_channel_tipsters_channel ON channel_tipsters(channel_id);
CREATE INDEX idx_channel_tipsters_user ON channel_tipsters(user_id);

-- Índices para channel_tags
CREATE INDEX idx_channel_tags_channel ON channel_tags(channel_id);
CREATE INDEX idx_channel_tags_sport ON channel_tags(sport);
CREATE INDEX idx_channel_tags_bookmaker ON channel_tags(bookmaker);

-- Índices para channel_metrics
CREATE INDEX idx_channel_metrics_channel ON channel_metrics(channel_id);
CREATE INDEX idx_channel_metrics_window ON channel_metrics(time_window);

-- Índices para subscription_plans
CREATE INDEX idx_subscription_plans_channel ON subscription_plans(channel_id);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
```

### 4. Verificar Criação das Tabelas

Execute esta query para confirmar que todas as tabelas foram criadas:

```sql
SELECT 
  t.table_name,
  COUNT(c.column_name) as column_count,
  pg_size_pretty(pg_total_relation_size('public.' || t.table_name)) as size
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;
```

**Resultado esperado**:
- profiles: X colunas
- channels: 16 colunas
- channel_tipsters: 5 colunas
- channel_tags: 7 colunas
- channel_metrics: 12 colunas
- subscription_plans: 10 colunas

### 5. Verificar Foreign Keys

```sql
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### 6. Testar Performance de Conexão

```sql
-- Query simples para testar tempo de resposta
EXPLAIN ANALYZE SELECT 1;
```

Anote o tempo de execução (deve ser < 100ms).

### 7. Criar Arquivo de Status

Crie um arquivo em:
`/Users/pedroivozabeu/Projetos/new-betlink/.claude-instructions/feature-2.14-mcp-status.md`

Com o seguinte formato:

```markdown
# Feature 2.14 - Status da Execução MCP

## ✅ Tabelas Criadas
- [x] channels (16 colunas)
- [x] channel_tipsters (5 colunas)
- [x] channel_tags (7 colunas)
- [x] channel_metrics (12 colunas)
- [x] subscription_plans (10 colunas)

## 🔑 Foreign Keys Verificadas
- [x] channel_tipsters → channels(id)
- [x] channel_tipsters → profiles(id)
- [x] channel_tags → channels(id)
- [x] channel_metrics → channels(id)
- [x] subscription_plans → channels(id)

## 📊 Índices Criados
- [x] 11 índices criados com sucesso

## ⚡ Performance
- Tempo de resposta: XXms
- Status: ✅ OK (< 100ms)

## 🚨 Problemas Encontrados
(Nenhum problema encontrado)

## Timestamp
Executado em: [DATA/HORA]
```

## ⚠️ Importante
- Execute as queries uma por vez
- Verifique cada resultado antes de prosseguir
- Se houver erro, copie a mensagem completa no arquivo de status
- NÃO delete ou modifique a tabela `profiles`