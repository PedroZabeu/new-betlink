# Feature 2.14: Setup Supabase + Tabelas Core + Página de Status

## 📋 Visão Geral

**Objetivo**: Estabelecer a infraestrutura de dados no Supabase e criar uma página de monitoramento visual em `/dev/supabase-status`.

**Complexidade**: 🟡 Média (4-5 horas)

**Entregáveis**:
1. Estrutura de tabelas no Supabase
2. Página `/dev/supabase-status` com dashboard visual
3. Componentes reutilizáveis para status
4. Queries de verificação do sistema

## 🗄️ Estrutura de Tabelas

### 1. Tabela `channels`
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

### 2. Tabela `channel_tipsters` (Many-to-Many)
```sql
CREATE TABLE channel_tipsters (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'tipster', -- 'owner', 'tipster', 'analyst'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);
```

### 3. Tabela `channel_tags`
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

### 4. Tabela `channel_metrics`
```sql
CREATE TABLE channel_metrics (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  time_window VARCHAR(10) NOT NULL,
  
  -- Todas as métricas
  total_tips INTEGER DEFAULT 0,
  roi DECIMAL(5,2),
  profit_units DECIMAL(10,2),
  mdd DECIMAL(10,2),
  avg_odds DECIMAL(5,2),
  volume_units INTEGER,
  rating DECIMAL(3,2),
  win_rate DECIMAL(5,2),
  total_bets INTEGER,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, time_window)
);
```

### 5. Tabela `subscription_plans`
```sql
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  duration_days INTEGER NOT NULL,
  price INTEGER NOT NULL, -- em centavos
  original_price INTEGER,
  discount INTEGER,
  features TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Índices para Performance
```sql
CREATE INDEX idx_channels_slug ON channels(slug);
CREATE INDEX idx_channels_active ON channels(is_active);
CREATE INDEX idx_channel_tipsters_channel ON channel_tipsters(channel_id);
CREATE INDEX idx_channel_tipsters_user ON channel_tipsters(user_id);
CREATE INDEX idx_channel_tags_channel ON channel_tags(channel_id);
CREATE INDEX idx_channel_metrics_channel ON channel_metrics(channel_id);
CREATE INDEX idx_subscription_plans_channel ON subscription_plans(channel_id);
```

## 📁 Estrutura de Arquivos

```
app/
├── dev/
│   └── supabase-status/
│       └── page.tsx         # Página principal do dashboard
│
components/
├── dev/
│   ├── StatusCard.tsx       # Card genérico de status
│   ├── ConnectionIndicator.tsx # Indicador de conexão (verde/vermelho)
│   ├── TableInfoCard.tsx    # Card com info de tabela
│   └── PerformanceMetrics.tsx # Métricas de performance
│
lib/
└── supabase/
    ├── queries/
    │   └── system.ts        # Queries de sistema/verificação
    └── types/
        └── database.ts      # Types gerados do Supabase
```

## 🎨 Design da Página `/dev/supabase-status`

### Layout
```
┌─────────────────────────────────────────────┐
│  🗄️ Supabase Status Dashboard               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Connection  │  │ Performance │          │
│  │    ✅       │  │   < 100ms   │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  📊 Database Tables                         │
│  ┌─────────────┐  ┌─────────────┐          │
│  │  profiles   │  │  channels   │          │
│  │  4 records  │  │  0 records  │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │channel_tags │  │   metrics   │          │
│  │  0 records  │  │  0 records  │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  🔑 Foreign Keys: All Connected ✅          │
│  🛡️ RLS Policies: Prepared (0 active)      │
└─────────────────────────────────────────────┘
```

### Componentes Visuais
1. **ConnectionIndicator**: Círculo verde/vermelho com animação pulse
2. **StatusCard**: Card com ícone, título e valor
3. **TableInfoCard**: Card clicável mostrando nome da tabela e contagem
4. **PerformanceMetrics**: Tempo de resposta com indicador de cor

## 🧪 Testes E2E (Playwright)

### Cenários de Teste
1. **Acesso à página**
   - Navegar para `/dev/supabase-status`
   - Verificar se página carrega sem erros

2. **Status de conexão**
   - Verificar indicador verde de conexão
   - Confirmar texto "Connected"

3. **Tabelas listadas**
   - Verificar presença de 6 cards de tabelas
   - Confirmar que profiles tem registros > 0
   - Confirmar que novas tabelas têm 0 registros

4. **Performance**
   - Verificar tempo de resposta < 100ms
   - Indicador deve estar verde

5. **Interatividade**
   - Clicar em card de tabela
   - Verificar se mostra estrutura (futuro)

## 📝 Implementação Step-by-Step

### Fase 1: Infraestrutura Supabase (Cursor via MCP)
1. Deletar tabelas antigas (já feito)
2. Criar novas tabelas com SQL fornecido
3. Criar índices para performance
4. Verificar foreign keys

### Fase 2: Frontend (Claude)
1. Criar estrutura de pastas `/app/dev`
2. Implementar página base
3. Criar componentes de status
4. Implementar queries de verificação

### Fase 3: Integração
1. Conectar queries com componentes
2. Adicionar loading states
3. Implementar error handling
4. Polir visual

### Fase 4: Testes e Documentação
1. Claude Code escreve e executa testes E2E
2. Atualizar documentação
3. Criar handover
4. Commit final

## ⚠️ Pontos de Atenção

1. **Não quebrar nada existente**
   - Sistema de auth deve continuar funcionando
   - Tabela profiles não pode ser alterada (exceto campos novos)

2. **Performance**
   - Queries devem ser otimizadas
   - Usar índices apropriados
   - Cache quando possível

3. **Segurança**
   - Usar apenas anon key
   - Preparar estrutura para RLS (mas não ativar)
   - Não expor dados sensíveis

## 🎯 Critérios de Sucesso

- [ ] Todas as 5 tabelas criadas no Supabase
- [ ] Página `/dev/supabase-status` acessível
- [ ] Dashboard mostra status correto
- [ ] Performance < 100ms
- [ ] Zero erros no console
- [ ] Testes E2E passando

## 🔗 Arquivos Relacionados

- Instruções Cursor (SQL): `.cursor-instructions/feature-2.14-setup-tables.md`
- Teste Guide: `docs/features/testing/feature-2.14-test-guide.md`
- Progress: `docs/features/progress/feature-2.14-progress.md`
- Handover: `docs/features/handover/feature-2.14-handover.md`