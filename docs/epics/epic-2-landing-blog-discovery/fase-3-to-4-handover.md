# Handover: Fase 3 (Discovery) → Fase 4 (Integração Supabase)

## 📋 Resumo Executivo

Este documento detalha toda a estrutura de dados mockados criada na Fase 3 que precisa ser migrada para o Supabase na Fase 4, incluindo schemas de banco, queries necessárias, e pontos de integração no frontend.

## 🏗️ Estrutura de Dados Atual (Mockada)

### 1. Channels (Canais)
```typescript
// Localização: /lib/data/mock-channels.ts
interface Channel {
  // Identificação
  id: string;                    // Mock: "ch_1", "ch_2"...
  slug: string;                  // Mock: "elite-tips", "green-masters"...
  
  // Informações Básicas
  name: string;                  // Nome do canal
  tipster: string;               // Nome do tipster
  avatar: string;                // Mock: iniciais (será URL da imagem)
  description: string;           // Descrição breve
  isPremium: boolean;            // Canal premium?
  
  // Assinantes e Ocupação
  subscribers: number;           // Quantidade atual
  maxSubscribers: number;        // Limite do canal
  waitlistCount?: number;        // Se lotado, quantos na fila
  
  // Preços Base (mensal)
  price: number;                 // Preço padrão mensal
  
  // Categorização (Tags)
  tags: {
    sport: string;               // "Futebol", "Basquete", etc
    bookmaker: string;           // "Bet365", "Betfair", etc
    method: string;              // "Pré-live", "Live", "Trading"
    market: string;              // "Gols", "Handicap", etc
    liquidity: 'alta' | 'media' | 'baixa';
  };
  
  // Métricas por Período
  metrics: {
    [key in TimeWindow]: {       // "7d", "30d", "3m", "6m", "1y", "all"
      roi: number;               // Return on Investment %
      profitUnits: number;       // Lucro em unidades
      mdd: number;               // Max Drawdown
      avgOdds: number;           // Odds média
      volumeUnits: number;       // Volume apostado
      rating: number;            // Avaliação média (1-5)
      totalBets: number;         // Total de apostas
      winRate: number;           // Taxa de acerto %
    };
  };
  
  // Dados Detalhados (Feature 2.12)
  subscriptionPlans: SubscriptionPlan[];  // Planos disponíveis
  about: {
    bio: string;                 // Biografia do tipster
    methodology: string;         // Metodologia de trabalho
    specialties: string[];       // Especialidades
    experience: string;          // Tempo de experiência
  };
  
  // Estatísticas e Histórico
  chartData: ChartDataPoint[];   // Dados para gráfico
  recentTips: Tip[];            // Últimas tips
  reviews: Review[];            // Avaliações
  faqs: FAQ[];                  // Perguntas frequentes
}
```

### 2. Subscription Plans (Planos de Assinatura)
```typescript
interface SubscriptionPlan {
  id: string;                    // Mock: "plan_monthly_ch1"
  channelId: string;             // Referência ao canal
  name: string;                  // "Mensal", "Trimestral", etc
  duration: number;              // Dias: 30, 90, 180, 365
  price: number;                 // Preço do plano
  originalPrice?: number;        // Preço sem desconto
  discount?: number;             // Percentual de desconto
  features?: string[];           // Benefícios do plano
  isPopular?: boolean;           // Plano mais vendido
  isActive: boolean;             // Plano disponível?
}
```

### 3. Tips (Apostas/Dicas)
```typescript
interface Tip {
  id: string;                    // Mock: "tip_1234"
  channelId: string;             // Canal que enviou
  date: string;                  // Data da tip
  event: string;                 // "Flamengo x Vasco"
  market: string;                // "Over 2.5 gols"
  odds: number;                  // 1.85
  stake: number;                 // Unidades apostadas
  result: 'win' | 'loss' | 'void' | 'pending';
  profit: number;                // Lucro/prejuízo
  sport: string;                 // Esporte
  competition: string;           // Campeonato
  analysis?: string;             // Análise da tip (premium)
}
```

### 4. Captured Leads (Checkout Data)
```typescript
interface CapturedLead {
  // Identificação
  id: string;                    // Mock: UUID gerado
  userId: string;                // ID do usuário autenticado
  capturedAt: string;            // Timestamp da captura
  
  // Dados da Assinatura
  subscription: {
    channelId: string;
    planId: string;
    price: number;
    period: string;
  };
  
  // Dados de Contato
  contact: {
    whatsapp: string;            // Formato: (11) 98765-4321
    telegram: string;            // Username com @
  };
  
  // Dados de Faturamento (se fornecidos)
  billing?: {
    cpf: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Método de Pagamento Escolhido
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  
  // Analytics
  source: 'channel-card' | 'channel-detail';
  completionTime: number;        // Segundos para completar
  abandoned: boolean;            // Se foi abandono recuperado
}
```

## 🗄️ Schema Supabase Necessário

### 1. Tabela: channels
```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tipster_id UUID REFERENCES profiles(id),
  avatar_url TEXT,
  description TEXT,
  is_premium BOOLEAN DEFAULT false,
  
  -- Limites e ocupação
  max_subscribers INTEGER DEFAULT 100,
  
  -- Preço base (mensal)
  base_price DECIMAL(10,2) NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_channels_slug ON channels(slug);
CREATE INDEX idx_channels_tipster ON channels(tipster_id);
CREATE INDEX idx_channels_active ON channels(is_active);
```

### 2. Tabela: channel_tags
```sql
CREATE TABLE channel_tags (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  bookmaker TEXT NOT NULL,
  method TEXT NOT NULL,
  market TEXT NOT NULL,
  liquidity TEXT CHECK (liquidity IN ('alta', 'media', 'baixa')),
  PRIMARY KEY (channel_id)
);
```

### 3. Tabela: channel_metrics
```sql
CREATE TABLE channel_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- '7d', '30d', '3m', '6m', '1y', 'all'
  
  -- Métricas
  roi DECIMAL(10,2),
  profit_units DECIMAL(10,2),
  mdd DECIMAL(10,2),
  avg_odds DECIMAL(10,2),
  volume_units DECIMAL(10,2),
  total_bets INTEGER,
  win_rate DECIMAL(5,2),
  
  -- Metadados
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, period)
);

CREATE INDEX idx_metrics_channel_period ON channel_metrics(channel_id, period);
```

### 4. Tabela: subscription_plans
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER,
  features JSONB,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plans_channel ON subscription_plans(channel_id);
```

### 5. Tabela: tips
```sql
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  
  -- Informações da tip
  event TEXT NOT NULL,
  market TEXT NOT NULL,
  odds DECIMAL(10,2) NOT NULL,
  stake DECIMAL(10,2) NOT NULL,
  sport TEXT NOT NULL,
  competition TEXT,
  analysis TEXT, -- Visível apenas para assinantes
  
  -- Resultado
  result TEXT CHECK (result IN ('win', 'loss', 'void', 'pending')),
  profit DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_date TIMESTAMPTZ NOT NULL,
  settled_at TIMESTAMPTZ
);

CREATE INDEX idx_tips_channel ON tips(channel_id);
CREATE INDEX idx_tips_date ON tips(event_date DESC);
CREATE INDEX idx_tips_result ON tips(result);
```

### 6. Tabela: channel_reviews
```sql
CREATE TABLE channel_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_channel ON channel_reviews(channel_id);
```

### 7. Tabela: captured_leads
```sql
CREATE TABLE captured_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  
  -- Dados da assinatura pretendida
  channel_id UUID REFERENCES channels(id),
  plan_id UUID REFERENCES subscription_plans(id),
  plan_price DECIMAL(10,2),
  
  -- Contato
  whatsapp TEXT,
  telegram_username TEXT,
  
  -- Faturamento (opcional)
  billing_data JSONB,
  
  -- Pagamento
  payment_method TEXT,
  
  -- Analytics
  source TEXT,
  completion_time_seconds INTEGER,
  was_abandoned_recovery BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_user ON captured_leads(user_id);
CREATE INDEX idx_leads_channel ON captured_leads(channel_id);
```

### 8. Views Auxiliares
```sql
-- View para ocupação dos canais
CREATE VIEW channel_occupancy AS
SELECT 
  c.id,
  c.max_subscribers,
  COUNT(DISTINCT s.user_id) as current_subscribers,
  CASE 
    WHEN COUNT(DISTINCT s.user_id) >= c.max_subscribers THEN true
    ELSE false
  END as has_waitlist,
  COUNT(DISTINCT w.user_id) as waitlist_count
FROM channels c
LEFT JOIN subscriptions s ON c.id = s.channel_id AND s.status = 'active'
LEFT JOIN waitlist w ON c.id = w.channel_id AND w.status = 'waiting'
GROUP BY c.id;

-- View para rating médio
CREATE VIEW channel_ratings AS
SELECT 
  channel_id,
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews
FROM channel_reviews
GROUP BY channel_id;
```

## 🔌 Pontos de Integração no Frontend

### 1. Substituir Mock Data Imports
```typescript
// ANTES (mock):
import { mockChannels } from '@/lib/data/mock-channels';

// DEPOIS (Supabase):
import { getChannels } from '@/lib/supabase/queries/channels';
```

### 2. Queries Necessárias

#### Listar Canais (Feature 2.11)
```typescript
// /lib/supabase/queries/channels.ts
export async function getChannels(filters?: ChannelFilters) {
  const query = supabase
    .from('channels')
    .select(`
      *,
      tags:channel_tags(*),
      metrics:channel_metrics(*),
      occupancy:channel_occupancy(*),
      ratings:channel_ratings(*)
    `)
    .eq('is_active', true);
    
  // Aplicar filtros
  if (filters?.sport) {
    query.eq('tags.sport', filters.sport);
  }
  // ... outros filtros
  
  return query;
}
```

#### Detalhes do Canal (Feature 2.12)
```typescript
export async function getChannelDetails(slug: string) {
  return supabase
    .from('channels')
    .select(`
      *,
      tipster:profiles!tipster_id(name, avatar_url),
      tags:channel_tags(*),
      metrics:channel_metrics(*),
      plans:subscription_plans(*),
      recent_tips:tips(*)
        .order('event_date', { ascending: false })
        .limit(20),
      reviews:channel_reviews(*)
        .order('created_at', { ascending: false })
        .limit(10)
    `)
    .eq('slug', slug)
    .single();
}
```

#### Capturar Lead (Feature 2.13)
```typescript
export async function captureLeadData(data: LeadData) {
  return supabase
    .from('captured_leads')
    .insert({
      user_id: data.userId,
      channel_id: data.channelId,
      plan_id: data.planId,
      plan_price: data.price,
      whatsapp: data.contact.whatsapp,
      telegram_username: data.contact.telegram,
      billing_data: data.billing,
      payment_method: data.paymentMethod,
      source: data.source,
      completion_time_seconds: data.completionTime
    });
}
```

### 3. Componentes a Atualizar

#### ChannelCard (2.11)
```typescript
// Mudanças necessárias:
// 1. Receber dados do Supabase ao invés de mock
// 2. URLs reais de imagens ao invés de iniciais
// 3. Ocupação calculada pela view
```

#### ChannelDetail (2.12)
```typescript
// Mudanças necessárias:
// 1. generateStaticParams usando Supabase
// 2. Dados de gráfico vindos de tips reais
// 3. Reviews e FAQs do banco
```

#### CheckoutFlow (2.13)
```typescript
// Mudanças necessárias:
// 1. Salvar leads no Supabase
// 2. Verificar disponibilidade em tempo real
// 3. Integrar com sistema de pagamento real
```

## 📊 Dados de Transição

### Volume de Dados Mockados
- 12 canais completos
- 4-5 planos por canal (~50 planos)
- 50+ tips por canal (~600 tips)
- 5-10 reviews por canal (~100 reviews)
- 3-5 FAQs por canal (~50 FAQs)

### Prioridade de Migração
1. **Crítico**: Channels + Tags + Plans
2. **Alto**: Metrics + Occupancy
3. **Médio**: Tips + Reviews
4. **Baixo**: FAQs + Analytics

## 🚀 Checklist de Migração

### Backend/Supabase
- [ ] Criar todas as tabelas no Supabase
- [ ] Implementar RLS policies
- [ ] Criar functions para cálculos complexos
- [ ] Popular com dados de teste/produção
- [ ] Criar indexes para performance
- [ ] Implementar triggers necessários

### Frontend
- [ ] Criar camada de queries Supabase
- [ ] Substituir imports de mock data
- [ ] Atualizar tipos TypeScript
- [ ] Implementar cache e otimizações
- [ ] Ajustar error handling
- [ ] Testar todas as features

### Validação
- [ ] Performance mantida (< 3s load)
- [ ] Todas features funcionando
- [ ] Dados consistentes
- [ ] Mobile responsivo
- [ ] Zero regressões

## ⚠️ Pontos de Atenção

1. **Performance**: Queries complexas podem precisar de otimização
2. **Cache**: Implementar cache para dados que mudam pouco
3. **Real-time**: Considerar subscriptions para ocupação
4. **Imagens**: Migrar de iniciais para URLs reais
5. **Segurança**: RLS policies para todos os dados sensíveis

## 📝 Notas Finais

Este handover garante que toda a estrutura criada na Fase 3 seja preservada e melhorada na Fase 4. A arquitetura foi pensada para facilitar a migração, mantendo a mesma estrutura de dados e apenas mudando a fonte de mock para Supabase.